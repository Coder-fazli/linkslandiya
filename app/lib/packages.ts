import { ObjectId } from "mongodb"
import { getDb } from "./db"
import { Package, DEMO_PACKAGES } from "@/models/package"

async function packagesCollection() {
    const db = await getDb()
    return db.collection<Package>("packages")
}

// Every package, for the admin list (active and inactive)
export async function getAllPackages(): Promise<Package[]> {
    const col = await packagesCollection()
    const packages = await col.find({}).sort({ order: 1, createdAt: 1 }).toArray()
    return packages as unknown as Package[]
}

// Active packages for the public page — falls back to demo content when
// no real packages have been created yet, so the page is never empty
export async function getActivePackages(): Promise<Package[]> {
    const col = await packagesCollection()
    const packages = await col.find({ active: true }).sort({ order: 1, createdAt: 1 }).toArray()
    if (packages.length === 0) return DEMO_PACKAGES
    return packages as unknown as Package[]
}

export async function getPackageById(id: string): Promise<Package | null> {
    if (!ObjectId.isValid(id)) return null
    const col = await packagesCollection()
    const pkg = await col.findOne({ _id: new ObjectId(id) })
    return pkg as unknown as Package | null
}

export async function createPackage(data: Omit<Package, "_id" | "createdAt" | "updatedAt">) {
    const col = await packagesCollection()
    const result = await col.insertOne({ ...data, createdAt: new Date() } as Package)
    return result.insertedId.toString()
}

export async function updatePackage(id: string, data: Partial<Omit<Package, "_id" | "createdAt">>) {
    const col = await packagesCollection()
    await col.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: new Date() } }
    )
}

export async function deletePackage(id: string) {
    const col = await packagesCollection()
    await col.deleteOne({ _id: new ObjectId(id) })
}
