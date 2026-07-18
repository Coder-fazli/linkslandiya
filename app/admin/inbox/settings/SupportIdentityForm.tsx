"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  uploadSupportAvatarAction,
  deleteSupportAvatarAction,
  updateSupportNameAction,
} from "@/app/lib/settings-actions"
import { DEFAULT_SUPPORT_NAME } from "@/models/site-settings"

type Props = {
  supportName?: string
  supportAvatarUrl?: string
}

export default function SupportIdentityForm({ supportName, supportAvatarUrl }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")
  const [name, setName] = useState(supportName || DEFAULT_SUPPORT_NAME)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  function run(action: () => Promise<{ error?: string } | { ok?: boolean; url?: string }>, successMsg: string) {
    setError("")
    setSaved("")
    startTransition(async () => {
      const result = await action()
      if (result && "error" in result && result.error) {
        setError(result.error)
        return
      }
      setSaved(successMsg)
      setTimeout(() => setSaved(""), 2500)
      router.refresh()
    })
  }

  function handleAvatarChange() {
    const file = avatarInputRef.current?.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    run(() => uploadSupportAvatarAction(fd), "Avatar updated")
    if (avatarInputRef.current) avatarInputRef.current.value = ""
  }

  function handleSaveName() {
    const fd = new FormData()
    fd.append("supportName", name)
    run(() => updateSupportNameAction(fd), "Name saved")
  }

  return (
    <div className="card" style={{ maxWidth: "520px" }}>
      <div className="card-header"><h3>Support Identity</h3></div>
      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div className="inbox-avatar" style={{ width: "64px", height: "64px", fontSize: "22px", overflow: "hidden" }}>
            {supportAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={supportAvatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" className="btn btn-secondary" disabled={pending} onClick={() => avatarInputRef.current?.click()}>
                {supportAvatarUrl ? "Replace Avatar" : "Upload Avatar"}
              </button>
              {supportAvatarUrl && (
                <button type="button" className="btn btn-secondary" disabled={pending} onClick={() => run(deleteSupportAvatarAction, "Avatar removed")}>
                  Remove
                </button>
              )}
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary, #64748b)", margin: 0 }}>
              Shown next to every message from Administration. Square image recommended.
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Display name</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text" className="form-input" value={name}
              onChange={e => setName(e.target.value)}
              maxLength={60}
              placeholder={DEFAULT_SUPPORT_NAME}
            />
            <button type="button" className="btn btn-primary" disabled={pending || !name.trim()} onClick={handleSaveName}>
              Save
            </button>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary, #64748b)", marginTop: "6px" }}>
            This is the name users see instead of &quot;{DEFAULT_SUPPORT_NAME}&quot; in their inbox.
          </p>
        </div>

        <div style={{ minHeight: "20px" }}>
          {saved && <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "14px" }}>✓ {saved}</span>}
          {error && <span style={{ color: "#ef4444", fontWeight: 600, fontSize: "14px" }}>{error}</span>}
        </div>
      </div>
    </div>
  )
}
