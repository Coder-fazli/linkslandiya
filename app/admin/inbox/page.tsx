export const dynamic = 'force-dynamic'

import "./inbox.css"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/lib/session"
import { listConversations } from "@/app/lib/inbox"
import { getUsersByIds } from "@/app/lib/user"
import { displayName } from "@/app/lib/format"
import { archiveConversationAction } from "@/app/lib/inbox-actions"
import { getSiteSettings } from "@/app/lib/site-settings"
import { DEFAULT_SUPPORT_NAME } from "@/models/site-settings"
import SupportAvatar from "@/components/inbox/SupportAvatar"
import { Conversation, ConversationTopic } from "@/models/conversation"

const TABS = [
    { key: "all", label: "All" },
    { key: "payment", label: "💳 Payments" },
    { key: "orders", label: "📦 Orders" },
    { key: "support", label: "🛟 Support" },
    { key: "archived", label: "Archived" },
] as const

const TOPIC_PILL: Record<string, string> = {
    payment: "TOP-UP",
    orders: "ORDER",
    support: "SUPPORT",
}

function formatDate(d: Date) {
    const date = new Date(d)
    const now = new Date()
    const sameDay = date.toDateString() === now.toDateString()
    if (sameDay) return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default async function InboxPage({ searchParams }: {
    searchParams: Promise<{ tab?: string }>
}) {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    const { tab } = await searchParams
    const activeTab = TABS.some(t => t.key === tab) ? tab! : "all"

    const forAdmin = user.isAdmin
    const [conversations, settings] = await Promise.all([
        listConversations({
            userId: forAdmin ? undefined : user._id!.toString(),
            topic: activeTab === "all" || activeTab === "archived" ? undefined : activeTab as ConversationTopic,
            archived: activeTab === "archived",
            forAdmin,
        }),
        getSiteSettings(),
    ])
    const supportName = settings.supportName || DEFAULT_SUPPORT_NAME

    // Admin sees the user's name on each row; users always see Administration
    const userById = forAdmin
        ? new Map((await getUsersByIds(conversations.map(c => c.userId))).map(u => [u._id!.toString(), u]))
        : new Map()

    const unreadOf = (c: Conversation) => forAdmin ? c.unreadForAdmin : c.unreadForUser

    return (
        <div className="section-content active">
            <div className="section-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div>
                    <h1 className="section-title">Messages</h1>
                    <p className="section-subtitle">
                        {forAdmin ? "Conversations with users" : "Your conversations with the Linkslandia team"}
                    </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    {forAdmin && (
                        <Link href="/admin/inbox/settings" className="btn btn-secondary" style={{ textDecoration: "none" }}>
                            Chat Settings
                        </Link>
                    )}
                    {!forAdmin && (
                        <Link href="/admin/inbox/new" className="btn btn-primary" style={{ textDecoration: "none" }}>
                            + New Message
                        </Link>
                    )}
                </div>
            </div>

            {/* Topic tabs */}
            <div className="tabs" style={{ marginBottom: "16px", flexWrap: "wrap" }}>
                {TABS.map(t => (
                    <Link
                        key={t.key}
                        href={t.key === "all" ? "/admin/inbox" : `/admin/inbox?tab=${t.key}`}
                        className={`tab ${activeTab === t.key ? "active" : ""}`}
                        style={{ textDecoration: "none" }}
                    >
                        {t.label}
                    </Link>
                ))}
            </div>

            {conversations.length === 0 ? (
                <div className="card inbox-empty">
                    <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                    {activeTab === "archived" ? "No archived conversations." : "No messages here yet."}
                </div>
            ) : (
                <div className="inbox-list">
                    {conversations.map(c => {
                        const id = c._id!.toString()
                        const other = forAdmin ? userById.get(c.userId) : null
                        const name = forAdmin ? displayName(other, c.userId) : supportName
                        const unread = unreadOf(c)
                        return (
                            <div key={id} className={`inbox-row ${unread ? "unread" : ""}`}>
                                <Link href={`/admin/inbox/${id}`} className="inbox-row-link">
                                    {forAdmin ? (
                                        <div className="inbox-avatar">{name.charAt(0).toUpperCase()}</div>
                                    ) : (
                                        <SupportAvatar avatarUrl={settings.supportAvatarUrl} name={supportName} />
                                    )}
                                    <div className="inbox-row-main">
                                        <div className="inbox-row-name">
                                            {name}
                                            {c.priority === "high" && <span className="inbox-pill high">HIGH</span>}
                                        </div>
                                        <div className="inbox-row-preview">
                                            {c.subject}{c.lastPreview ? ` — ${c.lastPreview}` : ""}
                                        </div>
                                    </div>
                                    <span className="inbox-pill">{TOPIC_PILL[c.topic] ?? c.topic.toUpperCase()}</span>
                                </Link>
                                <div className="inbox-row-meta">
                                    <span>{formatDate(c.lastMessageAt)}</span>
                                    {unread > 0 && <span className="inbox-unread-dot" />}
                                    <form action={archiveConversationAction.bind(null, id, activeTab !== "archived")}>
                                        <button
                                            type="submit"
                                            className="inbox-archive-btn"
                                            title={activeTab === "archived" ? "Unarchive" : "Archive"}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                <polyline points="21 8 21 21 3 21 3 8"></polyline>
                                                <rect x="1" y="3" width="22" height="5"></rect>
                                                <line x1="10" y1="12" x2="14" y2="12"></line>
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
