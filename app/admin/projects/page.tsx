"use client"

import React, { useState, useEffect } from "react"
import type { Project } from "@/app/lib/projects"
import NewProjectModal from "@/components/admin/NewProjectModal"
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  async function load() {
    const res = await fetch("/api/projects")
    const data = await res.json()
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return
    await fetch("/api/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div className="section-content active">
      <div className="section-header">
        <div>
          <h1 className="section-title">My Projects</h1>
          <p className="section-subtitle">Websites you're building links for</p>
        </div>
        <LiquidButton
          onClick={() => setShowModal(true)}
          style={{
            "--liquid-button-background-color": "var(--brand-primary)",
            "--liquid-button-color": "#fff",
            color: "#fff", padding: "10px 24px", borderRadius: "8px",
            fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer",
          } as React.CSSProperties}
        >
          + Add New Project
        </LiquidButton>
      </div>

      {loading ? (
        <div className="card"><div className="card-body" style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading…</div></div>
      ) : projects.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg-secondary, #f1f5f9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" width="28" height="28">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>No projects yet</h3>
            <p style={{ margin: "0 0 24px", color: "var(--text-secondary)", fontSize: "14px" }}>Create your first project to start tracking link building</p>
            <LiquidButton
              onClick={() => setShowModal(true)}
              style={{
                "--liquid-button-background-color": "var(--brand-primary)",
                "--liquid-button-color": "#fff",
                color: "#fff", padding: "10px 28px", borderRadius: "8px",
                fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer",
              } as React.CSSProperties}
            >
              + Create New Project
            </LiquidButton>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {projects.map(p => (
            <div key={p._id} className="card" style={{ margin: 0 }}>
              <div className="card-body" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Icon */}
                <div style={{ width: 48, height: 48, borderRadius: "12px", background: "linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary) 70%, #000))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" width="22" height="22">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "2px" }}>{p.targetDomain}</div>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "12px", color: "var(--text-secondary)" }}>
                    {p.category && <span>Category: <strong>{p.category}</strong></span>}
                    {p.competitors && p.competitors.filter(Boolean).length > 0 && (
                      <span>Competitors: <strong>{p.competitors.filter(Boolean).length}</strong></span>
                    )}
                    <span>Added: <strong>{new Date(p.createdAt).toLocaleDateString()}</strong></span>
                  </div>
                  {p.note && <div style={{ marginTop: "4px", fontSize: "12px", color: "var(--text-secondary)", fontStyle: "italic" }}>{p.note}</div>}
                </div>

                <button
                  onClick={() => handleDelete(p._id!)}
                  style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#ef4444", cursor: "pointer", padding: "6px 12px", fontSize: "13px", flexShrink: 0 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} onCreated={load} />}
    </div>
  )
}
