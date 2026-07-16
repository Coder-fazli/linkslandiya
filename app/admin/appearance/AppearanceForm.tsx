"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  uploadLogoAction,
  deleteLogoAction,
  updateLogoSizeAction,
  uploadFaviconAction,
  deleteFaviconAction,
} from "@/app/lib/settings-actions"
import { LOGO_MIN_SIZE, LOGO_MAX_SIZE } from "@/models/site-settings"

type Props = {
  logoUrl?: string
  faviconUrl?: string
  logoWidth?: number
  logoHeight?: number
}

export default function AppearanceForm({ logoUrl, faviconUrl, logoWidth, logoHeight }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")

  const [width, setWidth] = useState(logoWidth ? String(logoWidth) : "")
  const [height, setHeight] = useState(logoHeight ? String(logoHeight) : "")

  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

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

  function handleFile(input: HTMLInputElement | null, action: (fd: FormData) => Promise<{ error?: string; url?: string }>, successMsg: string) {
    const file = input?.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    run(() => action(fd), successMsg)
    if (input) input.value = ""
  }

  function handleSaveSize() {
    const fd = new FormData()
    fd.append("logoWidth", width)
    fd.append("logoHeight", height)
    run(() => updateLogoSizeAction(fd), "Logo size saved")
  }

  const previewStyle = {
    width: width ? `${width}px` : "auto",
    height: height ? `${height}px` : "auto",
    maxWidth: "100%",
    maxHeight: height ? undefined : 80,
    objectFit: "contain" as const,
  }

  return (
    <div className="section-content active">
      <div className="section-header">
        <h1 className="section-title">Appearance</h1>
        <p className="section-subtitle">Upload your site logo and favicon — shown across the whole site</p>
      </div>

      {/* ── Logo ─────────────────────────────────── */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-header"><h3>Site Logo</h3></div>
        <div className="card-body">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              border: "1px dashed var(--border-color)", borderRadius: "10px",
              padding: "24px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100px",
            }}>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Site logo" style={previewStyle} />
              ) : (
                <span style={{ color: "var(--text-secondary, #64748b)", fontSize: "14px" }}>
                  No logo uploaded — the default text logo is shown
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                style={{ display: "none" }}
                onChange={() => handleFile(logoInputRef.current, uploadLogoAction, "Logo uploaded")}
              />
              <button className="btn btn-primary" disabled={pending} onClick={() => logoInputRef.current?.click()}>
                {logoUrl ? "Replace Logo" : "Upload Logo"}
              </button>
              {logoUrl && (
                <button className="btn btn-secondary" disabled={pending} onClick={() => run(deleteLogoAction, "Logo removed")}>
                  Remove
                </button>
              )}
            </div>

            {/* Custom logo size — like the WordPress customizer */}
            <div>
              <div className="form-label" style={{ marginBottom: "8px" }}>Logo Size (px)</div>
              <div className="form-grid" style={{ alignItems: "end" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Width (empty = auto)</label>
                  <input type="number" className="form-input" value={width}
                    min={LOGO_MIN_SIZE} max={LOGO_MAX_SIZE}
                    onChange={e => setWidth(e.target.value)} placeholder="e.g., 140" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Height (empty = auto)</label>
                  <input type="number" className="form-input" value={height}
                    min={LOGO_MIN_SIZE} max={LOGO_MAX_SIZE}
                    onChange={e => setHeight(e.target.value)} placeholder="auto" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <button className="btn btn-secondary" disabled={pending} onClick={handleSaveSize}>
                    Save Size
                  </button>
                </div>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary, #64748b)", marginTop: "8px" }}>
                Allowed range: {LOGO_MIN_SIZE}–{LOGO_MAX_SIZE}px. Leave a field empty to keep the aspect ratio automatic.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Favicon ──────────────────────────────── */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-header"><h3>Favicon</h3></div>
        <div className="card-body">
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{
              border: "1px dashed var(--border-color)", borderRadius: "10px",
              width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {faviconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={faviconUrl} alt="Favicon" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
              ) : (
                <span style={{ color: "var(--text-secondary, #64748b)", fontSize: "11px" }}>None</span>
              )}
            </div>

            <input
              ref={faviconInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon,image/vnd.microsoft.icon,.ico"
              style={{ display: "none" }}
              onChange={() => handleFile(faviconInputRef.current, uploadFaviconAction, "Favicon uploaded")}
            />
            <button className="btn btn-primary" disabled={pending} onClick={() => faviconInputRef.current?.click()}>
              {faviconUrl ? "Replace Favicon" : "Upload Favicon"}
            </button>
            {faviconUrl && (
              <button className="btn btn-secondary" disabled={pending} onClick={() => run(deleteFaviconAction, "Favicon removed")}>
                Remove
              </button>
            )}
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary, #64748b)", marginTop: "12px" }}>
            Recommended: square PNG or ICO, at least 32×32px.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", minHeight: "24px" }}>
        {pending && <span style={{ color: "var(--text-secondary, #64748b)", fontSize: "14px" }}>Working…</span>}
        {saved && <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "14px" }}>✓ {saved}</span>}
        {error && <span style={{ color: "#ef4444", fontWeight: 600, fontSize: "14px" }}>{error}</span>}
      </div>
    </div>
  )
}
