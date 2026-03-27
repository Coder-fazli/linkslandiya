"use client"

import { useState } from "react"
import type { Order } from "@/app/lib/orders"
import type { Website } from "@/app/lib/types"
import { formatTraffic } from "@/app/lib/types"

type SafeUser = {
  _id: string
  name: string
  email: string
  balance: number
  isAdmin: boolean
  canPublish: boolean
  canBuy: boolean
  activeMode: string
  createdAt: string
  country?: string
  phone?: string
  companyWebsite?: string
}

type Props = {
  user: SafeUser
  buyerOrders: Order[]
  publisherOrders: Order[]
  websites: Website[]
}

export default function UserDetailClient({ user, buyerOrders, publisherOrders, websites }: Props) {
  const [balance, setBalance] = useState(user.balance)
  const [adjustAmount, setAdjustAmount] = useState("")
  const [adjustNote, setAdjustNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"buyer" | "publisher" | "websites">("buyer")

  async function handleAdjust(type: "add" | "deduct") {
    const amount = parseFloat(adjustAmount)
    if (isNaN(amount) || amount <= 0) { alert("Enter a valid amount"); return }
    const delta = type === "add" ? amount : -amount
    setSaving(true)
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, amount: delta }),
    })
    if (res.ok) {
      setBalance(prev => Math.max(0, prev + delta))
      setAdjustAmount("")
      setAdjustNote("")
    } else {
      alert("Failed to update balance")
    }
    setSaving(false)
  }

  const roleBadge = user.isAdmin
    ? { label: "Admin", bg: "#7c3aed", color: "#fff" }
    : user.canPublish
    ? { label: "Publisher", bg: "#dcfce7", color: "#15803d" }
    : { label: "Buyer", bg: "#e0f2fe", color: "#0369a1" }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Profile card */}
      <div className="card">
        <div className="card-body">
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: "var(--brand-primary)",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "26px", fontWeight: 700, flexShrink: 0,
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "6px" }}>
                <h2 style={{ margin: 0, fontSize: "20px" }}>{user.name}</h2>
                <span style={{ padding: "3px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, background: roleBadge.bg, color: roleBadge.color }}>
                  {roleBadge.label}
                </span>
              </div>
              <p style={{ margin: "0 0 8px", color: "var(--text-secondary)", fontSize: "14px" }}>{user.email}</p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "var(--text-secondary)" }}>
                <span>Joined: <strong>{user.createdAt}</strong></span>
                <span>Mode: <strong>{user.activeMode}</strong></span>
                {user.country && <span>Country: <strong>{user.country}</strong></span>}
                {user.phone && <span>Phone: <strong>{user.phone}</strong></span>}
                {user.companyWebsite && <span>Website: <strong>{user.companyWebsite}</strong></span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance control */}
      <div className="card">
        <div className="card-header"><h3>Balance Management</h3></div>
        <div className="card-body">
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--brand-primary)" }}>${balance.toFixed(2)}</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Current Balance</div>
            </div>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  type="text" className="form-input" style={{ flex: 1 }}
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="Amount (e.g. 50)"
                />
                <button className="btn btn-primary" onClick={() => handleAdjust("add")} disabled={saving}
                  style={{ whiteSpace: "nowrap", background: "#22c55e", borderColor: "#22c55e" }}>
                  + Add
                </button>
                <button className="btn btn-secondary" onClick={() => handleAdjust("deduct")} disabled={saving}
                  style={{ whiteSpace: "nowrap", color: "#ef4444", borderColor: "#fecaca" }}>
                  − Deduct
                </button>
              </div>
              <input type="text" className="form-input" value={adjustNote}
                onChange={e => setAdjustNote(e.target.value)}
                placeholder="Optional note (internal)" />
            </div>
          </div>
          <div style={{ display: "flex", gap: "24px", fontSize: "13px", color: "var(--text-secondary)" }}>
            <span>Total spent (as buyer): <strong>${buyerOrders.reduce((s, o) => s + (o.amount || 0), 0).toFixed(2)}</strong></span>
            <span>Total earned (as publisher): <strong>${publisherOrders.reduce((s, o) => s + (o.amount || 0), 0).toFixed(2)}</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs: orders + websites */}
      <div className="card">
        <div className="card-body" style={{ padding: "8px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {([
              { key: "buyer", label: `Buyer Orders (${buyerOrders.length})` },
              { key: "publisher", label: `Publisher Orders (${publisherOrders.length})` },
              { key: "websites", label: `Websites (${websites.length})` },
            ] as const).map(tab => (
              <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} style={{
                flex: 1, padding: "10px 12px", borderRadius: "8px", border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: "13px", transition: "all 0.2s",
                background: activeTab === tab.key ? "var(--brand-primary)" : "#f8fafc",
                color: activeTab === tab.key ? "#fff" : "#64748b",
              }}>{tab.label}</button>
            ))}
          </div>
        </div>

        {/* Buyer orders */}
        {activeTab === "buyer" && (
          <table className="table">
            <thead><tr><th>Website</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {buyerOrders.length === 0
                ? <tr><td colSpan={5} style={{ textAlign: "center", color: "#94a3b8" }}>No orders yet</td></tr>
                : buyerOrders.map(o => (
                  <tr key={o._id?.toString()}>
                    <td>{o.websiteName}</td>
                    <td><span className="status-badge">{o.orderType ?? "guest_post"}</span></td>
                    <td>${o.amount}</td>
                    <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                    <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* Publisher orders */}
        {activeTab === "publisher" && (
          <table className="table">
            <thead><tr><th>Website</th><th>Type</th><th>Earned</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {publisherOrders.length === 0
                ? <tr><td colSpan={5} style={{ textAlign: "center", color: "#94a3b8" }}>No orders yet</td></tr>
                : publisherOrders.map(o => (
                  <tr key={o._id?.toString()}>
                    <td>{o.websiteName}</td>
                    <td><span className="status-badge">{o.orderType ?? "guest_post"}</span></td>
                    <td style={{ color: "#22c55e", fontWeight: 700 }}>+${o.amount}</td>
                    <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                    <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* Websites */}
        {activeTab === "websites" && (
          <table className="table">
            <thead><tr><th>Website</th><th>DA</th><th>DR</th><th>Traffic</th><th>Price</th><th>Status</th></tr></thead>
            <tbody>
              {websites.length === 0
                ? <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>No websites yet</td></tr>
                : websites.map(w => (
                  <tr key={w._id}>
                    <td style={{ fontWeight: 600 }}>{w.url}</td>
                    <td>{w.da}</td>
                    <td>{w.dr}</td>
                    <td>{formatTraffic(w.traffic)}</td>
                    <td>${w.price}</td>
                    <td><span className={`status-badge ${w.status}`}>{w.status}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}
