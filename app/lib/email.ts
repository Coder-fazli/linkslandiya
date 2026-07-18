// Thin wrapper around Brevo's transactional email REST API.
// No SDK dependency — a single POST request is all their API needs.

import { getSiteSettings } from "./site-settings"

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email"

// The uploaded logo as an absolute URL (email clients can't load relative
// paths) — undefined if no logo is set or APP_URL isn't configured
export async function getEmailLogoUrl(): Promise<string | undefined> {
    const settings = await getSiteSettings()
    const appUrl = process.env.APP_URL
    if (!settings.logoUrl || !appUrl) return undefined
    return `${appUrl}${settings.logoUrl}`
}

export type SendEmailResult = { ok: true } | { ok: false; error: string }

export async function sendEmail(params: {
    to: { email: string; name?: string }[]
    subject: string
    html: string
}): Promise<SendEmailResult> {
    const apiKey = process.env.BREVO_API_KEY
    const senderEmail = process.env.BREVO_SENDER_EMAIL
    const senderName = process.env.BREVO_SENDER_NAME || "Linkslandia"

    if (!apiKey || !senderEmail) {
        console.error("Brevo not configured: missing BREVO_API_KEY or BREVO_SENDER_EMAIL")
        return { ok: false, error: "Email sending is not configured." }
    }

    try {
        const res = await fetch(BREVO_ENDPOINT, {
            method: "POST",
            headers: {
                "api-key": apiKey,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                sender: { email: senderEmail, name: senderName },
                to: params.to,
                subject: params.subject,
                htmlContent: params.html,
            }),
        })

        if (!res.ok) {
            const body = await res.text().catch(() => "")
            console.error("Brevo send failed:", res.status, body)
            return { ok: false, error: "Failed to send email." }
        }
        return { ok: true }
    } catch (err) {
        console.error("Brevo send error:", err)
        return { ok: false, error: "Failed to send email." }
    }
}

// Fill {{placeholders}} in a template string — unknown placeholders are left as-is
export function renderTemplate(text: string, vars: Record<string, string>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => vars[key] ?? match)
}
