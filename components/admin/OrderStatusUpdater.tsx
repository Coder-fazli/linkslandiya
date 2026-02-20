"use client"

import { useState } from "react"
import { updateStatus } from "@/app/lib/actions"

type Props = {
    orderId: string
    currentStatus: string
}

export default function OrderStatusUpdated({ orderId, currentStatus }: Props) {
    const [status, setStatus] = useState<"pending" | "in_progress" | "completed" | "cancelled">(currentStatus as "pending" | "in_progress" | "completed" | "cancelled")
    const [saving, setSaving] = useState(false)

    async function handleSave(){
        setSaving(true)
        await updateStatus(orderId, status)
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
                  <button
                      className="btn
  btn-primary"
                      style={{ width: "100%"
  }}
                      onClick={handleSave}
                      disabled={saving ||
  status === currentStatus}
                  >
                      {saving ? "Saving..." :
  "Save Changes"}
                  </button>
              </div>
          </div>
      )
    }