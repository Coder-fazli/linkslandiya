import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"
import { getCurrentUser } from "@/app/lib/session"
import { getConversationById } from "@/app/lib/inbox"
import { getDb } from "@/app/lib/db"

// Chat attachments are payment screenshots — private. Only the conversation's
// user or an admin may view one; everyone else gets 404.
const ATTACHMENTS_DIR = path.join(process.cwd(), "private-uploads", "chat")

export const dynamic = "force-dynamic"

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ file: string }> }
) {
    const user = await getCurrentUser()
    if (!user) return new NextResponse("Not found", { status: 404 })

    const { file } = await params

    // Filenames are server-generated: timestamp_hex.webp — reject anything else
    if (!/^[0-9]+_[0-9a-f]+\.webp$/.test(file)) return new NextResponse("Not found", { status: 404 })

    // Find the message carrying this attachment, then check thread membership
    const db = await getDb()
    const message = await db.collection("messages").findOne({ attachmentFile: file })
    if (!message) return new NextResponse("Not found", { status: 404 })

    const conversation = await getConversationById(message.conversationId)
    if (!conversation) return new NextResponse("Not found", { status: 404 })
    if (conversation.userId !== user._id!.toString() && !user.isAdmin) {
        return new NextResponse("Not found", { status: 404 })
    }

    try {
        const data = await readFile(path.join(ATTACHMENTS_DIR, file))
        return new NextResponse(new Uint8Array(data), {
            headers: {
                "Content-Type": "image/webp",
                "Cache-Control": "private, max-age=3600",
            },
        })
    } catch {
        return new NextResponse("Not found", { status: 404 })
    }
}
