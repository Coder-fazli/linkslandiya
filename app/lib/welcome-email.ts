import { getEmailTemplate } from "./email-templates"
import { sendEmail, renderTemplate, getEmailLogoUrl } from "./email"
import { wrapEmailHtml } from "./email-layout"

// Called from both signup paths (password + Google) right after account
// creation. Never blocks or fails the signup flow — email delivery issues
// are logged, not surfaced to the new user.
export async function sendWelcomeEmail(name: string, email: string) {
    try {
        const [template, logoUrl] = await Promise.all([
            getEmailTemplate("welcome"),
            getEmailLogoUrl(),
        ])
        const vars = { name, email }
        await sendEmail({
            to: [{ email, name }],
            subject: renderTemplate(template.subject, vars),
            html: wrapEmailHtml(renderTemplate(template.body, vars), logoUrl),
        })
    } catch (err) {
        console.error("Failed to send welcome email:", err)
    }
}
