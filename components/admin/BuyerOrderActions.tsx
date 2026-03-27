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
        <div className="card" style={{ marginBottom: "1.25rem", border: "2px solid #22c55e" }}>
            <div className="card-header" style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderBottom: "1px solid #bbf7d0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "14px", color: "#15803d" }}>Ready for Review</h3>
                        <p style={{ margin: 0, fontSize: "11px", color: "#16a34a", opacity: 0.8 }}>Publisher submitted the link</p>
                    </div>
                </div>
            </div>
            <div className="card-body" style={{ padding: "14px" }}>

                {/* Published link */}
                <div style={{ marginBottom: "12px", padding: "10px 12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Published Link</div>
                    <a href={publishedLink} target="_blank" rel="noopener noreferrer"
                        style={{ color: "var(--brand-primary)", wordBreak: "break-all", fontSize: "12px", fontWeight: 500, lineHeight: 1.4, display: "block" }}>
                        {publishedLink}
                    </a>
                </div>

                {view === "default" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleConfirm}
                            disabled={saving}
                            style={{ width: "100%", background: "#22c55e", borderColor: "#22c55e", fontWeight: 700 }}
                        >
                            {saving ? "Processing..." : "✓ Confirm Completion"}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setView("revision")}
                            disabled={saving}
                            style={{ width: "100%", color: "#f97316", borderColor: "#fed7aa", fontSize: "13px" }}
                        >
                            Request Revision
                        </button>
                    </div>
                )}

                {view === "revision" && (
                    <>
                        <textarea
                            className="form-textarea"
                            rows={3}
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="What needs to be changed? e.g. wrong URL, missing anchor text..."
                            style={{ resize: "vertical", marginBottom: "8px", fontSize: "13px" }}
                        />
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                className="btn btn-primary"
                                onClick={handleRevision}
                                disabled={saving}
                                style={{ flex: 1, background: "#f97316", borderColor: "#f97316", fontSize: "13px" }}
                            >
                                {saving ? "Sending..." : "Send"}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => { setView("default"); setNote("") }}
                                disabled={saving}
                                style={{ flex: 1, fontSize: "13px" }}
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
