export const dynamic = 'force-dynamic'

import "../inbox.css"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/lib/session"
import { getConversationById, getMessages, markConversationRead } from "@/app/lib/inbox"
import { getTopupById } from "@/app/lib/topups"
import { getUserById } from "@/app/lib/user"
import { displayName } from "@/app/lib/format"
import { creditTopupAction, rejectTopupAction, archiveConversationAction } from "@/app/lib/inbox-actions"
import { getSiteSettings } from "@/app/lib/site-settings"
import { DEFAULT_SUPPORT_NAME } from "@/models/site-settings"
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton"
import MessageInput from "@/components/inbox/MessageInput"
import ThreadLive from "@/components/inbox/ThreadLive"
import SupportAvatar from "@/components/inbox/SupportAvatar"
import { Message } from "@/models/conversation"

function dayLabel(d: Date) {
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

function timeLabel(d: Date) {
    return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

export default async function ThreadPage({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    const conversation = await getConversationById(id)
    if (!conversation) return redirect("/admin/inbox")

    // Only the conversation's user or an admin may open it
    const isOwner = conversation.userId === user._id!.toString()
    if (!isOwner && !user.isAdmin) return redirect("/admin/inbox")
    const viewerSide: "user" | "admin" = user.isAdmin && !isOwner ? "admin" : "user"

    await markConversationRead(id, viewerSide)

    const [messages, topup, otherUser, settings] = await Promise.all([
        getMessages(id),
        conversation.topupRequestId ? getTopupById(conversation.topupRequestId) : null,
        viewerSide === "admin" ? getUserById(conversation.userId) : null,
        getSiteSettings(),
    ])

    const supportName = settings.supportName || DEFAULT_SUPPORT_NAME
    const title = viewerSide === "admin" ? displayName(otherUser, conversation.userId) : supportName
    const initial = title.charAt(0).toUpperCase()

    // A message is "own" (right side) when it was sent by the viewer's side;
    // system messages count as Administration
    const isOwn = (m: Message) =>
        viewerSide === "admin" ? m.sender !== "user" : m.sender === "user"

    // Group messages by calendar day for the date separators
    const groups: { day: string; items: typeof messages }[] = []
    for (const m of messages) {
        const day = dayLabel(m.createdAt)
        const last = groups[groups.length - 1]
        if (last && last.day === day) last.items.push(m)
        else groups.push({ day, items: [m] })
    }

    return (
        <div className="section-content active">
            <ThreadLive />

            <Link href="/admin/inbox" className="thread-back">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to inbox
            </Link>

            <div className="thread-header">
                {viewerSide === "admin" ? (
                    <div className="inbox-avatar">{initial}</div>
                ) : (
                    <SupportAvatar avatarUrl={settings.supportAvatarUrl} name={supportName} />
                )}
                <div className="thread-title">
                    <h2>{title}</h2>
                    <div className="thread-subtitle">
                        {conversation.subject}
                        {viewerSide === "admin" && otherUser?.email ? ` · ${otherUser.email}` : ""}
                        {conversation.priority === "high" ? " · HIGH PRIORITY" : ""}
                    </div>
                </div>
                {viewerSide === "admin" && (
                    <Link href={`/admin/users/${conversation.userId}`} className="btn btn-secondary" style={{ textDecoration: "none", fontSize: "13px" }}>
                        View profile
                    </Link>
                )}
                <form action={archiveConversationAction.bind(null, id, true)}>
                    <button type="submit" className="inbox-archive-btn" title="Archive conversation">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <polyline points="21 8 21 21 3 21 3 8"></polyline>
                            <rect x="1" y="3" width="22" height="5"></rect>
                            <line x1="10" y1="12" x2="14" y2="12"></line>
                        </svg>
                    </button>
                </form>
            </div>

            {/* Pinned top-up bar */}
            {topup && (
                <div className="thread-topup-bar">
                    <strong>Top-Up #{topup.ref}</strong>
                    <span>${topup.amount.toFixed(2)} · {topup.method.replace("_", " ").toUpperCase()}</span>
                    {topup.status === "pending" && viewerSide === "admin" && (
                        <>
                            <form action={creditTopupAction.bind(null, topup._id!.toString())} style={{ display: "flex", gap: "8px", alignItems: "center", marginLeft: "auto" }}>
                                <input
                                    type="number" name="amount" step="0.01" min="1"
                                    defaultValue={topup.amount.toFixed(2)}
                                    className="thread-topup-amount"
                                    title="Amount to credit — adjust if the user sent a different sum"
                                />
                                <ConfirmSubmitButton
                                    className="btn-approve"
                                    message={`Credit this top-up to the user's balance? Make sure the money actually arrived.`}
                                >
                                    Confirm & Credit
                                </ConfirmSubmitButton>
                            </form>
                            <form action={rejectTopupAction.bind(null, topup._id!.toString())}>
                                <ConfirmSubmitButton
                                    className="btn-reject"
                                    message={`Reject top-up #${topup.ref}? The user will be notified in this conversation.`}
                                >
                                    Reject
                                </ConfirmSubmitButton>
                            </form>
                        </>
                    )}
                    {topup.status !== "pending" && (
                        <span className={`status-badge ${topup.status === "credited" ? "completed" : "rejected"}`} style={{ marginLeft: "auto" }}>
                            {topup.status === "credited" ? `Credited $${(topup.creditedAmount ?? topup.amount).toFixed(2)}` : "Rejected"}
                        </span>
                    )}
                    {topup.status === "pending" && viewerSide === "user" && (
                        <span className="status-badge pending" style={{ marginLeft: "auto" }}>Awaiting confirmation</span>
                    )}
                </div>
            )}

            {/* Messages */}
            <div className="thread-messages">
                {groups.map(group => (
                    <div key={group.day}>
                        <div className="thread-date-sep">{group.day}</div>
                        {group.items.map(m => {
                            const own = isOwn(m)
                            return (
                                <div key={m._id!.toString()} className={`msg-row ${own ? "own" : ""}`}>
                                    {!own && (
                                        viewerSide === "admin" ? (
                                            <div className="msg-avatar">{initial}</div>
                                        ) : (
                                            <SupportAvatar avatarUrl={settings.supportAvatarUrl} name={supportName} className="msg-avatar" />
                                        )
                                    )}
                                    <div>
                                        <div className="msg-bubble">
                                            {m.body}
                                            {m.attachmentFile && (
                                                <a
                                                    className="msg-attachment"
                                                    href={`/api/attachments/${m.attachmentFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title={m.attachmentName ?? "Attachment"}
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={`/api/attachments/${m.attachmentFile}`} alt={m.attachmentName ?? "Attachment"} />
                                                </a>
                                            )}
                                        </div>
                                        <div className="msg-time">{timeLabel(m.createdAt)}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

            <MessageInput conversationId={id} />
        </div>
    )
}
