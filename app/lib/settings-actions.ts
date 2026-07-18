"use server"

import { writeFile, mkdir, unlink } from "fs/promises"
import path from "path"
import sharp from "sharp"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./session"
import { getSiteSettings, updateSiteSettings } from "./site-settings"
import { LOGO_MIN_SIZE, LOGO_MAX_SIZE } from "@/models/site-settings"

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

const LOGO_TYPES: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
}

const FAVICON_TYPES: Record<string, string> = {
    ...LOGO_TYPES,
    "image/x-icon": ".ico",
    "image/vnd.microsoft.icon": ".ico",
}

const BRANDING_DIR = path.join(process.cwd(), "public", "uploads", "branding")

async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user?.isAdmin) throw new Error("Not authorized")
    return user
}

// Delete a previously uploaded branding file (ignore if already gone)
async function removeBrandingFile(url?: string) {
    if (!url?.startsWith("/uploads/branding/")) return
    try {
        await unlink(path.join(process.cwd(), "public", url))
    } catch {
        // file already removed — nothing to do
    }
}

function revalidateBranding() {
    revalidatePath("/", "layout")
}

// Raster formats sharp can crop/resize; SVG and ICO are kept as uploaded
const RASTER_TYPES = ["image/png", "image/jpeg", "image/webp"]
const FAVICON_SIZE = 256

async function saveImage(file: File, kind: "logo" | "favicon" | "supportAvatar"): Promise<{ url?: string; error?: string }> {
    const allowed = kind === "logo" ? LOGO_TYPES : FAVICON_TYPES
    let ext = allowed[file.type]
    if (!ext) return { error: `Invalid file type. Allowed: ${[...new Set(Object.values(allowed))].join(", ")}` }
    if (file.size === 0) return { error: "File is empty." }
    if (file.size > MAX_SIZE_BYTES) return { error: "File too large. Maximum size is 5 MB." }

    let buffer = Buffer.from(await file.arrayBuffer())

    // Favicon and support avatar are fitted into a square on a transparent
    // background — the whole image stays visible, never squashed or cropped
    if ((kind === "favicon" || kind === "supportAvatar") && RASTER_TYPES.includes(file.type)) {
        try {
            buffer = Buffer.from(
                await sharp(buffer)
                    .resize(FAVICON_SIZE, FAVICON_SIZE, {
                        fit: "contain",
                        background: { r: 0, g: 0, b: 0, alpha: 0 },
                    })
                    .png()
                    .toBuffer()
            )
            ext = ".png"
        } catch {
            return { error: "Could not process the image. Please try a different file." }
        }
    }

    const filename = `${kind}_${Date.now()}${ext}`
    await mkdir(BRANDING_DIR, { recursive: true })
    await writeFile(path.join(BRANDING_DIR, filename), buffer)
    return { url: `/uploads/branding/${filename}` }
}

// ── Logo ────────────────────────────────────────────────

export async function uploadLogoAction(formData: FormData) {
    const admin = await requireAdmin()
    const file = formData.get("file") as File | null
    if (!file) return { error: "No file provided" }

    const { url, error } = await saveImage(file, "logo")
    if (error) return { error }

    const current = await getSiteSettings()
    await updateSiteSettings({ logoUrl: url }, admin._id!.toString())
    await removeBrandingFile(current.logoUrl)

    revalidateBranding()
    return { url }
}

export async function deleteLogoAction() {
    const admin = await requireAdmin()
    const current = await getSiteSettings()
    await updateSiteSettings({ logoUrl: undefined }, admin._id!.toString())
    await removeBrandingFile(current.logoUrl)

    revalidateBranding()
    return { ok: true }
}

// Custom logo size, like the WordPress customizer
export async function updateLogoSizeAction(formData: FormData) {
    const admin = await requireAdmin()

    const parse = (name: string) => {
        const raw = String(formData.get(name) ?? "").trim()
        if (!raw) return undefined // empty = auto
        const n = Number(raw)
        if (!Number.isFinite(n)) return null
        return Math.round(Math.min(LOGO_MAX_SIZE, Math.max(LOGO_MIN_SIZE, n)))
    }

    const width = parse("logoWidth")
    const height = parse("logoHeight")
    if (width === null || height === null) return { error: "Width and height must be numbers." }

    await updateSiteSettings({ logoWidth: width, logoHeight: height }, admin._id!.toString())
    revalidateBranding()
    return { ok: true, logoWidth: width, logoHeight: height }
}

// ── Favicon ─────────────────────────────────────────────

export async function uploadFaviconAction(formData: FormData) {
    const admin = await requireAdmin()
    const file = formData.get("file") as File | null
    if (!file) return { error: "No file provided" }

    const { url, error } = await saveImage(file, "favicon")
    if (error) return { error }

    const current = await getSiteSettings()
    await updateSiteSettings({ faviconUrl: url }, admin._id!.toString())
    await removeBrandingFile(current.faviconUrl)

    revalidateBranding()
    return { url }
}

export async function deleteFaviconAction() {
    const admin = await requireAdmin()
    const current = await getSiteSettings()
    await updateSiteSettings({ faviconUrl: undefined }, admin._id!.toString())
    await removeBrandingFile(current.faviconUrl)

    revalidateBranding()
    return { ok: true }
}

// ── Support identity (shown to users in the inbox) ──────

export async function uploadSupportAvatarAction(formData: FormData) {
    const admin = await requireAdmin()
    const file = formData.get("file") as File | null
    if (!file) return { error: "No file provided" }

    const { url, error } = await saveImage(file, "supportAvatar")
    if (error) return { error }

    const current = await getSiteSettings()
    await updateSiteSettings({ supportAvatarUrl: url }, admin._id!.toString())
    await removeBrandingFile(current.supportAvatarUrl)

    revalidatePath("/admin/inbox")
    return { url }
}

export async function deleteSupportAvatarAction() {
    const admin = await requireAdmin()
    const current = await getSiteSettings()
    await updateSiteSettings({ supportAvatarUrl: undefined }, admin._id!.toString())
    await removeBrandingFile(current.supportAvatarUrl)

    revalidatePath("/admin/inbox")
    return { ok: true }
}

export async function updateSupportNameAction(formData: FormData) {
    const admin = await requireAdmin()
    const name = String(formData.get("supportName") ?? "").trim()
    if (!name) return { error: "Name cannot be empty." }
    if (name.length > 60) return { error: "Name is too long (max 60 characters)." }

    await updateSiteSettings({ supportName: name }, admin._id!.toString())
    revalidatePath("/admin/inbox")
    return { ok: true }
}
