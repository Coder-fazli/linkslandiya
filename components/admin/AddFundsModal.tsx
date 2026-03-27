"use client"

import { useEffect, useState } from "react"
import type { PaymentSettings } from "@/app/lib/payment-settings"

type Props = { onClose: () => void }

export default function AddFundsModal({ onClose }: Props) {
  const [settings, setSettings] = useState<PaymentSettings | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/payment-settings").then(r => r.json()).then(setSettings)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  function copyAddress(id: string, address: string) {
    navigator.clipboard.writeText(address)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--card-bg, #fff)", borderRadius: "16px",
          width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto",
          padding: "32px 28px", position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "#f1f5f9", border: "none", borderRadius: "50%",
          width: 32, height: 32, cursor: "pointer", fontSize: "18px",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b",
        }}>×</button>

        <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: 800, marginBottom: "20px" }}>
          Add Funds
        </h2>

        {!settings ? (
          <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading...</p>
        ) : (
          <>
            {/* Bonus banner */}
            {settings.bonusPercent > 0 && (
              <div style={{
                background: "#fefce8", border: "1px solid #fde047",
                borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
                textAlign: "center", fontSize: "14px", color: "#713f12",
              }}>
                Get <strong>{settings.bonusPercent}% bonus</strong> for <strong>{settings.bonusMethod}</strong> top-ups
              </div>
            )}

            {/* Payment methods */}
            <div style={{ marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Payment Methods
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {settings.methods.filter(m => m.address).map((method, i) => (
                <div key={method.id} style={{
                  border: "1px solid var(--border-color, #e2e8f0)",
                  borderRadius: "10px", padding: "14px 16px",
                  display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px",
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontSize: "14px" }}>
                      <strong>{i + 1}. {method.label}</strong> — pay to:
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#475569", wordBreak: "break-all", fontFamily: "monospace" }}>
                      {method.address}
                    </p>
                  </div>
                  <button
                    onClick={() => copyAddress(method.id, method.address)}
                    title="Copy address"
                    style={{
                      flexShrink: 0, width: 36, height: 36,
                      background: copied === method.id ? "#dcfce7" : "#f1f5f9",
                      border: "none", borderRadius: "8px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: copied === method.id ? "#16a34a" : "#64748b",
                      transition: "all 0.2s",
                    }}
                  >
                    {copied === method.id ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    )}
                  </button>
                </div>
              ))}
              {settings.methods.every(m => !m.address) && (
                <p style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center" }}>No payment methods configured yet.</p>
              )}
            </div>

            {/* Note */}
            {settings.note && (
              <div style={{
                background: "#f8fafc", border: "1px solid #e2e8f0",
                borderRadius: "10px", padding: "14px 16px", marginBottom: "14px",
                fontSize: "13px", color: "#334155", lineHeight: 1.6,
              }}>
                <strong>NOTE:</strong> {settings.note}
              </div>
            )}

            {/* Min top-up */}
            {settings.minimumTopUp > 0 && (
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "#f0f9ff", border: "1px solid #bae6fd",
                borderRadius: "10px", padding: "12px 16px",
                fontSize: "13px", color: "#0369a1",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Please note: the minimum top-up amount for any payment method is <strong>${settings.minimumTopUp}</strong>.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
