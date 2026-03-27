'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getFaviconColor } from '@/app/lib/types'

type Props = {
    url: string
    name: string
    className?: string
    size?: number
}

export default function WebsiteFavicon({ url, name, className = "site-favicon", size = 32 }: Props) {
    const [failed, setFailed] = useState(false)

    const firstLetter = (name || url || '?').charAt(0).toUpperCase()
    const bgColor = getFaviconColor(name || url || '')

    if (!url || failed) {
        return (
            <div className={className} style={{ background: bgColor, width: size, height: size }}>
                {firstLetter}
            </div>
        )
    }

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=64`

    return (
        <div className={className} style={{ background: 'transparent', padding: 0 }}>
            <Image
                src={faviconUrl}
                alt={name}
                width={size}
                height={size}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                onError={() => setFailed(true)}
            />
        </div>
    )
}
