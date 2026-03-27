"use client"

import { useEffect, useState } from "react"
import type { PaymentSettings, PaymentMethod } from "@/app/lib/payment-settings"

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/payment-settings").then(r => r.json()).then(setSettings)
  }, [])

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    await fetch("/api/payment-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function updateMethod(index: number, field: keyof PaymentMethod, value: string) {
    if (!settings) return
    const methods = [...settings.methods]
    methods[index] = { ...methods[index], [field]: value }
    setSettings({ ...settings, methods })
  }

  function addMethod() {
    if (!settings) return
    setSettings({
      ...settings,
      methods: [...settings.methods, { id: Date.now().toString(), label: "", address: "" }],
    })
  }

  function removeMethod(index: number) {
    if (!settings) return
    setSettings({ ...settings, methods: settings.methods.filter((_, i) => i !== index) })
  }

  if (!settings) return <div className="section-content active"><p>Loading...</p></div>

  return (
    <div className="section-content active">
      <div className="section-header">
        <h1 className="section-title">Payment Settings</h1>
        <p className="section-subtitle">Configure the Add Funds popup shown to users</p>
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-header"><h3>Bonus Banner</h3></div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Bonus % (0 = hide banner)</label>
              <input type="text" className="form-input" value={settings.bonusPercent}
                onChange={e => setSettings({ ...settings, bonusPercent: Number(e.target.value) })}
                placeholder="e.g., 3" />
            </div>
            <div className="form-group">
              <label className="form-label">Bonus Method Name</label>
              <input type="text" className="form-input" value={settings.bonusMethod}
                onChange={e => setSettings({ ...settings, bonusMethod: e.target.value })}
                placeholder="e.g., Bank Wire Transfer" />
            </div>
            <div className="form-group">
              <label className="form-label">Minimum Top-Up ($)</label>
              <input type="text" className="form-input" value={settings.minimumTopUp}
                onChange={e => setSettings({ ...settings, minimumTopUp: Number(e.target.value) })}
                placeholder="e.g., 25" />
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Payment Methods</h3>
          <button className="btn btn-secondary" onClick={addMethod} style={{ fontSize: "13px" }}>+ Add Method</button>
        </div>
        <div className="card-body">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {settings.methods.map((method, i) => (
              <div key={method.id} style={{
                border: "1px solid var(--border-color)", borderRadius: "10px", padding: "16px",
                display: "flex", gap: "12px", alignItems: "flex-start",
              }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Label</label>
                    <input type="text" className="form-input" value={method.label}
                      onChange={e => updateMethod(i, "label", e.target.value)}
                      placeholder="e.g., USDT (Tether) via Tron Network (TRC20)" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Wallet Address</label>
                    <input type="text" className="form-input" value={method.address}
                      onChange={e => updateMethod(i, "address", e.target.value)}
                      placeholder="Paste wallet address..." style={{ fontFamily: "monospace" }} />
                  </div>
                </div>
                <button onClick={() => removeMethod(i)} style={{
                  background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px",
                  color: "#ef4444", cursor: "pointer", padding: "6px 10px", fontSize: "18px", lineHeight: 1,
                }}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-header"><h3>Note / Instructions</h3></div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Note shown to users after payment addresses</label>
            <textarea className="form-textarea" rows={5} value={settings.note}
              onChange={e => setSettings({ ...settings, note: e.target.value })}
              placeholder="Instructions for users after making a payment..." />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {saved && <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "14px" }}>✓ Saved successfully</span>}
      </div>
    </div>
  )
}
