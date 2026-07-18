export const dynamic = 'force-dynamic'

import "../inbox.css"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/lib/session"
import { getSiteSettings } from "@/app/lib/site-settings"
import SupportIdentityForm from "./SupportIdentityForm"

export default async function InboxSettingsPage() {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")
    if (!user.isAdmin) return redirect("/admin/inbox")

    const settings = await getSiteSettings()

    return (
        <div className="section-content active">
            <Link href="/admin/inbox" className="thread-back">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to inbox
            </Link>

            <div className="section-header">
                <h1 className="section-title">Chat Settings</h1>
                <p className="section-subtitle">How Administration appears to users in the inbox</p>
            </div>

            <SupportIdentityForm
                supportName={settings.supportName}
                supportAvatarUrl={settings.supportAvatarUrl}
            />
        </div>
    )
}
