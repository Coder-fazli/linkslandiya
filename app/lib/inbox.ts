import { ObjectId, Filter } from "mongodb"
import { getDb } from "./db"
import { Conversation, ConversationTopic, Message } from "@/models/conversation"

async function conversations() {
    const db = await getDb()
    return db.collection<Conversation>("conversations")
}

async function messages() {
    const db = await getDb()
    return db.collection<Message>("messages")
}

const PREVIEW_LENGTH = 90

function preview(body: string, hasAttachment: boolean) {
    const text = body.trim() || (hasAttachment ? "📎 Attachment" : "")
    return text.length > PREVIEW_LENGTH ? text.slice(0, PREVIEW_LENGTH) + "…" : text
}

export async function createConversation(data: {
    userId: string
    topic: ConversationTopic
    subject: string
    category?: Conversation["category"]
    priority?: Conversation["priority"]
    topupRequestId?: string
}) {
    const col = await conversations()
    const result = await col.insertOne({
        ...data,
        status: "open",
        unreadForUser: 0,
        unreadForAdmin: 0,
        lastMessageAt: new Date(),
        lastPreview: "",
        createdAt: new Date(),
    })
    return result.insertedId.toString()
}

export async function getConversationById(id: string): Promise<Conversation | null> {
    if (!ObjectId.isValid(id)) return null
    const col = await conversations()
    return col.findOne({ _id: new ObjectId(id) })
}

// A user's own conversations; admins see all users' conversations
export async function listConversations(opts: {
    userId?: string          // omit for admin (all users)
    topic?: ConversationTopic
    archived: boolean
    forAdmin: boolean
}) {
    const col = await conversations()
    const archivedField = opts.forAdmin ? "archivedForAdmin" : "archivedForUser"
    const filter: Filter<Conversation> = {
        [archivedField]: opts.archived ? true : { $ne: true },
    }
    if (opts.userId) filter.userId = opts.userId
    if (opts.topic) filter.topic = opts.topic
    return col.find(filter).sort({ lastMessageAt: -1 }).limit(200).toArray()
}

export async function getMessages(conversationId: string) {
    const col = await messages()
    return col.find({ conversationId }).sort({ createdAt: 1 }).limit(500).toArray()
}

// Append a message and update the conversation's preview + the OTHER side's unread counter
export async function addMessage(data: {
    conversationId: string
    sender: Message["sender"]
    body: string
    attachmentFile?: string
    attachmentName?: string
}) {
    const col = await messages()
    await col.insertOne({ ...data, createdAt: new Date() })

    const unreadInc = data.sender === "user"
        ? { unreadForAdmin: 1 }
        : { unreadForUser: 1 }

    const convCol = await conversations()
    await convCol.updateOne(
        { _id: new ObjectId(data.conversationId) },
        {
            $set: {
                lastMessageAt: new Date(),
                lastPreview: preview(data.body, !!data.attachmentFile),
                // New activity un-archives the thread for both sides
                archivedForUser: false,
                archivedForAdmin: false,
            },
            $inc: unreadInc,
        }
    )
}

export async function markConversationRead(conversationId: string, side: "user" | "admin") {
    const col = await conversations()
    await col.updateOne(
        { _id: new ObjectId(conversationId) },
        { $set: side === "user" ? { unreadForUser: 0 } : { unreadForAdmin: 0 } }
    )
}

export async function setConversationArchived(conversationId: string, side: "user" | "admin", archived: boolean) {
    const col = await conversations()
    await col.updateOne(
        { _id: new ObjectId(conversationId) },
        { $set: side === "user" ? { archivedForUser: archived } : { archivedForAdmin: archived } }
    )
}

// Total unread for the header badge
export async function countUnread(side: "user" | "admin", userId?: string) {
    const col = await conversations()
    const field = side === "user" ? "$unreadForUser" : "$unreadForAdmin"
    const match: Record<string, unknown> = userId ? { userId } : {}
    const result = await col.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: field } } },
    ]).toArray()
    return result[0]?.total ?? 0
}

// Anti-spam guards
export async function countRecentMessagesByUser(userId: string, conversationIds: string[], seconds: number) {
    const col = await messages()
    return col.countDocuments({
        conversationId: { $in: conversationIds },
        sender: "user",
        createdAt: { $gt: new Date(Date.now() - seconds * 1000) },
    })
}

export async function countOpenSupportConversations(userId: string) {
    const col = await conversations()
    return col.countDocuments({ userId, topic: "support", status: "open" })
}
