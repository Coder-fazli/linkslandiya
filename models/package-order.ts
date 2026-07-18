import { ObjectId } from "mongodb"

// A buyer's request for a Package — deliberately separate from the
// guest-post/link-insertion Order system. Packages are sales leads
// (retainer-style services), not self-checkout item purchases: no
// balance is touched here, an admin follows up via the inbox.
export type PackageOrder = {
    _id?: string | ObjectId
    packageId: string
    packageName: string   // snapshot at request time — the package may change later
    packagePrice: number  // snapshot — the price shown when they requested it
    buyerId: string
    status: "pending" | "confirmed" | "cancelled"
    conversationId?: string
    createdAt: Date
    resolvedAt?: Date
    resolvedBy?: string   // admin user id
}
