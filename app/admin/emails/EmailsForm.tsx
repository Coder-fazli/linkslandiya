"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateEmailTemplateAction, sendManualEmailAction } from "@/app/lib/email-actions"
import type { EmailTemplateType } from "@/models/email-template"

type Props = {
  templates: Record<EmailTemplateType, { subject: string; body: string }>
}

const TEMPLATE_LABELS: Record<EmailTemplateType, { title: string; desc: string }> = {
  welcome: { title: "Welcome Email", desc: "Sent automatically the moment a new account is created" },
  announcement: { title: "Announcement Template", desc: "The starting point for manually sent emails below" },
}

function TemplateEditor({ type, initial, onSaved }: {
  type: EmailTemplateType
  initial: { subject: string; body: string }
  onSaved: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [subject, setSubject] = useState(initial.subject)
  const [body, setBody] = useState(initial.body)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setError("")
    const fd = new FormData()
    fd.append("type", type)
    fd.append("subject", subject)
    fd.append("body", body)
    startTransition(async () => {
      const result = await updateEmailTemplateAction(fd)
      if (result.error) { setError(result.error); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      onSaved()
    })
  }

  return (
    <div className="card" style={{ marginBottom: "20px" }}>
      <div className="card-header">
        <h3>{TEMPLATE_LABELS[type].title}</h3>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>{TEMPLATE_LABELS[type].desc}</p>
      </div>
      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Subject</label>
          <input type="text" className="form-input" value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Body (HTML)</label>
          <textarea className="form-textarea" rows={8} value={body} onChange={e => setBody(e.target.value)} style={{ fontFamily: "monospace", fontSize: "13px" }} />
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
            Use <code>{"{{name}}"}</code> and <code>{"{{email}}"}</code> as placeholders.
          </p>
        </div>
        {error && <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: 500, margin: 0 }}>{error}</p>}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button type="button" className="btn btn-primary" disabled={pending} onClick={handleSave}>
            {pending ? "Saving…" : "Save Template"}
          </button>
          {saved && <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "14px" }}>✓ Saved</span>}
        </div>
      </div>
    </div>
  )
}

function ManualSend({ announcementTemplate }: { announcementTemplate: { subject: string; body: string } }) {
  const [pending, startTransition] = useTransition()
  const [recipients, setRecipients] = useState("")
  const [subject, setSubject] = useState(announcementTemplate.subject)
  const [body, setBody] = useState(announcementTemplate.body)
  const [error, setError] = useState("")
  const [sent, setSent] = useState("")

  function handleSend() {
    setError("")
    setSent("")
    const fd = new FormData()
    fd.append("recipients", recipients)
    fd.append("subject", subject)
    fd.append("body", body)
    startTransition(async () => {
      const result = await sendManualEmailAction(fd)
      if (result.error) { setError(result.error); return }
      setSent(`Sent to ${result.count} recipient${result.count === 1 ? "" : "s"}.`)
      setRecipients("")
    })
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>Send Email</h3>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
          Send to any email address — pre-filled from the Announcement template, editable per send.
        </p>
      </div>
      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Recipients</label>
          <textarea className="form-textarea" rows={3} value={recipients} onChange={e => setRecipients(e.target.value)}
            placeholder={"one@example.com, two@example.com\nor one per line"} />
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
            Comma or newline separated. Up to 100 addresses per send.
          </p>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Subject</label>
          <input type="text" className="form-input" value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Message (HTML)</label>
          <textarea className="form-textarea" rows={8} value={body} onChange={e => setBody(e.target.value)} style={{ fontFamily: "monospace", fontSize: "13px" }} />
        </div>
        {error && <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: 500, margin: 0 }}>{error}</p>}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button type="button" className="btn btn-primary" disabled={pending || !recipients.trim()} onClick={handleSend}>
            {pending ? "Sending…" : "Send Email"}
          </button>
          {sent && <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "14px" }}>✓ {sent}</span>}
        </div>
      </div>
    </div>
  )
}

export default function EmailsForm({ templates }: Props) {
  const router = useRouter()

  return (
    <div className="section-content active">
      <div className="section-header">
        <h1 className="section-title">Emails</h1>
        <p className="section-subtitle">Manage automatic email templates and send emails manually</p>
      </div>

      <TemplateEditor type="welcome" initial={templates.welcome} onSaved={() => router.refresh()} />
      <TemplateEditor type="announcement" initial={templates.announcement} onSaved={() => router.refresh()} />

      <ManualSend announcementTemplate={templates.announcement} />
    </div>
  )
}
