export const dynamic = 'force-dynamic'

import "../inbox/inbox.css"
import "./top-up.css"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/lib/session"
import { getPaymentSettings } from "@/app/lib/payment-settings"
import TopUpForm from "./TopUpForm"

export default async function TopUpPage() {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    const settings = await getPaymentSettings()

    return (
        <div className="section-content active">
            <div className="section-header">
                <h1 className="section-title">Add Funds</h1>
                <p className="section-subtitle">Your balance: <strong>${(user.balance ?? 0).toFixed(2)}</strong></p>
            </div>

            {settings.bonusPercent > 0 && (
                <div className="topup-bonus-banner">
                    Get <strong>{settings.bonusPercent}% bonus</strong> for {settings.bonusMethod} top-ups
                </div>
            )}

            <TopUpForm
                configuredMethods={settings.methods.filter(m => m.address.trim()).map(m => m.id)}
                minimumTopUp={settings.minimumTopUp || 25}
            />

            <div className="topup-note">
                <strong>Note:</strong> {settings.note}
            </div>
        </div>
    )
}
