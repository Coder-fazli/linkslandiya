"use client"

import { useState, useTransition } from "react"
import { createPackageAction, updatePackageAction } from "@/app/lib/packages-actions"
import type { Package } from "@/models/package"

type Props = {
  mode: "create" | "edit"
  packageId?: string
  initial?: Package
}

export default function PackageForm({ mode, packageId, initial }: Props) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState("")

  const [name, setName] = useState(initial?.name ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : "")
  const [buttonText, setButtonText] = useState(initial?.buttonText ?? "Get Started")
  const [popular, setPopular] = useState(initial?.popular ?? false)
  const [active, setActive] = useState(initial?.active ?? true)
  const [order, setOrder] = useState(initial?.order != null ? String(initial.order) : "0")
  const [features, setFeatures] = useState((initial?.features ?? []).join("\n"))
  const [includesTitle, setIncludesTitle] = useState(initial?.includes?.[0] ?? "What's included:")
  const [includes, setIncludes] = useState((initial?.includes ?? []).slice(1).join("\n"))

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = mode === "create"
        ? await createPackageAction(fd)
        : await updatePackageAction(packageId!, fd)
      if (result?.error) setError(result.error)
      // On success the action redirects — nothing else to do here
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: "720px" }}>
      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

        <div className="form-grid">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Name <span style={{ color: "#ef4444" }}>*</span></label>
            <input name="name" type="text" className="form-input" value={name}
              onChange={e => setName(e.target.value)} required placeholder="e.g., Growth" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Price ($) <span style={{ color: "#ef4444" }}>*</span></label>
            <input name="price" type="number" min={0} step="1" className="form-input" value={price}
              onChange={e => setPrice(e.target.value)} required placeholder="e.g., 799" />
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Description</label>
          <textarea name="description" className="form-textarea" rows={2} value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="One line shown under the plan name" />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Highlights (one per line, shown at the top of the card)</label>
          <textarea name="features" className="form-textarea" rows={3} value={features}
            onChange={e => setFeatures(e.target.value)}
            placeholder={"15 guest posts / month\nDA 30-60 websites\nPriority publisher matching"} />
        </div>

        <div className="form-grid">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Checklist title</label>
            <input name="includesTitle" type="text" className="form-input" value={includesTitle}
              onChange={e => setIncludesTitle(e.target.value)} placeholder="What's included:" />
          </div>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Checklist items (one per line)</label>
          <textarea name="includes" className="form-textarea" rows={4} value={includes}
            onChange={e => setIncludes(e.target.value)}
            placeholder={"Dedicated account manager\nContent written for you\nMonthly strategy call"} />
        </div>

        <div className="form-grid">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Button text</label>
            <input name="buttonText" type="text" className="form-input" value={buttonText}
              onChange={e => setButtonText(e.target.value)} placeholder="Get Started" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Display order (lower shows first)</label>
            <input name="order" type="number" className="form-input" value={order}
              onChange={e => setOrder(e.target.value)} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
            <input type="checkbox" name="popular" checked={popular} onChange={e => setPopular(e.target.checked)} />
            Mark as &quot;Popular&quot;
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
            <input type="checkbox" name="active" checked={active} onChange={e => setActive(e.target.checked)} />
            Visible on the public page
          </label>
        </div>

        {error && <p style={{ margin: 0, color: "#ef4444", fontSize: "13px", fontWeight: 500 }}>{error}</p>}

        <div>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Saving…" : mode === "create" ? "Create Package" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  )
}
