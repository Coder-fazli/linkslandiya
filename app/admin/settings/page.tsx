import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import SettingsForm from "./SettingsForm"

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")

  return <SettingsForm user={{
    _id: user._id?.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    activeMode: user.activeMode,
    isAdmin: user.isAdmin,
    canBuy: user.canBuy,
    canPublish: user.canPublish,
    balance: user.balance ?? 0,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    country: user.country ?? "",
    phone: user.phone ?? "",
    companyWebsite: user.companyWebsite ?? "",
    identity: user.identity ?? "",
    paymentCountry: user.paymentCountry ?? "",
    paymentMethod: user.paymentMethod ?? "",
    paypalEmail: user.paypalEmail ?? "",
  }} />
}
