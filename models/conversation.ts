import { ObjectId } from "mongodb"

// Which "door" the conversation came through — set by code, never by the user
export const CONVERSATION_TOPICS = ["payment", "support", "orders"] as const
export type ConversationTopic = (typeof CONVERSATION_TOPICS)[number]

// User-selected when starting a support conversation (server-validated whitelist)
export const SUPPORT_CATEGORIES = [
    { value: "orders", label: "Question about an order" },
    { value: "payments", label: "Payments & billing" },
    { value: "websites", label: "My websites / listings" },
    { value: "account", label: "Account & login" },
    { value: "other", label: "Something else" },
] as const
export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number]["value"]

export const PRIORITIES = ["normal", "high"] as const
export type Priority = (typeof PRIORITIES)[number]

// A conversation is always between ONE user and Administration.
// There is deliberately no recipient field — users can never message each other.
export type Conversation = {
    _id?: ObjectId
    userId: string
    topic: ConversationTopic
    category?: SupportCategory  // support only
    priority?: Priority         // support only
    subject: string
    status: "open" | "closed"
    // Archive is per side, like Gmail — hides, never deletes
    archivedForUser?: boolean
    archivedForAdmin?: boolean
    unreadForUser: number
    unreadForAdmin: number
    lastMessageAt: Date
    lastPreview: string
    createdAt: Date
    topupRequestId?: string     // set for topic "payment"
}

export type Message = {
    _id?: ObjectId
    conversationId: string
    // "system" = automatic messages, shown to the user as Administration
    sender: "user" | "admin" | "system"
    body: string
    attachmentFile?: string     // server-generated filename in the private uploads dir
    attachmentName?: string     // original name, display only
    createdAt: Date
}
