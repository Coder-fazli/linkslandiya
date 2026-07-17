"use server"

import { createContactMessage } from "./contact-messages"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContactAction(formData: FormData) {
    // Honeypot — bots fill every field; humans never see this one
    if (String(formData.get("website") ?? "")) return { ok: true }

    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const subject = String(formData.get("subject") ?? "").trim()
    const message = String(formData.get("message") ?? "").trim()

    if (!name || name.length > 100) return { error: "Please enter your name." }
    if (!EMAIL_RE.test(email) || email.length > 200) return { error: "Please enter a valid email address." }
    if (!subject || subject.length > 150) return { error: "Please choose a subject." }
    if (message.length < 10) return { error: "Your message is too short — please add some details." }
    if (message.length > 5000) return { error: "Your message is too long (max 5000 characters)." }

    await createContactMessage({ name, email, subject, message, createdAt: new Date(), read: false })
    return { ok: true }
}
