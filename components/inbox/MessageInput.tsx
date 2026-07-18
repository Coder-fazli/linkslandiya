"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { sendMessageAction } from "@/app/lib/inbox-actions"

export default function MessageInput({ conversationId }: { conversationId: string }) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [text, setText] = useState("")
    const [fileName, setFileName] = useState("")
    const [error, setError] = useState("")
    const fileRef = useRef<HTMLInputElement>(null)

    function handleSend(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        const file = fileRef.current?.files?.[0]
        if (!text.trim() && !file) return

        const fd = new FormData()
        fd.append("body", text)
        if (file) fd.append("attachment", file)

        startTransition(async () => {
            const result = await sendMessageAction(conversationId, fd)
            if (result?.error) {
                setError(result.error)
                return
            }
            setText("")
            setFileName("")
            if (fileRef.current) fileRef.current.value = ""
            router.refresh()
        })
    }

    return (
        <form onSubmit={handleSend}>
            <div className="thread-input">
                <div className="thread-input-box">
                    <input
                        type="text"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder={fileName ? `📎 ${fileName} — add a note…` : "Write your message…"}
                        maxLength={5000}
                        disabled={pending}
                    />
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        style={{ display: "none" }}
                        onChange={e => setFileName(e.target.files?.[0]?.name ?? "")}
                    />
                    <button
                        type="button"
                        className={`thread-attach-btn ${fileName ? "has-file" : ""}`}
                        title="Attach a screenshot (PNG/JPG, max 5 MB)"
                        onClick={() => fileRef.current?.click()}
                        disabled={pending}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                    </button>
                    <button type="submit" className="thread-send-btn" disabled={pending || (!text.trim() && !fileName)} title="Send">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="17" height="17">
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                            <polyline points="5 12 12 5 19 12"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
            {error && <p className="thread-error">{error}</p>}
        </form>
    )
}
