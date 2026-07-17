import { getClientPromise } from "@/mongodb"
import { ContactMessage } from "@/models/contact-message"

const DB_NAME = "linkslandiya"

// Get the contact messages collection
export async function getContactMessagesCollection() {
    const client = await getClientPromise()
    return client.db(DB_NAME).collection<ContactMessage>("contactMessages")
}

export async function createContactMessage(message: Omit<ContactMessage, "_id">) {
    const col = await getContactMessagesCollection()
    await col.insertOne(message)
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
    const col = await getContactMessagesCollection()
    return col.find({}).sort({ createdAt: -1 }).toArray()
}
