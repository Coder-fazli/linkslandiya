"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { requestTopupAction } from "@/app/lib/inbox-actions"
import { TOPUP_METHODS, TopupMethod } from "@/models/topup-request"

const METHOD_INFO: Record<TopupMethod, { icon: string; desc: string }> = {
    usdt_trc20: { icon: "💰", desc: "No card needed" },
    wise: { icon: "🌐", desc: "Details sent by our team" },
    payoneer: { icon: "💼", desc: "Details sent by our team" },
}

type Props = {
    configuredMethods: string[]  // methods with an instant address on file
    minimumTopUp: number
}

export default function TopUpForm({ configuredMethods, minimumTopUp }: Props) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [method, setMethod] = useState<TopupMethod>("usdt_trc20")
    const [amount, setAmount] = useState("")
    const [error, setError] = useState("")

    const numericAmount = Number(amount)
    const canSubmit = Number.isFinite(numericAmount) && numericAmount >= minimumTopUp

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!canSubmit) return
        setError("")
        const fd = new FormData()
        fd.append("method", method)
        fd.append("amount", amount)
        startTransition(async () => {
            const result = await requestTopupAction(fd)
            if (result?.error) {
                setError(result.error)
                return
            }
            router.push(`/admin/inbox/${result.conversationId}`)
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="topup-methods">
                {TOPUP_METHODS.map(m => {
                    const info = METHOD_INFO[m.value]
                    const instant = configuredMethods.includes(m.value)
                    const selected = method === m.value
                    return (
                        <button
                            type="button"
                            key={m.value}
                            className={`topup-method-card ${selected ? "selected" : ""}`}
                            onClick={() => setMethod(m.value)}
                        >
                            <div className="topup-method-icon">{info.icon}</div>
                            <div className="topup-method-label">{m.label}</div>
                            <div className="topup-method-desc">
                                {instant ? "Instant payment address" : info.desc}
                            </div>
                        </button>
                    )
                })}
            </div>

            <div className="topup-amount-row">
                <div className="form-group" style={{ margin: 0, flex: 1 }}>
                    <label className="form-label">Amount (USD)</label>
                    <input
                        type="number" step="0.01" min={minimumTopUp}
                        className="form-input"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder={`Minimum $${minimumTopUp}`}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={!canSubmit || pending} style={{ height: "42px" }}>
                    {pending ? "Requesting…" : "Request Top-Up"}
                </button>
            </div>

            {error && <p className="thread-error">{error}</p>}
        </form>
    )
}
