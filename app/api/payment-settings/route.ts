import { NextResponse } from "next/server"
import { getPaymentSettings, updatePaymentSettings } from "@/app/lib/payment-settings"
import { getCurrentUser } from "@/app/lib/session"

export async function GET() {
  const settings = await getPaymentSettings()
  return NextResponse.json(settings)
}

export async function PUT(req: Request) {
  const user = await getCurrentUser()
  if (!user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const body = await req.json()
  await updatePaymentSettings(body)
  return NextResponse.json({ ok: true })
}
