import { getDb } from "./db"
import { CampaignLog } from "@/models/campaign-log"

async function collection() {
    const db = await getDb()
    return db.collection<CampaignLog>("campaignLogs")
}

export async function createCampaignLog(data: Omit<CampaignLog, "_id" | "createdAt">) {
    const col = await collection()
    await col.insertOne({ ...data, createdAt: new Date() })
}

export async function getCampaignHistory(limit = 50): Promise<CampaignLog[]> {
    const col = await collection()
    const logs = await col.find({}).sort({ createdAt: -1 }).limit(limit).toArray()
    return logs as unknown as CampaignLog[]
}
