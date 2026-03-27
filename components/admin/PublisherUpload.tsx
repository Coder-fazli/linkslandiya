"use client"

import { useState, useRef } from "react"
import { savePublisherFile } from "@/app/lib/actions"

type Props = {
    orderId: string
    existingFileUrl?: string
    existingFileName?: string
}

const ALLOWED_EXTENSIONS = ['.doc', '.docx']
const MAX_SIZE_MB = 10

export default function PublisherUpload({ orderId, existingFileUrl, existingFileName }: Props) {
    const [fileUrl, setFileUrl] = useState(existingFileUrl || "")
    const [fileName, setFileName] = useState(existingFileName || "")
    const [dragging, setDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState("")
    const [saved, setSaved] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    function validate(file: File): string | null {
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
        if (!ALLOWED_EXTENSIONS.includes(ext)) return `Only .doc and .docx files are allowed`
        if (file.size > MAX_SIZE_MB * 1024 * 1024) return `File too large (max ${MAX_SIZE_MB} MB)`
        if (file.size === 0) return `File is empty`
        return null
    }

    async function upload(file: File) {
        const err = validate(file)
        if (err) { setError(err); return }
        setError("")
        setUploading(true)
        try {
            const fd = new FormData()
            fd.append("file", file)
            const res = await fetch("/api/upload", { method: "POST", body: fd })
            const data = await res.json()
            if (!res.ok) { setError(data.error || "Upload failed"); return }
            setFileUrl(data.url)
            setFileName(file.name)
            await savePublisherFile(orderId, data.url, file.name)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } finally {
            setUploading(false)
        }
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) upload(file)
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) upload(file)
    }

    return (
        <div className="card" style={{ marginBottom: "1.25rem" }}>
            <div className="card-header">
                <h3>Upload Written Article</h3>
                {fileUrl && (
                    <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                        File uploaded
                    </span>
                )}
            </div>
            <div className="card-body">
                <p style={{ margin: "0 0 14px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    The buyer requested you to write the article. Upload the completed article file (.doc or .docx) below.
                </p>

                {/* Already uploaded */}
                {fileUrl && (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", marginBottom: "12px" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" width="22" height="22">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: "13px", color: "#15803d", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fileName}</div>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#22c55e" }}>View file</a>
                        </div>
                        <button
                            onClick={() => inputRef.current?.click()}
                            style={{ fontSize: "12px", color: "var(--text-secondary)", background: "none", border: "1px solid var(--border-color)", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}
                        >
                            Replace
                        </button>
                    </div>
                )}

                {/* Drop zone */}
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    style={{
                        border: `2px dashed ${dragging ? "var(--brand-primary)" : error ? "#ef4444" : "var(--border-color)"}`,
                        borderRadius: "12px",
                        padding: "28px 20px",
                        textAlign: "center",
                        cursor: uploading ? "wait" : "pointer",
                        background: dragging ? "var(--brand-primary)10" : "var(--bg-secondary, #f8fafc)",
                        transition: "all 0.2s",
                    }}
                >
                    {uploading ? (
                        <div style={{ color: "var(--brand-primary)", fontWeight: 600, fontSize: "14px" }}>Uploading…</div>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" width="32" height="32" style={{ margin: "0 auto 10px", display: "block" }}>
                                <polyline points="16 16 12 12 8 16"/>
                                <line x1="12" y1="12" x2="12" y2="21"/>
                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                            </svg>
                            <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
                                {fileUrl ? "Drop new file here or click to replace" : "Drop file here or click to upload"}
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>.doc or .docx · max 10 MB</div>
                        </>
                    )}
                </div>

                {error && <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#ef4444" }}>{error}</p>}
                {saved && <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#22c55e", fontWeight: 600 }}>✓ Article saved successfully</p>}

                <input ref={inputRef} type="file" accept=".doc,.docx" style={{ display: "none" }} onChange={onInputChange} />
            </div>
        </div>
    )
}
