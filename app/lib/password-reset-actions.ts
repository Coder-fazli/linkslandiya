"use server"

import { getUserByEmail, getUserById } from "./user"
import { getDb } from "./db"
import { ObjectId } from "mongodb"
import { createPasswordResetToken, consumePasswordResetToken } from "./password-reset"
import { sendEmail, getEmailLogoUrl } from "./email"
import { wrapEmailHtml } from "./email-layout"
import { generateSalt, hashPassword } from "../(auth)/core/passwordHasher"
import { passwordSchema } from "../(auth)/schemas"

const GENERIC_SUCCESS = { ok: true, message: "If an account exists for that email, we've sent a password reset link." }

// Always responds the same way whether or not the email exists — prevents
// an attacker from using this form to discover which emails are registered.
export async function requestPasswordResetAction(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim().toLowerCase()
    if (!email) return { error: "Enter your email address." }

    const user = await getUserByEmail(email)
    // No account, or a Google-only account with no password to reset
    if (!user || !user.passwordHash) return GENERIC_SUCCESS

    const appUrl = process.env.APP_URL ?? ""
    const token = await createPasswordResetToken(user._id!.toString())
    const resetUrl = `${appUrl}/reset-password?token=${token}`

    const logoUrl = await getEmailLogoUrl()
    const html = wrapEmailHtml(
        `<p>Hi ${user.name},</p>` +
        `<p>We received a request to reset your password. Click the button below to choose a new one:</p>` +
        `<p style="text-align:center;margin:28px 0;">` +
        `<a href="${resetUrl}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#00b4d8,#0096b7);color:#ffffff;text-decoration:none;border-radius:9999px;font-weight:700;">Reset Password</a>` +
        `</p>` +
        `<p style="font-size:13px;color:#64748b;">This link expires in 1 hour and can only be used once. If you didn't request this, you can safely ignore this email — your password won't change.</p>`,
        logoUrl
    )

    await sendEmail({
        to: [{ email: user.email, name: user.name }],
        subject: "Reset your Linkslandia password",
        html,
    })

    return GENERIC_SUCCESS
}

export async function resetPasswordAction(formData: FormData) {
    const token = String(formData.get("token") ?? "")
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (!token) return { error: "Invalid or expired reset link." }
    if (password !== confirmPassword) return { error: "Passwords do not match." }

    const parsed = passwordSchema.safeParse(password)
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid password." }

    const userId = await consumePasswordResetToken(token)
    if (!userId) return { error: "This reset link is invalid or has expired. Please request a new one." }

    const user = await getUserById(userId)
    if (!user) return { error: "Account not found." }

    const salt = generateSalt()
    const passwordHash = await hashPassword(password, salt)

    const db = await getDb()
    await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { passwordHash, salt } }
    )

    return { ok: true }
}
