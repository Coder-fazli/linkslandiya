import { ObjectId } from "mongodb"

// Site settings model (single document collection)
export type SiteSettings = {
    _id?: string | ObjectId
    logoUrl?: string      // e.g. /uploads/branding/logo_1720000000.png
    faviconUrl?: string   // e.g. /uploads/branding/favicon_1720000000.png
    logoWidth?: number    // px — custom logo size, like WordPress customizer
    logoHeight?: number   // px — 0/undefined = auto (keeps aspect ratio)
    updatedAt?: Date
    updatedBy?: string    // admin user id
}

export const LOGO_MIN_SIZE = 16
export const LOGO_MAX_SIZE = 400

export const defaultSiteSettings: SiteSettings = {
    logoUrl: undefined,
    faviconUrl: undefined,
    logoWidth: 140,
    logoHeight: undefined,
}
