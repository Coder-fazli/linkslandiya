"use client"

import { useEffect, useRef, useState } from "react"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import FirstProjectPrompt from "./FirstProjectPrompt"
import { markWelcomeBonusSeenAction } from "@/app/lib/actions"

interface Props {
    userId: string
    canBuy: boolean
    showProjectPrompt: boolean
    hasSeenWelcomeBonus: boolean
}

export default function WelcomeFlow({ userId, canBuy, showProjectPrompt, hasSeenWelcomeBonus }: Props) {
    const [showBonus, setShowBonus] = useState(false)
    const [showPrompt, setShowPrompt] = useState(false)
    const confettiRef = useRef<ConfettiRef>(null)

    useEffect(() => {
        if (canBuy && !hasSeenWelcomeBonus) {
            setShowBonus(true)
        } else if (showProjectPrompt) {
            setShowPrompt(true)
        }
    }, [])

    useEffect(() => {
        if (!showProjectPrompt) setShowPrompt(false)
    }, [showProjectPrompt])

    useEffect(() => {
        if (showBonus) {
            const t = setTimeout(() => {
                confettiRef.current?.fire({
                    particleCount: 200,
                    spread: 100,
                    startVelocity: 40,
                    origin: { x: 0.5, y: 0.5 },
                    colors: ["#0ea5e9", "#38bdf8", "#fbbf24", "#f87171", "#34d399", "#a78bfa", "#fb923c"],
                    scalar: 1.2,
                })
                setTimeout(() => {
                    confettiRef.current?.fire({
                        particleCount: 80,
                        spread: 60,
                        startVelocity: 25,
                        origin: { x: 0.5, y: 0.5 },
                        colors: ["#0ea5e9", "#fbbf24", "#34d399", "#a78bfa"],
                    })
                }, 200)
            }, 300)
            return () => clearTimeout(t)
        }
    }, [showBonus])

    async function handleBonusClose() {
        await markWelcomeBonusSeenAction()
        setShowBonus(false)
        if (showProjectPrompt) {
            setTimeout(() => setShowPrompt(true), 3000)
        }
    }

    return (
        <>
            {/* Welcome Bonus Modal */}
            {showBonus && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 99999,
                    background: "rgba(15, 23, 42, 0.55)",
                    backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "16px",
                }}>
                    <Confetti
                        ref={confettiRef}
                        manualstart
                        style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 100000 }}
                    />

                    <div style={{
                        background: "#ffffff",
                        borderRadius: "24px",
                        padding: "48px 40px 36px",
                        width: "100%",
                        maxWidth: "380px",
                        textAlign: "center",
                        position: "relative",
                        boxShadow: "0 24px 64px rgba(14, 165, 233, 0.2), 0 4px 16px rgba(0,0,0,0.08)",
                        animation: "giftPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                    }}>

                        <button onClick={handleBonusClose} style={{
                            position: "absolute", top: "16px", right: "16px",
                            width: "28px", height: "28px",
                            border: "none", background: "#f1f5f9", borderRadius: "50%",
                            cursor: "pointer", color: "#94a3b8", fontSize: "14px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>✕</button>

                        <div style={{
                            width: "88px", height: "88px",
                            background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
                            borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 20px",
                            fontSize: "42px",
                            animation: "giftBounce 0.6s ease 0.3s both",
                        }}>🎁</div>

                        <div style={{
                            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
                            textTransform: "uppercase", color: "#0ea5e9", marginBottom: "8px",
                        }}>
                            Congratulations!
                        </div>

                        <div style={{
                            fontSize: "56px", fontWeight: 800, color: "#0f172a",
                            lineHeight: 1, marginBottom: "4px",
                        }}>
                            <span style={{ fontSize: "28px", fontWeight: 700, verticalAlign: "super", color: "#0ea5e9" }}>$</span>
                            10
                        </div>

                        <p style={{
                            fontSize: "14px", color: "#64748b", lineHeight: 1.6,
                            margin: "12px 0 28px",
                        }}>
                            Free credit has been added to your account.<br />
                            Use it to place your <strong style={{ color: "#0f172a" }}>first order</strong> on the Marketplace.
                        </p>

                        <button onClick={handleBonusClose} style={{
                            display: "block", width: "100%", padding: "14px",
                            background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                            color: "#ffffff", fontSize: "15px", fontWeight: 700,
                            border: "none", borderRadius: "12px", cursor: "pointer",
                            boxShadow: "0 4px 16px rgba(14, 165, 233, 0.4)",
                        }}>
                            Start Exploring
                        </button>

                        <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "14px" }}>
                            * Credit is available immediately in your wallet.
                        </p>
                    </div>

                    <style>{`
                        @keyframes giftPop {
                            from { opacity: 0; transform: scale(0.8) translateY(20px); }
                            to   { opacity: 1; transform: scale(1) translateY(0); }
                        }
                        @keyframes giftBounce {
                            0%   { transform: scale(0); opacity: 0; }
                            60%  { transform: scale(1.15); opacity: 1; }
                            80%  { transform: scale(0.95); }
                            100% { transform: scale(1); }
                        }
                    `}</style>
                </div>
            )}

            {/* First Project Prompt — shown after bonus or immediately for returning users */}
            {showPrompt && <FirstProjectPrompt onClose={() => setShowPrompt(false)} />}
        </>
    )
}
