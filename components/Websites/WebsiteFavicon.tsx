"use client"

import { useState } from 'react'
import Image from 'next/image'

type Props = {
    url: string
    name: string
    className?: string
    size?: number
}

export default function WebsiteFavicon({ url, name, className = "site-favicon", size = 32 }: Props) {
    const [failed, setFailed] = useState(false)

    let domain = ""
    try {
        domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname
    } catch {
        domain = url
    }

    const faviconSrc = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

    if (failed) {
        return (
            <div className={className} style={{ background: "transparent", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image
                    src="/websites icons.png"
                    alt={name}
                    width={size}
                    height={size}
                    style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
            </div>
        )
    }

    return (
        <div className={className} style={{ background: "transparent", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={faviconSrc}
                alt={name}
                width={size}
                height={size}
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
                onError={() => setFailed(true)}
            />
        </div>
    )
}
