"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  updateEmailTemplateAction,
  sendCampaignAction,
  previewAudienceAction,
  searchUsersAction,
} from "@/app/lib/email-actions"
import { CAMPAIGN_AUDIENCES } from "@/models/campaign-audience"
import type { EmailTemplateType } from "@/models/email-template"

type Templates = Record<EmailTemplateType, { subject: string; body: string }>
type HistoryRow = {
  id: string
  audienceLabel: string
  subject: string
  sentCount: number
  sentBy: string
  createdAt: string
}

const BRAND_COLOR = "#00b4d8"

// ── Welcome template editor (compact — the only automatic email) ──
function WelcomeEditor({ initial }: { initial: { subject: string; body: string } }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [subject, setSubject] = useState(initial.subject)
  const [body, setBody] = useState(initial.body)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  const [open, setOpen] = useState(false)

  function handleSave() {
    setError("")
    const fd = new FormData()
    fd.append("type", "welcome")
    fd.append("subject", subject)
    fd.append("body", body)
    startTransition(async () => {
      const result = await updateEmailTemplateAction(fd)
      if (result.error) { setError(result.error); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      router.refresh()
    })
  }

  return (
    <div className="card" style={{ marginBottom: "20px" }}>
      <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setOpen(v => !v)}>
        <div>
          <h3>Welcome Email</h3>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>Sent automatically the moment a new account is created</p>
        </div>
        <span style={{ fontSize: "13px", color: "var(--brand-primary)", fontWeight: 600 }}>{open ? "Hide" : "Edit"}</span>
      </div>
      {open && (
        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Subject</label>
            <input type="text" className="form-input" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Body (HTML)</label>
            <textarea className="form-textarea" rows={6} value={body} onChange={e => setBody(e.target.value)} style={{ fontFamily: "monospace", fontSize: "13px" }} />
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
              Use <code>{"{{name}}"}</code> and <code>{"{{email}}"}</code> as placeholders.
            </p>
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: 500, margin: 0 }}>{error}</p>}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button type="button" className="btn btn-primary" disabled={pending} onClick={handleSave}>
              {pending ? "Saving…" : "Save Welcome Email"}
            </button>
            {saved && <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "14px" }}>✓ Saved</span>}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main campaign composer ──
