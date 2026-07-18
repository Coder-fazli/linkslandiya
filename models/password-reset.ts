import { ObjectId } from "mongodb"

export type PasswordResetToken = {
    _id?: ObjectId
    userId: string
    tokenHash: string   // SHA-256 of the token — the raw token is never stored
    expiresAt: Date
    usedAt?: Date
    createdAt: Date
}
