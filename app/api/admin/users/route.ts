import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/lib/session"
import { adjustUserBalance, getUserById } from "@/app/lib/user"
import { ObjectId } from "mongodb"
import { getCollection } from "@/app/lib/user"

// PATCH: adjust user balance
export async function PATCH(req: Request) {
  const admin = await getCurrentUser()
  if (!admin?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { userId, amount } = await req.json()
  if (!userId || amount === undefined) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  await adjustUserBalance(userId, Number(amount))
  return NextResponse.json({ ok: true })
}
