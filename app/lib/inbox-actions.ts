"use server"

import { writeFile, mkdir } from "fs/promises"
import path from "path"
import sharp from "sharp"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { getDb } from "./db"
import { getCurrentUser } from "./session"
import { adjustUserBalance } from "./user"
import { getPaymentSettings } from "./payment-settings"
import {
    createConversation, getConversationById, addMessage, markConversationRead,
    setConversationArchived, countOpenSupportConversations, listConversations,
    countRecentMessagesByUser,
} from "./inbox"
import { createTopupRequest, getTopupById, resolveTopup } from "./topups"
import { SUPPORT_CATEGORIES, PRIORITIES, SupportCategory, Priority } from "@/models/conversation"
import { TOPUP_METHODS, TopupMethod } from "@/models/topup-request"

// Chat attachments live OUTSIDE public/ — they are payment screenshots and
// are only served through /api/attachments after a membership check
const ATTACHMENTS_DIR = path.join(process.cwd(), "private-uploads", "chat")

const MAX_MESSAGE_LENGTH = 5000
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024
const MESSAGES_PER_MINUTE = 20
const MAX_OPEN_SUPPORT = 5

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"]

// ── helpers ─────────────────────────────────────────────

async function requireUser() {
    const user = await getCurrentUser()
    if (!user) throw new Error("Not logged in")
    return user
}

// The viewer must be the conversation's user, or an admin
async function requireMembership(conversationId: string) {
    const user = await requireUser()
    const conversation = await getConversationById(conversationId)
    if (!conversation) throw new Error("Not found")
    const isOwner = conversation.userId === user._id!.toString()
    if (!isOwner && !user.isAdmin) throw new Error("Not authorized")
    return { user, conversation, side: user.isAdmin && !isOwner ? "admin" as const : "user" as const }
}

// Re-encode through sharp: validates it's a real image and strips EXIF metadata
async function saveAttachment(file: File): Promise<{ file: string; name: string } | { error: string }> {
    if (!IMAGE_TYPES.includes(file.type)) return { error: "Only PNG, JPG or WebP images are allowed." }
    if (file.size === 0) return { error: "File is empty." }
    if (file.size > MAX_ATTACHMENT_BYTES) return { error: "Image too large (max 5 MB)." }

    try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const processed = await sharp(buffer)
            .rotate()
            .resize({ width: 1600, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toBuffer()

        const filename = `${Date.now()}_${Math.random().toString(16).slice(2, 10)}.webp`
        await mkdir(ATTACHMENTS_DIR, { recursive: true })
        await writeFile(path.join(ATTACHMENTS_DIR, filename), processed)
        return { file: filename, name: file.name.slice(0, 120) }
    } catch {
        return { error: "Could not process the image. Please try a different file." }
    }
}

// ── messaging ───────────────────────────────────────────

export async function sendMessageAction(conversationId: string, formData: FormData) {
    let membership
    try { membership = await requireMembership(conversationId) } catch { return { error: "Not authorized" } }
    const { user, conversation, side } = membership

    if (conversation.status === "closed") return { error: "This conversation is closed." }

    const body = String(formData.get("body") ?? "").trim()
    const file = formData.get("attachment") as File | null
    const hasFile = file && file.size > 0

    if (!body && !hasFile) return { error: "Write a message or attach an image." }
    if (body.length > MAX_MESSAGE_LENGTH) return { error: "Message is too long (max 5000 characters)." }

    // Rate limit non-admin senders
    if (side === "user") {
        const own = await listConversations({ userId: user._id!.toString(), archived: false, forAdmin: false })
        const ids = own.map(c => c._id!.toString())
        const recent = await countRecentMessagesByUser(user._id!.toString(), ids, 60)
        if (recent >= MESSAGES_PER_MINUTE) return { error: "You are sending messages too fast — wait a minute." }
    }

    let attachment: { file: string; name: string } | undefined
    if (hasFile) {
        const saved = await saveAttachment(file)
        if ("error" in saved) return { error: saved.error }
        attachment = saved
    }

    await addMessage({
        conversationId,
        sender: side,
        body,
        attachmentFile: attachment?.file,
        attachmentName: attachment?.name,
    })

    revalidatePath(`/admin/inbox/${conversationId}`)
    revalidatePath("/admin/inbox")
    return { ok: true }
}

export async function markReadAction(conversationId: string) {
    try {
        const { side } = await requireMembership(conversationId)
        await markConversationRead(conversationId, side)
    } catch { /* not a member — nothing to mark */ }
}

export async function archiveConversationAction(conversationId: string, archived: boolean) {
    try {
        const { side } = await requireMembership(conversationId)
        await setConversationArchived(conversationId, side, archived)
        revalidatePath("/admin/inbox")
    } catch { /* not a member */ }
}

// ── support conversations (user picks category + priority) ──

export async function startSupportConversationAction(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: "Please log in again." }

    const category = String(formData.get("category") ?? "")
    const priority = String(formData.get("priority") ?? "")
    const message = String(formData.get("message") ?? "").trim()

    // The dropdowns are suggestions — these whitelists are the decision
    if (!SUPPORT_CATEGORIES.some(c => c.value === category)) return { error: "Please pick a category." }
    if (!PRIORITIES.includes(priority as Priority)) return { error: "Please pick a priority." }
    if (message.length < 5) return { error: "Please describe your question (at least 5 characters)." }
    if (message.length > MAX_MESSAGE_LENGTH) return { error: "Message is too long (max 5000 characters)." }

    const open = await countOpenSupportConversations(user._id!.toString())
    if (open >= MAX_OPEN_SUPPORT) return { error: "You already have several open conversations — please continue in one of them." }

    const label = SUPPORT_CATEGORIES.find(c => c.value === category)!.label
    const conversationId = await createConversation({
        userId: user._id!.toString(),
        topic: "support",
        category: category as SupportCategory,
        priority: priority as Priority,
        subject: label,
    })
    await addMessage({ conversationId, sender: "user", body: message })

    revalidatePath("/admin/inbox")
    return { ok: true, conversationId }
}

