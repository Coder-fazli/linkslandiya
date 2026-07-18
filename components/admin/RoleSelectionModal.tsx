"use client"

import { useState } from "react"
import { selectUserRoles } from "@/app/(auth)/actions"

const PUBLISHER_BENEFITS = [
  "Submit your websites and get paid",
  "Access to verified advertisers",
  "Regular & reliable payouts",
  "Full control over your listings",
]

const ADVERTISER_BENEFITS = [
  "Boost rankings with high-quality backlinks",
  "Thousands of websites across 50+ categories",
  "100% human-written, original content",
  "Dedicated support & campaign tracking",
]

// Identical gradient tiles with a role icon — same size and position on both cards
function RoleIcon({ kind }: { kind: "publisher" | "advertiser" }) {
  return (
    <div style={{
      width: "84px", height: "84px", borderRadius: "20px",
      background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))",
      display: "flex", alignItems: "center", justifyContent: "center",
      margin: "0 auto 18px",
      boxShadow: "0 6px 18px var(--brand-primary-shadow)",
      flexShrink: 0,
    }}>
      {kind === "publisher" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" width="42" height="42">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" width="42" height="42">
          <path d="m3 11 18-5v12L3 14v-3z"/>
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
        </svg>
      )}
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px", textAlign: "left" }}>
      <svg viewBox="0 0 16 16" fill="none" width="16" height="16" style={{ flexShrink: 0, marginTop: "2px" }}>
        <path d="M3 8l3.5 3.5L13 4.5" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

export default function RoleSelectionModal() {
  const [isAdvertiser, setIsAdvertiser] = useState(false)
  const [isPublisher, setIsPublisher]   = useState(false)
  const [loading, setLoading]           = useState(false)

  const canContinue = isAdvertiser || isPublisher

  async function handleContinue() {
    if (!canContinue) return
    setLoading(true)
    await selectUserRoles(isAdvertiser, isPublisher)
  }

  const cardStyle = (selected: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "28px 20px 24px",
    borderRadius: "16px",
    cursor: "pointer",
    // Top-align content — buttons vertically center it by default, which made
    // the two cards' images sit at different heights
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "flex-start",
    border: selected
      ? "2.5px solid var(--brand-primary)"
      : "2px solid #e2e8f0",
    background: selected ? "var(--brand-primary-bg)" : "#fff",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
    textAlign: "center" as const,
    position: "relative" as const,
    boxShadow: selected
      ? "0 4px 20px var(--brand-primary-shadow)"
      : "0 2px 12px rgba(0,0,0,0.06)",
  })

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "#f0f9fb",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px var(--brand-primary-shadow)",
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" width="20" height="20">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <span style={{ fontWeight: 800, fontSize: "18px", color: "#0f172a" }}>Linkslandia</span>
      </div>

      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "680px",
        padding: "40px 36px 36px",
        boxShadow: "0 8px 40px rgba(0, 180, 216, 0.10)",
        animation: "rolePop 0.38s cubic-bezier(0.34,1.56,0.64,1)",
      }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: 800, color: "#0f172a" }}>
            Select Your Role
          </h1>
          <p style={{ margin: "0 0 14px", fontSize: "15px", color: "#64748b", fontWeight: 500 }}>
            Who are you?
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "var(--brand-primary-bg)", border: "1px solid var(--brand-primary-border)",
            borderRadius: "20px", padding: "5px 14px",
          }}>
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="var(--brand-primary)" opacity="0.9"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none" opacity="0.5"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none" opacity="0.5"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="var(--brand-primary)" opacity="0.9"/>
            </svg>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--brand-primary-dark)" }}>
              You can select one or both
            </span>
          </div>
        </div>

        {/* Role Cards */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>

          {/* Publisher Card */}
          <button onClick={() => setIsPublisher(v => !v)} style={cardStyle(isPublisher)}>
            {/* Checkbox indicator — always visible */}
            <div style={{
              position: "absolute", top: "12px", right: "12px",
              width: "24px", height: "24px", borderRadius: "50%",
              background: isPublisher ? "var(--brand-primary)" : "transparent",
              border: isPublisher ? "none" : "2px solid #cbd5e1",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, border 0.2s",
              boxShadow: isPublisher ? "0 2px 8px var(--brand-primary-shadow)" : "none",
            }}>
              {isPublisher && (
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" width="13" height="13">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>

            <RoleIcon kind="publisher" />

            <div style={{
              fontWeight: 700, fontSize: "17px", marginBottom: "14px",
              color: isPublisher ? "var(--brand-primary-dark)" : "#0f172a",
              transition: "color 0.2s",
            }}>
              I am a Publisher
            </div>

            <div>
              {PUBLISHER_BENEFITS.map(b => <BenefitItem key={b} text={b} />)}
            </div>
          </button>

          {/* Advertiser Card */}
          <button onClick={() => setIsAdvertiser(v => !v)} style={cardStyle(isAdvertiser)}>
            {/* Checkbox indicator — always visible */}
            <div style={{
              position: "absolute", top: "12px", right: "12px",
              width: "24px", height: "24px", borderRadius: "50%",
              background: isAdvertiser ? "var(--brand-primary)" : "transparent",
              border: isAdvertiser ? "none" : "2px solid #cbd5e1",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, border 0.2s",
              boxShadow: isAdvertiser ? "0 2px 8px var(--brand-primary-shadow)" : "none",
            }}>
              {isAdvertiser && (
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" width="13" height="13">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>

            <RoleIcon kind="advertiser" />

            <div style={{
              fontWeight: 700, fontSize: "17px", marginBottom: "14px",
              color: isAdvertiser ? "var(--brand-primary-dark)" : "#0f172a",
              transition: "color 0.2s",
            }}>
              I am an Advertiser
            </div>

            <div>
              {ADVERTISER_BENEFITS.map(b => <BenefitItem key={b} text={b} />)}
            </div>
          </button>

        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          {!canContinue ? (
            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
              Select at least one role to continue
            </p>
          ) : (
            <button
              onClick={handleContinue}
              disabled={loading}
              style={{
                padding: "12px 40px", borderRadius: "10px", border: "none",
                background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))",
                color: "#fff", fontWeight: 700, fontSize: "15px", cursor: "pointer",
                boxShadow: "0 4px 16px var(--brand-primary-shadow)",
                transition: "opacity 0.2s",
                opacity: loading ? 0.7 : 1,
                letterSpacing: "0.01em",
              }}
            >
              {loading ? "Setting up your account..." : "Register Now!"}
            </button>
          )}
        </div>

      </div>

      <style>{`
        @keyframes rolePop {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  )
}
