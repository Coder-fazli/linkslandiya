import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/lib/session"
import { getProjectsByBuyer, createProject, deleteProject } from "@/app/lib/projects"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  const projects = await getProjectsByBuyer(user._id.toString())
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  const body = await req.json()
  const { name, targetDomain, category, forbiddenCategory, competitors, note } = body
  if (!targetDomain) return NextResponse.json({ error: "Target domain is required" }, { status: 400 })
  const id = await createProject({
    buyerId: user._id.toString(),
    name: name || targetDomain,
    targetDomain,
    category,
    forbiddenCategory,
    competitors: competitors?.filter(Boolean) ?? [],
    note,
  })
  return NextResponse.json({ id })
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  const { id } = await req.json()
  await deleteProject(id, user._id.toString())
  return NextResponse.json({ ok: true })
}
