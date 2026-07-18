"use client"

import { useState, useTransition } from "react"
import type { Order } from "@/app/lib/orders"
import type { Website } from "@/app/lib/types"
import type { Project } from "@/app/lib/projects"
import { formatTraffic } from "@/app/lib/types"
import { setGrayTopicAccessAction } from "@/app/lib/actions"

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
  grayTopicAccess: boolean
}

type Props = {
  user: SafeUser
  buyerOrders: Order[]
  publisherOrders: Order[]
  websites: Website[]
  projects: Project[]
}

export default function UserDetailClient({ user, buyerOrders, publisherOrders, websites, projects }: Props) {
  const [balance, setBalance] = useState(user.balance)
  const [adjustAmount, setAdjustAmount] = useState("")
  const [adjustNote, setAdjustNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"buyer" | "publisher" | "websites" | "projects">("buyer")
  const [grayTopicAccess, setGrayTopicAccess] = useState(user.grayTopicAccess)
  const [grayTopicPending, startGrayTopicTransition] = useTransition()

  function toggleGrayTopicAccess() {
    const next = !grayTopicAccess
    setGrayTopicAccess(next)
    startGrayTopicTransition(() => setGrayTopicAccessAction(user._id, next))
  }

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

      {/* Profile + Balance side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Profile card */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-body">
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", background: "var(--brand-primary)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px", fontWeight: 700, flexShrink: 0,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                  <h2 style={{ margin: 0, fontSize: "18px" }}>{user.name}</h2>
                  <span style={{ padding: "2px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, background: roleBadge.bg, color: roleBadge.color }}>
                    {roleBadge.label}
                  </span>
                </div>
                <p style={{ margin: "0 0 8px", color: "var(--text-secondary)", fontSize: "13px" }}>{user.email}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "12px", color: "var(--text-secondary)" }}>
                  <span>Joined: <strong>{user.createdAt}</strong></span>
                  <span>Mode: <strong>{user.activeMode}</strong></span>
                  {user.country && <span>Country: <strong>{user.country}</strong></span>}
                  {user.phone && <span>Phone: <strong>{user.phone}</strong></span>}
                  {user.companyWebsite && <span>Website: <strong>{user.companyWebsite}</strong></span>}
                </div>
              </div>
            </div>

            {/* Gray-topic (casino) access — hidden from every buyer until an
                admin enables it here, after a private conversation */}
            <div style={{
              marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-color, #e2e8f0)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>Gray Topic Access</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Lets this buyer see and order gray-topic (casino) listings
                </div>
              </div>
              <button
                type="button"
                onClick={toggleGrayTopicAccess}
                disabled={grayTopicPending}
                title={grayTopicAccess ? "Click to disable" : "Click to enable"}
                style={{
                  position: "relative", width: 42, height: 24, borderRadius: 9999, border: "none",
                  cursor: grayTopicPending ? "wait" : "pointer", flexShrink: 0,
                  background: grayTopicAccess ? "var(--brand-primary)" : "#cbd5e1",
                  transition: "background 0.2s", opacity: grayTopicPending ? 0.7 : 1,
                }}
              >
                <span style={{
                  position: "absolute", top: 3, left: grayTopicAccess ? 21 : 3,
                  width: 18, height: 18, borderRadius: "50%", background: "#fff",
                  transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Balance control */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header"><h3>Balance Management</h3></div>
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--brand-primary)" }}>${balance.toFixed(2)}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>Balance</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                  <input
                    type="text" className="form-input" style={{ flex: 1, minWidth: 0 }}
                    value={adjustAmount}
                    onChange={e => setAdjustAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="Amount"
                  />
                  <button className="btn btn-primary" onClick={() => handleAdjust("add")} disabled={saving}
                    style={{ whiteSpace: "nowrap", background: "#22c55e", borderColor: "#22c55e", padding: "0 12px" }}>
                    + Add
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleAdjust("deduct")} disabled={saving}
                    style={{ whiteSpace: "nowrap", color: "#ef4444", borderColor: "#fecaca", padding: "0 12px" }}>
                    − Deduct
                  </button>
                </div>
                <input type="text" className="form-input" value={adjustNote}
                  onChange={e => setAdjustNote(e.target.value)}
                  placeholder="Optional note (internal)" />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1, background: "#fef2f2", borderRadius: "8px", padding: "8px 12px" }}>
                <div style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>Total Spent</div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#dc2626" }}>${buyerOrders.reduce((s, o) => s + (o.amount || 0), 0).toFixed(2)}</div>
              </div>
              <div style={{ flex: 1, background: "#f0fdf4", borderRadius: "8px", padding: "8px 12px" }}>
                <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>Total Earned</div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#16a34a" }}>${publisherOrders.reduce((s, o) => s + (o.amount || 0), 0).toFixed(2)}</div>
              </div>
            </div>
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
              { key: "projects", label: `Projects (${projects.length})` },
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

        {/* Projects */}
        {activeTab === "projects" && (
          <table className="table">
            <thead><tr><th>Name</th><th>Target Domain</th><th>Category</th><th>Note</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>
              {projects.length === 0
                ? <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>No projects yet</td></tr>
                : projects.map(p => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.targetDomain}</td>
                    <td>{p.category || "—"}</td>
                    <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.note || "—"}</td>
                    <td><span className={`status-badge ${p.archived ? "" : "active"}`}>{p.archived ? "Archived" : "Active"}</span></td>
                    <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}
