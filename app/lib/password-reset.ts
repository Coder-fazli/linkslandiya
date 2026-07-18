import crypto from "crypto"
import { getDb } from "./db"
import { PasswordResetToken } from "@/models/password-reset"

const TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

async function tokensCollection() {
    const db = await getDb()
    return db.collection<PasswordResetToken>("passwordResetTokens")
}

function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex")
}

// Creates a fresh reset token and invalidates any previous ones for this
// user, so only the most recently requested link ever works.
export async function createPasswordResetToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex")
    const col = await tokensCollection()

    await col.deleteMany({ userId, usedAt: { $exists: false } })
    await col.insertOne({
        userId,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
        createdAt: new Date(),
    })

    return token
}

// Returns the userId if the token is valid, unexpired, and unused
export async function validatePasswordResetToken(token: string): Promise<string | null> {
    const col = await tokensCollection()
    const doc = await col.findOne({
        tokenHash: hashToken(token),
        usedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
    })
    return doc?.userId ?? null
}

// One-time use — marks the token consumed so the link can't be replayed
export async function consumePasswordResetToken(token: string): Promise<string | null> {
    const col = await tokensCollection()
    const result = await col.findOneAndUpdate(
        { tokenHash: hashToken(token), usedAt: { $exists: false }, expiresAt: { $gt: new Date() } },
        { $set: { usedAt: new Date() } }
    )
    return result?.userId ?? null
}
