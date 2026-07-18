"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./session"
import { updateEmailTemplate } from "./email-templates"
import { EMAIL_TEMPLATE_TYPES, EmailTemplateType } from "@/models/email-template"
import { sendEmail, renderTemplate, getEmailLogoUrl } from "./email"
import { wrapEmailHtml } from "./email-layout"

const MAX_RECIPIENTS = 100

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
function parseRecipients(raw: string): { emails: string[]; error?: string } {
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const parts = raw.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
    const emails = [...new Set(parts.map(e => e.toLowerCase()))]
    if (emails.length === 0) return { emails: [], error: "Enter at least one email address." }
    if (emails.length > MAX_RECIPIENTS) return { emails: [], error: `Maximum ${MAX_RECIPIENTS} recipients per send.` }
    const invalid = emails.filter(e => !EMAIL_RE.test(e))
    if (invalid.length > 0) return { emails: [], error: `Invalid email address: ${invalid[0]}` }
    return { emails }
}

// Admin manually sends an email (using the Announcement template as the
// starting point, but subject/body are editable for this specific send)
export async function sendManualEmailAction(formData: FormData) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return { error: "Not authorized" }

    const { emails, error: recipientError } = parseRecipients(String(formData.get("recipients") ?? ""))
    if (recipientError) return { error: recipientError }

    const subject = String(formData.get("subject") ?? "").trim()
    const body = String(formData.get("body") ?? "").trim()
    if (!subject) return { error: "Subject is required." }
    if (!body) return { error: "Message is required." }

    const logoUrl = await getEmailLogoUrl()
    const html = wrapEmailHtml(renderTemplate(body, { name: "there" }), logoUrl)
    const result = await sendEmail({
        to: emails.map(email => ({ email })),
        subject: renderTemplate(subject, { name: "there" }),
        html,
    })

    if (!result.ok) return { error: result.error }
    return { ok: true, count: emails.length }
}
