"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./session"
import { updateEmailTemplate } from "./email-templates"
import { EMAIL_TEMPLATE_TYPES, EmailTemplateType } from "@/models/email-template"
import { sendEmail, renderTemplate, getEmailLogoUrl } from "./email"
import { wrapEmailHtml } from "./email-layout"
import { getUsersByAudience, searchUsers, getUserById } from "./user"
import { CAMPAIGN_AUDIENCES, CampaignAudience } from "@/models/campaign-audience"
import { createCampaignLog } from "./campaign-logs"

const MAX_MANUAL_RECIPIENTS = 100
const SEND_CONCURRENCY = 5

export async function updateEmailTemplateAction(formData: FormData) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return { error: "Not authorized" }

    const type = String(formData.get("type") ?? "")
    if (!EMAIL_TEMPLATE_TYPES.includes(type as EmailTemplateType)) return { error: "Invalid template" }

    const subject = String(formData.get("subject") ?? "").trim()
    const body = String(formData.get("body") ?? "").trim()
    if (!subject) return { error: "Subject is required." }
    if (!body) return { error: "Body is required." }
    if (subject.length > 200) return { error: "Subject is too long." }
    if (body.length > 20000) return { error: "Body is too long." }

    await updateEmailTemplate(type as EmailTemplateType, { subject, body }, admin._id!.toString())
    revalidatePath("/admin/emails")
    return { ok: true }
}

// Parse a comma/newline-separated list of email addresses, deduped and validated
function parseManualEmails(raw: string): { emails: string[]; error?: string } {
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const parts = raw.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
    const emails = [...new Set(parts.map(e => e.toLowerCase()))]
    if (emails.length === 0) return { emails: [], error: "Enter at least one email address." }
    if (emails.length > MAX_MANUAL_RECIPIENTS) return { emails: [], error: `Maximum ${MAX_MANUAL_RECIPIENTS} recipients per send.` }
    const invalid = emails.filter(e => !EMAIL_RE.test(e))
    if (invalid.length > 0) return { emails: [], error: `Invalid email address: ${invalid[0]}` }
    return { emails }
}

// Resolves an audience selection into a concrete recipient list
async function resolveRecipients(
    audience: CampaignAudience,
    specificUserId: string,
    manualEmailsRaw: string
): Promise<{ recipients: { email: string; name: string }[]; error?: string }> {
    if (audience === "manual") {
        const { emails, error } = parseManualEmails(manualEmailsRaw)
        if (error) return { recipients: [], error }
        return { recipients: emails.map(email => ({ email, name: "there" })) }
    }
    if (audience === "specific") {
        if (!specificUserId) return { recipients: [], error: "Search and select a user." }
        const user = await getUserById(specificUserId)
        if (!user) return { recipients: [], error: "User not found." }
        return { recipients: [{ email: user.email, name: user.name }] }
    }
    const users = await getUsersByAudience(audience)
    return { recipients: users.map(u => ({ email: u.email, name: u.name })) }
}

// Run async tasks with limited concurrency — avoids hammering Brevo's API
async function runWithConcurrency<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
    let cursor = 0
    async function worker() {
        while (cursor < items.length) {
            const item = items[cursor++]
            await fn(item)
        }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
}

export async function previewAudienceAction(formData: FormData) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return { count: 0 }

    const audience = String(formData.get("audience") ?? "all") as CampaignAudience
    const specificUserId = String(formData.get("specificUserId") ?? "")
    const manualEmails = String(formData.get("manualEmails") ?? "")

    const { recipients, error } = await resolveRecipients(audience, specificUserId, manualEmails)
    if (error) return { count: 0 }
    return { count: recipients.length }
}

export async function searchUsersAction(query: string) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return []
    const users = await searchUsers(query)
    return users.map(u => ({ id: u._id!.toString(), name: u.name, email: u.email }))
}

// Sends a campaign email to a resolved audience, personalizing {{name}} per
// recipient, then logs the send to campaign history
export async function sendCampaignAction(formData: FormData) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return { error: "Not authorized" }

    const audience = String(formData.get("audience") ?? "all") as CampaignAudience
    const specificUserId = String(formData.get("specificUserId") ?? "")
    const manualEmails = String(formData.get("manualEmails") ?? "")
    const subject = String(formData.get("subject") ?? "").trim()
    const body = String(formData.get("body") ?? "").trim()
    const ctaText = String(formData.get("ctaText") ?? "").trim()
    const ctaUrl = String(formData.get("ctaUrl") ?? "").trim()
    const btnColor = String(formData.get("btnColor") ?? "").trim()

    if (!subject) return { error: "Subject is required." }
    if (!body) return { error: "Message is required." }

    const { recipients, error } = await resolveRecipients(audience, specificUserId, manualEmails)
    if (error) return { error }
    if (recipients.length === 0) return { error: "No recipients match this audience." }

    const logoUrl = await getEmailLogoUrl()
    const cta = ctaText && ctaUrl ? { text: ctaText, url: ctaUrl, color: btnColor || undefined } : undefined

    let sentCount = 0
    await runWithConcurrency(recipients, SEND_CONCURRENCY, async (recipient) => {
        const vars = { name: recipient.name, email: recipient.email }
        const result = await sendEmail({
            to: [{ email: recipient.email, name: recipient.name }],
            subject: renderTemplate(subject, vars),
            html: wrapEmailHtml(renderTemplate(body, vars), logoUrl, cta),
        })
        if (result.ok) sentCount++
    })

    const audienceLabel = CAMPAIGN_AUDIENCES.find(a => a.value === audience)?.label ?? audience
    await createCampaignLog({
        audience,
        audienceLabel,
        subject,
        sentCount,
        sentBy: admin._id!.toString(),
    })

    revalidatePath("/admin/emails")
    return { ok: true, sent: sentCount, total: recipients.length }
}
