"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Auto-refreshes the page every few seconds while a screenshot capture is
// still running, so the admin sees the final result without manually
// reloading — this is what was silently missing before (status looked
// "stuck" on Capturing… until the page happened to be reopened).
export default function ScreenshotStatusPoller() {
    const router = useRouter()

    useEffect(() => {
        const interval = setInterval(() => router.refresh(), 3000)
        return () => clearInterval(interval)
    }, [router])

    return null
}
