import { NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import path from "path"

// In production (`next start`) Next.js only serves public/ files that existed
// at build time. This route serves runtime-uploaded files from public/uploads.
export const dynamic = "force-dynamic"

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")

const MIME_TYPES: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: segments } = await params
    const filePath = path.normalize(path.join(UPLOADS_DIR, ...segments))

    // Never serve anything outside public/uploads
    if (!filePath.startsWith(UPLOADS_DIR + path.sep)) {
        return new NextResponse("Not found", { status: 404 })
    }

    try {
        const info = await stat(filePath)
        if (!info.isFile()) return new NextResponse("Not found", { status: 404 })

        const data = await readFile(filePath)
        const ext = path.extname(filePath).toLowerCase()
        return new NextResponse(new Uint8Array(data), {
            headers: {
                "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
                // filenames are timestamped, so they can be cached forever
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        })
    } catch {
        return new NextResponse("Not found", { status: 404 })
    }
}
