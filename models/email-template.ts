import { ObjectId } from "mongodb"

// Two fixed, admin-editable templates — no free-form template creation
export const EMAIL_TEMPLATE_TYPES = ["welcome", "announcement"] as const
export type EmailTemplateType = (typeof EMAIL_TEMPLATE_TYPES)[number]

export type EmailTemplate = {
    _id?: string | ObjectId
    type: EmailTemplateType
    subject: string
    body: string   // HTML, supports {{name}} and {{email}} placeholders
    updatedAt?: Date
    updatedBy?: string
}

export const DEFAULT_EMAIL_TEMPLATES: Record<EmailTemplateType, { subject: string; body: string }> = {
    welcome: {
        subject: "Welcome to Linkslandia, {{name}}!",
        body:
            "<p>Hi {{name}},</p>" +
            "<p>Welcome to Linkslandia — your account is ready to go. You can browse thousands of vetted websites for guest posting and link building, or list your own site as a publisher.</p>" +
            "<p>If you have any questions, just reply to this email — our team is happy to help.</p>" +
            "<p>— The Linkslandia Team</p>",
    },
    announcement: {
        subject: "An update from Linkslandia",
        body:
            "<p>Hi {{name}},</p>" +
            "<p>We wanted to let you know about something new on Linkslandia.</p>" +
            "<p>— The Linkslandia Team</p>",
    },
}
