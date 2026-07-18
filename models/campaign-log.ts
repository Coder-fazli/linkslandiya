import { ObjectId } from "mongodb"

export type CampaignLog = {
    _id?: string | ObjectId
    audience: string
    audienceLabel: string
    subject: string
    sentCount: number
    sentBy: string   // admin user id
    createdAt: Date
}
