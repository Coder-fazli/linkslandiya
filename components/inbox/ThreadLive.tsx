"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Scrolls to the newest message on load and quietly refreshes the thread
// every 15s so replies appear without a manual reload.
export default function ThreadLive() {
    const router = useRouter()

    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight })
        const interval = setInterval(() => router.refresh(), 15000)
        return () => clearInterval(interval)
    }, [router])

    return null
}
