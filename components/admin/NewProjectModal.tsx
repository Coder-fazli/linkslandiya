"use client"

import React, { useState, useEffect } from "react"
import { ShineButton } from "@/components/ui/ShineButton"

const CATEGORIES = [
  "Technology", "Finance", "Health & Wellness", "Fashion & Beauty",
  "Travel", "Food & Recipes", "Sports", "Education", "Real Estate",
  "Automotive", "Entertainment", "Business", "Legal", "Casino & Gambling", "Other",
]

type Props = {
  onClose: () => void
  onCreated?: () => void
  required?: boolean
  editProject?: { _id: string; targetDomain: string; category?: string; competitors?: string[]; note?: string }
}

export default function NewProjectModal({ onClose, onCreated, required, editProject }: Props) {
  const isEdit = !!editProject
  const [targetDomain, setTargetDomain] = useState(editProject?.targetDomain ?? "")
  const [category, setCategory] = useState(editProject?.category ?? "")
  const [competitors, setCompetitors] = useState<string[]>(editProject?.competitors?.length ? editProject.competitors : [""])
  const [note, setNote] = useState(editProject?.note ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !required) onClose() }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose, required])

  function addCompetitor() {
    if (competitors.length < 5) setCompetitors([...competitors, ""])
  }

  function updateCompetitor(i: number, val: string) {
    const next = [...competitors]
    next[i] = val
    setCompetitors(next)
  }

  function removeCompetitor(i: number) {
    setCompetitors(competitors.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    if (!targetDomain.trim()) { setError("Target domain is required"); return }
    setSaving(true)
    setError("")
    try {
      const res = isEdit
        ? await fetch("/api/projects", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editProject!._id, targetDomain: targetDomain.trim(), category, competitors, note }),
          })
        : await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetDomain: targetDomain.trim(), category, competitors, note }),
          })
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed to save"); return }
      onCreated?.()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
    }} onClick={e => { if (!required && e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: "var(--bg-primary, #fff)", borderRadius: "20px",
        width: "100%", maxWidth: "580px", maxHeight: "90vh",
        boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
        animation: "modalPop 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 800 }}>{isEdit ? "Edit Project" : "Add New Project"}</h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>{isEdit ? "Update your project details" : "Track your link building for a specific website"}</p>
          </div>
          {!required && <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "22px", lineHeight: 1, padding: "4px" }}>×</button>}
        </div>

        {/* Body — scrollable */}
        <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>

          {/* Target Domain */}
          <div className="form-group">
            <label className="form-label">Domain / Target URL <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              type="text" className="form-input"
              value={targetDomain}
              onChange={e => { setTargetDomain(e.target.value); setError("") }}
              placeholder="e.g. myblog.com or https://myblog.com/category"
              autoFocus
            />
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
              Enter the domain or target URL of any page you want to build links for
            </p>
            {error && <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#ef4444" }}>{error}</p>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category <span style={{ color: "#ef4444" }}>*</span></label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Competitors */}
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label className="form-label" style={{ margin: 0 }}>Competitors</label>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>You can add up to 5 competitors</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {competitors.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text" className="form-input" style={{ flex: 1 }}
                    value={c} onChange={e => updateCompetitor(i, e.target.value)}
                    placeholder="Domain or path"
                  />
                  {competitors.length > 1 && (
                    <button onClick={() => removeCompetitor(i)} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#ef4444", cursor: "pointer", padding: "0 12px", fontSize: "18px" }}>×</button>
                  )}
                </div>
              ))}
            </div>
            {competitors.length < 5 && (
              <button onClick={addCompetitor} style={{
                marginTop: "8px", background: "none", border: "1px dashed var(--brand-primary)",
                borderRadius: "8px", color: "var(--brand-primary)", cursor: "pointer",
                padding: "7px 16px", fontSize: "13px", fontWeight: 600, width: "100%",
              }}>
                + Add Competitor
              </button>
            )}
          </div>

          {/* Note */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Additional Note</label>
            <textarea
              className="form-textarea" rows={3}
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="Any additional information about this project..."
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        {/* Footer — always visible */}
        <div style={{ padding: "16px 28px 28px", display: "flex", justifyContent: "flex-end", gap: "12px", flexShrink: 0, borderTop: "1px solid var(--border-color, #f0f0f0)" }}>
          {!required && <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>}
          <ShineButton
            label={saving ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Project")}
            size="md"
            onClick={handleSave}
            disabled={saving}
          />
        </div>
      </div>

      <style>{`
        @keyframes modalPop {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}
