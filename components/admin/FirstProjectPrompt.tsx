"use client"

import { useState } from "react"
import { ShineButton } from "@/components/ui/ShineButton"
import NewProjectModal from "./NewProjectModal"
import { useRouter } from "next/navigation"

export default function FirstProjectPrompt() {
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  if (showForm) {
    return (
      <NewProjectModal
        onClose={() => setShowForm(false)}
        onCreated={() => { router.push("/admin/projects"); router.refresh() }}
        required
      />
    )
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
    }}>
      <div style={{
        background: "var(--bg-primary, #fff)", borderRadius: "24px",
        maxWidth: "440px", width: "100%", textAlign: "center",
        padding: "48px 40px",
        boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
        animation: "promptPop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary, var(--brand-primary)))",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
          boxShadow: "0 10px 30px color-mix(in srgb, var(--brand-primary) 35%, transparent)",
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" width="38" height="38">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            <line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
          </svg>
        </div>

        <h2 style={{ margin: "0 0 12px", fontSize: "24px", fontWeight: 800, lineHeight: 1.2 }}>
          Start Your First Project
        </h2>
        <p style={{ margin: "0 0 32px", fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          You haven't created any projects yet. Create one now to start building links for your website — it's quick and easy.
        </p>

        <div style={{ width: "100%", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
          <ShineButton label="+ Create New Project" size="lg" onClick={() => setShowForm(true)} />
        </div>

      </div>

      <style>{`
        @keyframes promptPop {
          from { transform: scale(0.8); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  )
}
