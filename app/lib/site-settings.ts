import { getClientPromise } from "@/mongodb"
import { SiteSettings, defaultSiteSettings } from "@/models/site-settings"

const DB_NAME = "linkslandiya"

// Get the site settings collection
export async function getSiteSettingsCollection() {
    const client = await getClientPromise()
    return client.db(DB_NAME).collection<SiteSettings>("siteSettings")
}

// Read the single settings document (returns defaults if none exists yet)
export async function getSiteSettings(): Promise<SiteSettings> {
    const col = await getSiteSettingsCollection()
    const doc = await col.findOne({})
    return doc ?? defaultSiteSettings
}

// Upsert fields on the single settings document (undefined values remove the field)
export async function updateSiteSettings(fields: Partial<SiteSettings>, adminId?: string) {
    const col = await getSiteSettingsCollection()

    const set: Record<string, unknown> = { updatedAt: new Date(), ...(adminId ? { updatedBy: adminId } : {}) }
    const unset: Record<string, ""> = {}
    for (const [key, value] of Object.entries(fields)) {
        if (value === undefined) unset[key] = ""
        else set[key] = value
    }

    await col.updateOne(
        {},
        { $set: set, ...(Object.keys(unset).length ? { $unset: unset } : {}) },
        { upsert: true }
    )
}
