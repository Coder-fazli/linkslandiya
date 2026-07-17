import { ObjectId } from "mongodb"

// Contact form message model
export type ContactMessage = {
    _id?: string | ObjectId
    name: string
    email: string
    subject: string
    message: string
    createdAt: Date
    read?: boolean
}
