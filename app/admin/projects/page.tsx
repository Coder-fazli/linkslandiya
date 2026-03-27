"use client"

import React, { useState, useEffect } from "react"
import type { Project } from "@/app/lib/projects"
import NewProjectModal from "@/components/admin/NewProjectModal"
import { ShineButton } from "@/components/ui/ShineButton"

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Technology:        { bg: "#eff6ff", color: "#2563eb" },
  Finance:           { bg: "#f0fdf4", color: "#16a34a" },
  "Health & Wellness": { bg: "#fdf4ff", color: "#9333ea" },
  "Fashion & Beauty":{ bg: "#fff1f2", color: "#e11d48" },
  Travel:            { bg: "#fff7ed", color: "#ea580c" },
  "Food & Recipes":  { bg: "#fefce8", color: "#ca8a04" },
  Sports:            { bg: "#ecfdf5", color: "#059669" },
  Education:         { bg: "#eff6ff", color: "#3b82f6" },
  "Real Estate":     { bg: "#f0fdf4", color: "#15803d" },
  Automotive:        { bg: "#f8fafc", color: "#475569" },
  Entertainment:     { bg: "#fdf4ff", color: "#a855f7" },
  Business:          { bg: "#eff6ff", color: "#1d4ed8" },
  Legal:             { bg: "#fef2f2", color: "#dc2626" },
  "Casino & Gambling":{ bg: "#fefce8", color: "#b45309" },
  Other:             { bg: "#f8fafc", color: "#64748b" },
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"active" | "archived">("active")
  const [showModal, setShowModal] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)

  async function load() {
    const res = await fetch("/api/projects")
    const data = await res.json()
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleArchive(p: Project) {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p._id, archived: !p.archived }),
    })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm("Permanently delete this project?")) return
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    load()
  }

  const active   = projects.filter(p => !p.archived)
  const archived = projects.filter(p => p.archived)
  const visible  = tab === "active" ? active : archived

  return (
    <div className="section-content active">

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 className="section-title" style={{ marginBottom: "2px" }}>My Projects</h1>
          <p className="section-subtitle">Websites you're building links for</p>
        </div>
        <ShineButton
          label="+ Add New Project"
          size="md"
          onClick={() => { setEditProject(null); setShowModal(true) }}
        />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "2px solid var(--border-color, #e2e8f0)", marginBottom: "24px" }}>
        {[
          { key: "active",   label: `Active (${active.length})` },
          { key: "archived", label: `Archive (${archived.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as "active" | "archived")} style={{
            padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
            fontWeight: 700, fontSize: "14px",
            color: tab === t.key ? "var(--brand-primary)" : "var(--text-secondary)",
            borderBottom: tab === t.key ? "2px solid var(--brand-primary)" : "2px solid transparent",
            marginBottom: "-2px", transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="card"><div className="card-body" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "48px" }}>Loading…</div></div>
      ) : visible.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: "center", padding: "64px 24px" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--bg-secondary, #f1f5f9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" width="32" height="32">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>
              {tab === "active" ? "No active projects" : "No archived projects"}
            </h3>
            <p style={{ margin: "0 0 24px", color: "var(--text-secondary)", fontSize: "14px" }}>
              {tab === "active" ? "Create your first project to start tracking link building" : "Archived projects will appear here"}
            </p>
            {tab === "active" && (
              <ShineButton label="+ Create New Project" size="md" onClick={() => { setEditProject(null); setShowModal(true) }} />
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
          {visible.map(p => {
            const catStyle = (p.category && CATEGORY_COLORS[p.category]) || { bg: "#f1f5f9", color: "#64748b" }
            const domainClean = p.targetDomain.replace(/^https?:\/\//, "").replace(/\/$/, "")
            const initial = domainClean.charAt(0).toUpperCase()
            const competitorCount = p.competitors?.filter(Boolean).length ?? 0

            return (
              <div key={p._id} style={{
                background: "var(--bg-primary, #fff)",
                borderRadius: "16px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                border: "1px solid var(--border-color, #e8edf2)",
                overflow: "hidden",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,180,216,0.15)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)" }}
              >
                {/* Card Header */}
                <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border-color, #f0f4f8)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                      {/* Domain avatar */}
                      <div style={{
                        width: 44, height: 44, borderRadius: "12px", flexShrink: 0,
                        background: "linear-gradient(135deg, var(--brand-primary), #0096b7)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px", fontWeight: 800, color: "#fff",
                        boxShadow: "0 4px 12px rgba(0,180,216,0.3)",
                      }}>
                        {initial}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <a href={p.targetDomain.startsWith("http") ? p.targetDomain : `https://${p.targetDomain}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ fontWeight: 800, fontSize: "15px", color: "var(--text-primary)", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-primary)")}
                          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}
                        >
                          {domainClean}
                        </a>
                        {p.category && (
                          <span style={{ display: "inline-block", marginTop: "3px", padding: "2px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, background: catStyle.bg, color: catStyle.color }}>
                            {p.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action icons */}
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      {/* Edit */}
                      <button onClick={() => { setEditProject(p); setShowModal(true) }}
                        title="Edit project"
                        style={{ width: 34, height: 34, borderRadius: "8px", border: "1px solid var(--border-color, #e2e8f0)", background: "var(--bg-secondary, #f8fafc)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", transition: "all 0.15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff"; (e.currentTarget as HTMLButtonElement).style.color = "#2563eb"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#bfdbfe" }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary, #f8fafc)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-color, #e2e8f0)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>

                      {/* Archive / Unarchive */}
                      <button onClick={() => handleArchive(p)}
                        title={p.archived ? "Restore project" : "Archive project"}
                        style={{ width: 34, height: 34, borderRadius: "8px", border: "1px solid var(--border-color, #e2e8f0)", background: "var(--bg-secondary, #f8fafc)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", transition: "all 0.15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff7ed"; (e.currentTarget as HTMLButtonElement).style.color = "#ea580c"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#fed7aa" }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary, #f8fafc)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-color, #e2e8f0)" }}
                      >
                        {p.archived ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                          </svg>
                        )}
                      </button>

                      {/* Delete */}
                      <button onClick={() => handleDelete(p._id!)}
                        title="Delete project"
                        style={{ width: 34, height: 34, borderRadius: "8px", border: "1px solid #fecaca", background: "#fef2f2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", transition: "all 0.15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2" }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--border-color, #f0f4f8)" }}>
                  {[
                    {
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0096b7" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
                      label: "Backlinks Built", value: "0",
                    },
                    {
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                      label: "Total Spent", value: "$0",
                    },
                    {
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                      label: "Competitors", value: String(competitorCount),
                    },
                  ].map((stat, i) => (
                    <div key={i} style={{ background: "var(--bg-primary, #fff)", padding: "14px 12px" }}>
                      <div style={{ marginBottom: "6px" }}>{stat.icon}</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{stat.value}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "3px", fontWeight: 500 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Note */}
                {p.note && (
                  <div style={{ padding: "10px 16px", background: "var(--bg-secondary, #f8fafc)", borderTop: "1px solid var(--border-color, #f0f4f8)", fontSize: "12px", color: "var(--text-secondary)", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    📝 {p.note}
                  </div>
                )}

                {/* Footer */}
                <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                    Added {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <ShineButton
                    label="Browse Websites →"
                    href="/websites"
                    size="sm"
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <NewProjectModal
          onClose={() => { setShowModal(false); setEditProject(null) }}
          onCreated={load}
          editProject={editProject ?? undefined as any}
        />
      )}
    </div>
  )
}
