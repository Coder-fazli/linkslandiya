import { getDb } from "./db"
import { EmailTemplate, EmailTemplateType, DEFAULT_EMAIL_TEMPLATES } from "@/models/email-template"

async function templatesCollection() {
    const db = await getDb()
    return db.collection<EmailTemplate>("emailTemplates")
}

export async function getEmailTemplate(type: EmailTemplateType): Promise<{ subject: string; body: string }> {
    const col = await templatesCollection()
    const doc = await col.findOne({ type })
    if (doc) return { subject: doc.subject, body: doc.body }
    return DEFAULT_EMAIL_TEMPLATES[type]
}

export async function getAllEmailTemplates(): Promise<Record<EmailTemplateType, { subject: string; body: string }>> {
    const [welcome, announcement] = await Promise.all([
        getEmailTemplate("welcome"),
        getEmailTemplate("announcement"),
    ])
    return { welcome, announcement }
}

export async function updateEmailTemplate(type: EmailTemplateType, data: { subject: string; body: string }, adminId: string) {
    const col = await templatesCollection()
    await col.updateOne(
        { type },
        { $set: { ...data, updatedAt: new Date(), updatedBy: adminId } },
        { upsert: true }
    )
}
