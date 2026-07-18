import { ObjectId } from "mongodb"
import { getDb } from "./db"
import { TopupRequest, TopupMethod } from "@/models/topup-request"

async function topups() {
    const db = await getDb()
    return db.collection<TopupRequest>("topupRequests")
}

export async function createTopupRequest(data: {
    userId: string
    amount: number
    method: TopupMethod
    conversationId: string
}) {
    const ref = `TU-${Math.random().toString(16).slice(2, 6).toUpperCase()}`
    const col = await topups()
    const result = await col.insertOne({
        ...data,
        ref,
        status: "pending",
        createdAt: new Date(),
    })
    return { id: result.insertedId.toString(), ref }
}

export async function getTopupById(id: string): Promise<TopupRequest | null> {
    if (!ObjectId.isValid(id)) return null
    const col = await topups()
    return col.findOne({ _id: new ObjectId(id) })
}

// Atomic: only one caller can resolve a request, so crediting can never run twice
export async function resolveTopup(
    id: string,
    to: "credited" | "rejected",
    adminId: string,
    creditedAmount?: number
) {
    const col = await topups()
    const result = await col.updateOne(
        { _id: new ObjectId(id), status: "pending" },
        {
            $set: {
                status: to,
                resolvedAt: new Date(),
                resolvedBy: adminId,
                ...(creditedAmount != null ? { creditedAmount } : {}),
            },
        }
    )
    return result.modifiedCount > 0
}
