import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getCurrentUser } from "@/app/lib/session"

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME_TYPES = [
  "application/msword",                                                    // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
]
const ALLOWED_EXTENSIONS = [".doc", ".docx"]

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  // ── Validations ────────────────────────────────────────
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const ext = path.extname(file.name).toLowerCase()

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: `Invalid file type "${ext}". Only .doc and .docx files are accepted.` },
      { status: 400 }
    )
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file format. Only Word documents (.doc, .docx) are accepted." },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE_BYTES) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1)
    return NextResponse.json(
      { error: `File too large (${sizeMB} MB). Maximum allowed size is 10 MB.` },
      { status: 400 }
    )
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty." }, { status: 400 })
  }
  // ── Save file ──────────────────────────────────────────
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Unique filename: timestamp + user id + original name
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const filename = `${Date.now()}_${user._id}${ext}`
  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  const uploadPath = path.join(uploadsDir, filename)

  await mkdir(uploadsDir, { recursive: true })
  await writeFile(uploadPath, buffer)

  return NextResponse.json({ url: `/uploads/${filename}`, filename: safeName })
}
