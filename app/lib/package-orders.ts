import { ObjectId } from "mongodb"
import { getDb } from "./db"
import { PackageOrder } from "@/models/package-order"

async function packageOrdersCollection() {
    const db = await getDb()
    return db.collection<PackageOrder>("packageOrders")
}

export async function createPackageOrder(data: {
    packageId: string
    packageName: string
    packagePrice: number
    buyerId: string
    conversationId?: string
}) {
    const col = await packageOrdersCollection()
    const result = await col.insertOne({
        ...data,
        status: "pending",
        createdAt: new Date(),
    })
    return result.insertedId.toString()
}

export async function getAllPackageOrders(): Promise<PackageOrder[]> {
    const col = await packageOrdersCollection()
    const orders = await col.find({}).sort({ createdAt: -1 }).toArray()
    return orders as unknown as PackageOrder[]
}

export async function getPackageOrdersByBuyer(buyerId: string): Promise<PackageOrder[]> {
    const col = await packageOrdersCollection()
    const orders = await col.find({ buyerId }).sort({ createdAt: -1 }).toArray()
    return orders as unknown as PackageOrder[]
}

export async function getPackageOrderById(id: string): Promise<PackageOrder | null> {
    if (!ObjectId.isValid(id)) return null
    const col = await packageOrdersCollection()
    return col.findOne({ _id: new ObjectId(id) }) as unknown as PackageOrder | null
}

export async function countPendingPackageOrders() {
    const col = await packageOrdersCollection()
    return col.countDocuments({ status: "pending" })
}

// Atomic: only one caller can resolve a request
export async function resolvePackageOrder(id: string, to: "confirmed" | "cancelled", adminId: string) {
    const col = await packageOrdersCollection()
    const result = await col.updateOne(
        { _id: new ObjectId(id), status: "pending" },
        { $set: { status: to, resolvedAt: new Date(), resolvedBy: adminId } }
    )
    return result.modifiedCount > 0
}
