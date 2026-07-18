"use server"

import { writeFile, mkdir, unlink } from "fs/promises"
import path from "path"
import sharp from "sharp"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./session"
import { setUserAvatar } from "./user"

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const AVATAR_SIZE = 256
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const AVATARS_DIR = path.join(process.cwd(), "public", "uploads", "avatars")

async function removeAvatarFile(url?: string) {
    if (!url?.startsWith("/uploads/avatars/")) return
    try {
        await unlink(path.join(process.cwd(), "public", url))
    } catch {
        // already gone — nothing to do
    }
}

// Any logged-in user can set their own avatar — a profile photo, so it's
// center-cropped to a square (unlike the logo/favicon, which stay uncropped)
export async function uploadAvatarAction(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: "Please log in again." }

    const file = formData.get("file") as File | null
    if (!file) return { error: "No file provided" }
    if (!ALLOWED_TYPES.includes(file.type)) return { error: "Only PNG, JPG or WebP images are allowed." }
    if (file.size === 0) return { error: "File is empty." }
    if (file.size > MAX_SIZE_BYTES) return { error: "File too large. Maximum size is 5 MB." }

    let buffer: Buffer
    try {
        const raw = Buffer.from(await file.arrayBuffer())
        buffer = Buffer.from(
            await sharp(raw)
                .rotate()
                .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover", position: "centre" })
                .webp({ quality: 85 })
                .toBuffer()
        )
    } catch {
        return { error: "Could not process the image. Please try a different file." }
    }

    const filename = `avatar_${user._id}_${Date.now()}.webp`
    await mkdir(AVATARS_DIR, { recursive: true })
    await writeFile(path.join(AVATARS_DIR, filename), buffer)

    const url = `/uploads/avatars/${filename}`
    await removeAvatarFile(user.avatarUrl)
    await setUserAvatar(user._id!.toString(), url)

    revalidatePath("/", "layout")
    return { url }
}

export async function deleteAvatarAction() {
    const user = await getCurrentUser()
    if (!user) return { error: "Please log in again." }

    await removeAvatarFile(user.avatarUrl)
    await setUserAvatar(user._id!.toString(), undefined)

    revalidatePath("/", "layout")
    return { ok: true }
}
