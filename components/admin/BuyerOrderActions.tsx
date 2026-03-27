"use client"

import { useState } from "react"
import { confirmOrderAction, requestRevisionAction } from "@/app/lib/actions"

type Props = {
    orderId: string
    publishedLink: string
}

export default function BuyerOrderActions({ orderId, publishedLink }: Props) {
    const [view, setView] = useState<"default" | "revision">("default")
    const [note, setNote] = useState("")
    const [saving, setSaving] = useState(false)

    async function handleConfirm() {
        setSaving(true)
        await confirmOrderAction(orderId)
        setSaving(false)
    }

    async function handleRevision() {
        if (!note.trim()) { alert("Please describe what needs to be changed"); return }
        setSaving(true)
        await requestRevisionAction(orderId, note)
        setSaving(false)
    }

    return (
        <div className="card" style={{ marginBottom: "1.25rem" }}>
            <div className="card-header"><h3>Review Published Link</h3></div>
            <div className="card-body">

                {/* Published link */}
                <div style={{ marginBottom: "16px", padding: "14px 16px", background: "var(--bg-secondary, #f8fafc)", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Published Link</div>
                    <a href={publishedLink} target="_blank" rel="noopener noreferrer"
                        style={{ color: "var(--brand-primary)", wordBreak: "break-all", fontSize: "14px", fontWeight: 500 }}>
                        {publishedLink}
                    </a>
                </div>

                <p style={{ margin: "0 0 16px", fontSize: "14px", color: "var(--text-secondary)" }}>
                    Please check the published link above. If everything looks good, confirm completion to release payment to the publisher. If changes are needed, request a revision.
                </p>

                {view === "default" && (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleConfirm}
                            disabled={saving}
                            style={{ flex: 1, background: "#22c55e", borderColor: "#22c55e" }}
                        >
                            {saving ? "Processing..." : "✓ Confirm Completion"}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setView("revision")}
                            disabled={saving}
                            style={{ flex: 1, color: "#f97316", borderColor: "#fed7aa" }}
                        >
                            Request Revision
                        </button>
                    </div>
                )}

                {view === "revision" && (
                    <>
                        <div className="form-group" style={{ marginBottom: "12px" }}>
                            <label className="form-label">What needs to be changed? <span style={{ color: "#ef4444" }}>*</span></label>
                            <textarea
                                className="form-textarea"
                                rows={4}
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                placeholder="e.g. The target URL is wrong, please update to... / The anchor text should be... / The article is missing..."
                                style={{ resize: "vertical" }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                className="btn btn-primary"
                                onClick={handleRevision}
                                disabled={saving}
                                style={{ flex: 1, background: "#f97316", borderColor: "#f97316" }}
                            >
                                {saving ? "Sending..." : "Send Revision Request"}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => { setView("default"); setNote("") }}
                                disabled={saving}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