function Composer({ announcementTemplate, logoUrl }: { announcementTemplate: { subject: string; body: string }; logoUrl?: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [previewPending, startPreviewTransition] = useTransition()

  const [audience, setAudience] = useState("all")
  const [specificUser, setSpecificUser] = useState<{ id: string; name: string; email: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; email: string }[]>([])
  const [searching, setSearching] = useState(false)
  const [manualEmails, setManualEmails] = useState("")

  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [ctaText, setCtaText] = useState("")
  const [ctaUrl, setCtaUrl] = useState("https://linkslandia.com")
  const [btnColor, setBtnColor] = useState(BRAND_COLOR)

  const [audienceCount, setAudienceCount] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [result, setResult] = useState("")
  const [templateSaved, setTemplateSaved] = useState(false)
  const [savingTemplate, startTemplateTransition] = useTransition()
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function loadAnnouncementTemplate() {
    setSubject(announcementTemplate.subject)
    setBody(announcementTemplate.body)
  }

  function saveAsAnnouncementTemplate() {
    if (!subject || !body) { setError("Write a subject and message first."); return }
    const fd = new FormData()
    fd.append("type", "announcement")
    fd.append("subject", subject)
    fd.append("body", body)
    startTemplateTransition(async () => {
      const res = await updateEmailTemplateAction(fd)
      if (res.error) { setError(res.error); return }
      setTemplateSaved(true)
      setTimeout(() => setTemplateSaved(false), 2500)
      router.refresh()
    })
  }

  function handleSearch(q: string) {
    setSearchQuery(q)
    setSpecificUser(null)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (q.trim().length < 2) { setSearchResults([]); return }
    setSearching(true)
    searchTimer.current = setTimeout(async () => {
      const results = await searchUsersAction(q)
      setSearchResults(results)
      setSearching(false)
    }, 300)
  }

  function handlePreviewAudience() {
    setAudienceCount(null)
    const fd = new FormData()
    fd.append("audience", audience)
    if (specificUser) fd.append("specificUserId", specificUser.id)
    fd.append("manualEmails", manualEmails)
    startPreviewTransition(async () => {
      const result = await previewAudienceAction(fd)
      setAudienceCount(result.count)
    })
  }

  function handleSend() {
    if (!subject || !body) { setError("Subject and message are required."); return }
    const chosen = CAMPAIGN_AUDIENCES.find(a => a.value === audience)
    if (!confirm(`Send to: ${chosen?.label}?\n\nSubject: ${subject}`)) return

    setError("")
    setResult("")
    const fd = new FormData()
    fd.append("audience", audience)
    if (specificUser) fd.append("specificUserId", specificUser.id)
    fd.append("manualEmails", manualEmails)
    fd.append("subject", subject)
    fd.append("body", body)
    fd.append("ctaText", ctaText)
    fd.append("ctaUrl", ctaUrl)
    fd.append("btnColor", btnColor)

    startTransition(async () => {
      const res = await sendCampaignAction(fd)
      if (res.error) { setError(res.error); return }
      setResult(`Sent to ${res.sent} of ${res.total} recipients.`)
      router.refresh()
    })
  }

  return (
    <div className="card" style={{ marginBottom: "20px" }}>
      <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3>Compose & Send</h3>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>Send a targeted email to any group of users, or a manual list of addresses</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button type="button" className="btn btn-secondary" onClick={loadAnnouncementTemplate} style={{ fontSize: "13px" }}>
            Load Announcement Template
          </button>
          <button type="button" className="btn btn-secondary" disabled={savingTemplate} onClick={saveAsAnnouncementTemplate} style={{ fontSize: "13px" }}>
            {savingTemplate ? "Saving…" : "Save as Template"}
          </button>
          {templateSaved && <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "13px" }}>✓ Saved</span>}
        </div>
      </div>

      <div className="card-body">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>

          {/* ── Left: form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label className="form-label" style={{ marginBottom: "8px", display: "block" }}>Audience</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {CAMPAIGN_AUDIENCES.map(a => (
                  <label key={a.value} onClick={() => { setAudience(a.value); setAudienceCount(null) }}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px",
                      border: `1.5px solid ${audience === a.value ? "var(--brand-primary)" : "var(--border-color, #e2e8f0)"}`,
                      background: audience === a.value ? "var(--brand-primary-bg, rgba(0,180,216,0.06))" : "transparent",
                      cursor: "pointer", transition: "all 0.15s",
                    }}>
                    <span style={{
                      width: "16px", height: "16px", borderRadius: "9999px", flexShrink: 0,
                      border: `2px solid ${audience === a.value ? "var(--brand-primary)" : "#cbd5e1"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {audience === a.value && <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "var(--brand-primary)" }} />}
                    </span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700 }}>{a.label}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{a.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {audience === "specific" && (
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Search User</label>
                <input type="text" className="form-input" placeholder="Type name or email…" value={searchQuery} onChange={e => handleSearch(e.target.value)} />
                {searching && <p style={{ margin: "6px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>Searching…</p>}
                {searchResults.length > 0 && !specificUser && (
                  <div style={{ border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", marginTop: "8px", overflow: "hidden" }}>
                    {searchResults.map(u => (
                      <div key={u.id} onClick={() => { setSpecificUser(u); setSearchResults([]); setSearchQuery(u.name || u.email) }}
                        style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
                        <div style={{ fontSize: "13px", fontWeight: 600 }}>{u.name || "No name"}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{u.email}</div>
                      </div>
                    ))}
                  </div>
                )}
                {specificUser && (
                  <div style={{ marginTop: "8px", padding: "10px 14px", background: "var(--brand-primary-bg, rgba(0,180,216,0.06))", border: "1.5px solid var(--brand-primary)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700 }}>{specificUser.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{specificUser.email}</div>
                    </div>
                    <button type="button" onClick={() => { setSpecificUser(null); setSearchQuery("") }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "16px" }}>✕</button>
                  </div>
                )}
              </div>
            )}

            {audience === "manual" && (
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Email Addresses</label>
                <textarea className="form-textarea" rows={3} value={manualEmails} onChange={e => setManualEmails(e.target.value)}
                  placeholder={"one@example.com, two@example.com\nor one per line"} />
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>Up to 100 addresses, comma or newline separated.</p>
              </div>
            )}

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Subject</label>
              <input type="text" className="form-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Check out this new website" />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Message</label>
              <textarea className="form-textarea" rows={6} value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message here…" />
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
                Use <code>{"{{name}}"}</code> for the recipient&apos;s name.
              </p>
            </div>

            <div className="form-grid">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Button Text (optional)</label>
                <input type="text" className="form-input" value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="View Website" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Button URL</label>
                <input type="text" className="form-input" value={ctaUrl} onChange={e => setCtaUrl(e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Button Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="color" value={btnColor} onChange={e => setBtnColor(e.target.value)} style={{ width: "40px", height: "40px", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", cursor: "pointer", padding: "2px" }} />
                <input type="text" className="form-input" value={btnColor} onChange={e => setBtnColor(e.target.value)} style={{ maxWidth: "120px" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="btn btn-secondary" disabled={previewPending} onClick={handlePreviewAudience} style={{ flex: 1 }}>
                {previewPending ? "Checking…" : "Preview Audience"}
              </button>
              <button type="button" className="btn btn-primary" disabled={pending || !subject || !body} onClick={handleSend} style={{ flex: 1 }}>
                {pending ? "Sending…" : "Send Campaign"}
              </button>
            </div>

            {audienceCount !== null && (
              <div style={{ padding: "10px 14px", borderRadius: "10px", textAlign: "center", background: audienceCount > 0 ? "var(--brand-primary-bg, rgba(0,180,216,0.06))" : "var(--bg-hover, #f8fafc)", border: `1px solid ${audienceCount > 0 ? "var(--brand-primary)" : "var(--border-color, #e2e8f0)"}` }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: audienceCount > 0 ? "var(--brand-primary)" : "var(--text-secondary)" }}>
                  {audienceCount > 0 ? `${audienceCount} recipient${audienceCount === 1 ? "" : "s"} will receive this email` : "No users match this audience"}
                </span>
              </div>
            )}
            {result && <p style={{ margin: 0, fontSize: "13px", color: "#22c55e", fontWeight: 600, textAlign: "center" }}>✓ {result}</p>}
            {error && <p style={{ margin: 0, fontSize: "13px", color: "#ef4444", fontWeight: 600, textAlign: "center" }}>{error}</p>}
          </div>

          {/* ── Right: live preview ── */}
          <div style={{ position: "sticky", top: "20px" }}>
            <label className="form-label" style={{ marginBottom: "8px", display: "block" }}>Email Preview</label>
            <div style={{ background: "var(--brand-primary-bg, #f0f9fb)", padding: "16px", borderRadius: "16px" }}>
              <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,180,216,0.08)" }}>
                <div style={{ textAlign: "center", borderBottom: "1px solid #eef2f7", padding: "22px 24px" }}>
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt="Linkslandia" style={{ height: "48px", width: "auto", display: "inline-block" }} />
                  ) : (
                    <span style={{ color: "#1a365d", fontSize: "20px", fontWeight: 700 }}>Linkslandia</span>
                  )}
                </div>
                <div style={{ padding: "22px 24px" }}>
                  <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#475569" }}>Hi [Name],</p>
                  <p style={{ margin: 0, fontSize: "13px", color: body ? "#475569" : "#cbd5e1", whiteSpace: "pre-wrap", minHeight: "60px" }}>
                    {body || "Your message will appear here…"}
                  </p>
                  {ctaText && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <span style={{ display: "inline-block", background: btnColor, color: "#fff", padding: "10px 22px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700 }}>
                        {ctaText}
                      </span>
                    </div>
                  )}
                </div>
                <p style={{ margin: 0, padding: "16px 24px", background: "#f8fafc", fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>
                  © {new Date().getFullYear()} Linkslandia. All rights reserved.
                </p>
              </div>
            </div>
            <div style={{ marginTop: "12px", padding: "12px 16px", background: "var(--bg-hover, #f8fafc)", borderRadius: "10px", border: "1px solid var(--border-color, #e2e8f0)" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>SUBJECT LINE</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: subject ? "inherit" : "var(--text-secondary)" }}>{subject || "Your subject line…"}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function CampaignHistory({ history }: { history: HistoryRow[] }) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="card-header"><h3>Campaign History</h3></div>
      {history.length === 0 ? (
        <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>No campaigns sent yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Audience</th><th>Subject</th><th>Sent</th><th>By</th></tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h.id}>
                <td style={{ whiteSpace: "nowrap", fontSize: "13px", color: "var(--text-secondary)" }}>
                  {new Date(h.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td><span className="status-badge">{h.audienceLabel}</span></td>
                <td style={{ maxWidth: "280px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.subject}</td>
                <td style={{ fontWeight: 700, color: "var(--brand-primary)" }}>{h.sentCount}</td>
                <td style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{h.sentBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default function EmailsForm({ templates, history, logoUrl }: { templates: Templates; history: HistoryRow[]; logoUrl?: string }) {
  return (
    <div className="section-content active">
      <div className="section-header">
        <h1 className="section-title">Emails</h1>
        <p className="section-subtitle">Automatic emails, targeted campaigns, and send history</p>
      </div>

      <WelcomeEditor initial={templates.welcome} />
      <Composer announcementTemplate={templates.announcement} logoUrl={logoUrl} />
      <CampaignHistory history={history} />
    </div>
  )
}
