import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "linkslandiya"

// Type for user in database
export type User = {
    _id?: string | ObjectId
    name: string
    email: string
    passwordHash: string
    salt: string
    createdAt: Date
    // Role system
    canBuy: boolean
    canPublish: boolean
    activeMode: "buyer" | "publisher"
    isAdmin: boolean
}

// Get the users collection
export async function getCollection() {
    const client = await clientPromise
    return client.db(DB_NAME).collection<User>("users")
}

// Find user by email
export async function getUserByEmail(email: string) {
    const collection = await getCollection()
    return collection.findOne({ email: email.toLocaleLowerCase() })
}

// Get user by Id
export async function getUserById(id: string) {
    const collection = await getCollection()
    const user = await collection.findOne({ _id: new ObjectId(id) })
    if (!user) return null
    return {
        ...user,
        canBuy: user.canBuy ?? true,
        canPublish: user.canPublish ?? true,
        activeMode: user.activeMode ?? "buyer",
        isAdmin: user.isAdmin ?? false,
    }
}

// Create new user
export async function createUser(user: Omit<User, "_id" | "createdAt">) {
    const collection = await getCollection()
    const result = await collection.insertOne({
        ...user,
        email: user.email.toLocaleLowerCase(),
        createdAt: new Date(),
    })
    return result
}

// Switch user's active mode
export async function switchUserMode(userId: string, mode: "buyer" | "publisher") {
    const collection = await getCollection()
    await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { activeMode: mode } }
    )
}

// Unlock publisher mode for user
export async function unlockPublisherMode(userId: string) {
    const collection = await getCollection()
    await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { canPublish: true } }
    )
}

// Get all Users (for admin panel)
export async function getAllUsers(){
    const collection = await getCollection()
    const users = await collection.find({}).toArray()
    return users as unknown as User[]
}