"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { requestPackageOrderAction } from "@/app/lib/package-orders-actions"

export default function RequestPackageButton({ packageId }: { packageId: string }) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState("")

    function handleClick() {
        setError("")
        startTransition(async () => {
            const result = await requestPackageOrderAction(packageId)
            if (result?.error) {
                setError(result.error)
                return
            }
            router.push(`/admin/inbox/${result.conversationId}`)
        })
    }

    return (
        <div>
            <button type="button" className="btn btn-primary" disabled={pending} onClick={handleClick} style={{ width: "100%", padding: "12px" }}>
                {pending ? "Sending request…" : "Confirm Request"}
            </button>
            {error && <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: 500, marginTop: "10px" }}>{error}</p>}
        </div>
    )
}
