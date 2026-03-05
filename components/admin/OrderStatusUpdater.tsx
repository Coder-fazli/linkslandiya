"use client"

import { useState } from "react"
import { updateStatus } from "@/app/lib/actions"
import { savePublishedLink } from "@/app/lib/actions"

type Props = {
    orderId: string
    currentStatus: string
    currentLink?: string
    websiteName: string
}

export default function OrderStatusUpdated({ orderId, currentStatus, currentLink, websiteName }: Props) {
    const [status, setStatus] = useState<"pending" | "in_progress" | "completed" | "cancelled">(currentStatus as "pending" | "in_progress" | "completed" | "cancelled")
    const [saving, setSaving] = useState(false)
    const [link, setLink] = useState(currentLink || "")

    async function handleSave(){
        setSaving(true)
        if (link) {
            try {
                const linkDomain = new URL(link).hostname.replace("www.", "")

                const siteDomain = new URL(websiteName).hostname.replace("www.", "")
                if (linkDomain !== siteDomain){
                    alert(`Link must be from ${siteDomain}`)
                    setSaving(false)
                    return
                }
            } catch (error) {
               alert("Invalid URL format")
               setSaving(false)
               return
            }
        }
        await updateStatus(orderId, status)
        await savePublishedLink(orderId, link)
        setSaving(false)
    }

  


return (
    <div className="card" style={{
  marginBottom: "1.25rem" }}>
              <div className="card-header">
                  <h3>Update Status</h3>
              </div>
              <div className="card-body">
                  <div className="form-group"
  style={{ marginBottom: "1rem" }}>
                      <label
  className="form-label">Status</label>
                      <select

  className="form-select"
                          value={status}
                          onChange={(e) =>
  setStatus(e.target.value as "pending" | "in_progress" | "completed" | "cancelled")}
                      >
                          <option
  value="pending">Pending</option>
                          <option
  value="in_progress">In Progress</option>
                          <option
  value="completed">Completed</option>
                          <option
  value="cancelled">Cancelled</option>
                      </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                      <label className="form-label">Published Link</label>
                      <input
                          type="url"
                          className="form-input"
                          value={link}
                          onChange={e => setLink(e.target.value)}
                          placeholder="https://website.com/article"
                      />
                  </div>
                  <button
                      className="btn
  btn-primary"
                      style={{ width: "100%"
  }}
                      onClick={handleSave}
                      disabled={saving}
                  >
                      {saving ? "Saving..." :
  "Save Changes"}
                  </button>
              </div>
          </div>
      )
    }