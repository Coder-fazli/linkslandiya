import { ObjectId } from "mongodb"

export const TOPUP_METHODS = [
    { value: "usdt_trc20", label: "USDT (TRC20)" },
    { value: "wise", label: "Wise" },
    { value: "payoneer", label: "Payoneer" },
] as const
export type TopupMethod = (typeof TOPUP_METHODS)[number]["value"]

export type TopupRequest = {
    _id?: ObjectId
    ref: string                 // human-readable id, e.g. TU-4F2A
    userId: string
    amount: number              // requested USD amount
    method: TopupMethod
    status: "pending" | "credited" | "rejected"
    conversationId: string
    createdAt: Date
    // Facts recorded at resolution time — never recalculated
    creditedAmount?: number
    resolvedAt?: Date
    resolvedBy?: string         // admin user id
}
