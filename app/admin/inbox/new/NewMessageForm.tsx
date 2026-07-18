"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { startSupportConversationAction } from "@/app/lib/inbox-actions"
import { SUPPORT_CATEGORIES } from "@/models/conversation"

export default function NewMessageForm() {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState("")

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")
        const fd = new FormData(e.currentTarget)
        startTransition(async () => {
            const result = await startSupportConversationAction(fd)
            if (result?.error) {
                setError(result.error)
                return
            }
            router.push(`/admin/inbox/${result.conversationId}`)
        })
    }

    return (
        <form onSubmit={handleSubmit} className="card" style={{ maxWidth: "640px" }}>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

                <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">What is your question about? <span style={{ color: "#ef4444" }}>*</span></label>
                    <select name="category" className="form-select" required defaultValue="">
                        <option value="" disabled>— Choose a category —</option>
                        {SUPPORT_CATEGORIES.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">How urgent is it?</label>
                    <div style={{ display: "flex", gap: "18px", marginTop: "6px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "14px", cursor: "pointer" }}>
                            <input type="radio" name="priority" value="normal" defaultChecked /> Normal
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "14px", cursor: "pointer" }}>
                            <input type="radio" name="priority" value="high" /> High — blocking my work
                        </label>
                    </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Message <span style={{ color: "#ef4444" }}>*</span></label>
                    <textarea
                        name="message" className="form-textarea" rows={6} required
                        minLength={5} maxLength={5000}
                        placeholder="Describe your question with as much detail as possible…"
                    />
                </div>

                {error && <p className="thread-error" style={{ margin: 0 }}>{error}</p>}

                <div>
                    <button type="submit" className="btn btn-primary" disabled={pending}>
                        {pending ? "Sending…" : "Send Message"}
                    </button>
                </div>
            </div>
        </form>
    )
}
