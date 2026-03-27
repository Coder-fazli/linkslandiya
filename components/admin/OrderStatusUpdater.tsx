"use client"

import { useState } from "react"
import { updateStatus, submitForReviewAction } from "@/app/lib/actions"

type Props = {
    orderId: string
    currentStatus: string
    currentLink?: string
    websiteName: string
    revisionNote?: string
}

export default function OrderStatusUpdater({ orderId, currentStatus, currentLink, websiteName, revisionNote }: Props) {
    const [saving, setSaving] = useState(false)
    const [link, setLink] = useState(currentLink || "")
    const [linkError, setLinkError] = useState("")

    function validateLink(url: string): boolean {
        if (!url.trim()) { setLinkError("Published link is required"); return false }
        try {
            const linkDomain = new URL(url).hostname.replace("www.", "")
            const siteDomain = new URL(websiteName.startsWith("http") ? websiteName : `https://${websiteName}`).hostname.replace("www.", "")
            if (linkDomain !== siteDomain) {
                setLinkError(`Link must be from ${siteDomain}`)
                return false
            }
        } catch {
            setLinkError("Invalid URL format")
            return false
        }
        setLinkError("")
        return true
    }

    async function handleAccept() {
        setSaving(true)
        await updateStatus(orderId, "in_progress")
        setSaving(false)
    }

    async function handleSubmitReview() {
        if (!validateLink(link)) return
        setSaving(true)
        await submitForReviewAction(orderId, link)
        setSaving(false)
    }

    // Read-only states
    if (currentStatus === "completed") {
        return (
            <div className="card" style={{ marginBottom: "1.25rem" }}>
                <div className="card-header"><h3>Order Status</h3></div>
                <div className="card-body">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>
                        <span style={{ fontWeight: 700, color: "#15803d" }}>Order completed — payment received</span>
                    </div>
                </div>
            </div>
        )
    }

    if (currentStatus === "review") {
        return (
            <div className="card" style={{ marginBottom: "1.25rem" }}>
                <div className="card-header"><h3>Order Status</h3></div>
                <div className="card-body">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span style={{ fontWeight: 600, color: "#1d4ed8" }}>Waiting for buyer to confirm…</span>
                    </div>
                    {currentLink && (
                        <div style={{ marginTop: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                            Submitted link: <a href={currentLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-primary)", wordBreak: "break-all" }}>{currentLink}</a>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (currentStatus === "cancelled") {
        return (
            <div className="card" style={{ marginBottom: "1.25rem" }}>
                <div className="card-header"><h3>Order Status</h3></div>
                <div className="card-body">
                    <div style={{ padding: "12px 16px", background: "#fef2f2", borderRadius: "8px", border: "1px solid #fecaca", fontWeight: 600, color: "#dc2626" }}>
                        Order cancelled
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="card" style={{ marginBottom: "1.25rem" }}>
            <div className="card-header"><h3>Order Status</h3></div>
            <div className="card-body">

                {/* Revision note — show prominently when buyer requested changes */}
                {currentStatus === "revision" && revisionNote && (
                    <div style={{ marginBottom: "16px", padding: "14px 16px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <span style={{ fontWeight: 700, color: "#c2410c", fontSize: "13px" }}>Revision requested by buyer</span>
                        </div>
                        <p style={{ margin: 0, fontSize: "14px", color: "#9a3412", lineHeight: 1.5 }}>{revisionNote}</p>
                    </div>
                )}

                {/* Accept order button for pending */}
                {currentStatus === "pending" && (
                    <div style={{ marginBottom: "16px" }}>
                        <button className="btn btn-primary" onClick={handleAccept} disabled={saving} style={{ width: "100%" }}>
                            {saving ? "Accepting..." : "Accept Order"}
                        </button>
                        <p style={{ margin: "8px 0 0", fontSize: "12px", color: "var(--text-secondary)", textAlign: "center" }}>
                            Click to start working on this order
                        </p>
                    </div>
                )}

                {/* Published link + submit for review */}
                {(currentStatus === "in_progress" || currentStatus === "revision") && (
                    <>
                        <div className="form-group" style={{ marginBottom: "8px" }}>
                            <label className="form-label">Published Link <span style={{ color: "#ef4444" }}>*</span></label>
                            <input
                                type="url"
                                className="form-input"
                                value={link}
                                onChange={e => { setLink(e.target.value); setLinkError("") }}
                                placeholder={`https://${websiteName.replace(/^https?:\/\//, "")}/your-article`}
                                style={linkError ? { borderColor: "#ef4444" } : {}}
                            />
                            {linkError && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{linkError}</p>}
                            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                                Must be a URL on <strong>{websiteName.replace(/^https?:\/\//, "")}</strong>
                            </p>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: "100%", background: "#8b5cf6", borderColor: "#8b5cf6" }}
                            onClick={handleSubmitReview}
                            disabled={saving}
                        >
                            {saving ? "Submitting..." : "Submit for Review"}
                        </button>
                        <p style={{ margin: "8px 0 0", fontSize: "12px", color: "var(--text-secondary)", textAlign: "center" }}>
                            Buyer will confirm and release your payment
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}