// ── top-up flow ─────────────────────────────────────────

export async function requestTopupAction(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: "Please log in again." }

    const method = String(formData.get("method") ?? "")
    const amount = Number(formData.get("amount"))

    if (!TOPUP_METHODS.some(m => m.value === method)) return { error: "Please pick a payment method." }

    const settings = await getPaymentSettings()
    const min = settings.minimumTopUp || 25
    if (!Number.isFinite(amount) || amount < min) return { error: `Minimum top-up is $${min}.` }
    if (amount > 100000) return { error: "Maximum top-up is $100,000." }

    const rounded = Math.round(amount * 100) / 100
    const methodLabel = TOPUP_METHODS.find(m => m.value === method)!.label

    const conversationId = await createConversation({
        userId: user._id!.toString(),
        topic: "payment",
        subject: `Top-Up — $${rounded.toFixed(2)} via ${methodLabel}`,
    })

    const { id: topupId, ref } = await createTopupRequest({
        userId: user._id!.toString(),
        amount: rounded,
        method: method as TopupMethod,
        conversationId,
    })

    const db = await getDb()
    await db.collection("conversations").updateOne(
        { _id: new ObjectId(conversationId) },
        { $set: { topupRequestId: topupId, subject: `Top-Up #${ref} — $${rounded.toFixed(2)} via ${methodLabel}` } }
    )

    // Crypto with a configured address → full instructions instantly.
    // Wise / Payoneer (or unconfigured crypto) → acknowledgment; admin replies with details.
    const configured = settings.methods.find(m => m.id === method && m.address.trim())
    const body = configured
        ? [
            `Hello! Your top-up request #${ref} for $${rounded.toFixed(2)} has been received.`,
            ``,
            `Send exactly $${rounded.toFixed(2)} USDT via TRON (TRC20) to this address:`,
            ``,
            `${configured.address.trim()}`,
            ``,
            `⚠️ Send only via the TRC20 network — funds sent on a wrong network are lost.`,
            ``,
            `After paying, reply here with a screenshot of the transaction (and the transaction link if possible). We usually confirm within a few hours.`,
        ].join("\n")
        : [
            `Hello! Your top-up request #${ref} for $${rounded.toFixed(2)} via ${methodLabel} has been received.`,
            ``,
            `Our team will send you the payment details in this conversation shortly. After paying, reply here with a screenshot of the transfer.`,
        ].join("\n")

    await addMessage({ conversationId, sender: "system", body })

    revalidatePath("/admin/inbox")
    return { ok: true, conversationId }
}

// Admin confirms money arrived — atomic, one-winner crediting
// Bound as a plain <form action>, so this returns void like the rest of the
// admin form actions (adminApproveOrderAction, adminCancelOrderAction, etc.)
export async function creditTopupAction(topupId: string, formData: FormData) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return

    const topup = await getTopupById(topupId)
    if (!topup) return

    // Admin can adjust the amount if the user sent a different sum
    const raw = String(formData.get("amount") ?? "").trim()
    const amount = raw ? Number(raw) : topup.amount
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) return

    const won = await resolveTopup(topupId, "credited", admin._id!.toString(), amount)
    if (!won) return

    await adjustUserBalance(topup.userId, amount)
    await addMessage({
        conversationId: topup.conversationId,
        sender: "system",
        body: `✅ $${amount.toFixed(2)} has been credited to your balance. Thank you!`,
    })

    revalidatePath(`/admin/inbox/${topup.conversationId}`)
    revalidatePath("/admin/inbox")
}

export async function rejectTopupAction(topupId: string) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return

    const topup = await getTopupById(topupId)
    if (!topup) return

    const won = await resolveTopup(topupId, "rejected", admin._id!.toString())
    if (!won) return

    await addMessage({
        conversationId: topup.conversationId,
        sender: "system",
        body: `❌ Top-up request #${topup.ref} was declined. If you believe this is a mistake, reply here.`,
    })

    revalidatePath(`/admin/inbox/${topup.conversationId}`)
    revalidatePath("/admin/inbox")
}
