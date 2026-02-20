export type Website = {
    _id?: string
    id?: number
    name: string
    desc: string
    dofollow: boolean
    da: number
    dr: number
    traffic: number
    country: string
    language: string
    topic: string
    price: number
    status: 'draft' | 'published' | 'pending_delete' | 'pending',
    ownerId: string

    }

export const faviconColors: Record<string, string> = {
    'a': '#ef4444', 'b': '#f97316', 'c': '#eab308', 'd': '#84cc16',
    'e': '#22c55e', 'f': '#14b8a6', 'g': '#06b6d4', 'h': '#0ea5e9',
    'i': '#3b82f6', 'j': '#6366f1', 'k': '#8b5cf6', 'l': '#a855f7',
    'm': '#d946ef', 'n': '#ec4899', 'o': '#f43f5e', 'p': '#ef4444',
    'q': '#f97316', 'r': '#eab308', 's': '#84cc16', 't': '#0d9488',
    'u': '#06b6d4', 'v': '#0ea5e9', 'w': '#3b82f6', 'x': '#6366f1',
    'y': '#8b5cf6', 'z': '#a855f7'
}

export const countryFlags: Record<string, string> = {
    'US': '🇺🇸', 'UK': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
    'ES': '🇪🇸', 'IT': '🇮🇹', 'TR': '🇹🇷', 'IN': '🇮🇳', 'AZ': 'az', 'KZ': 'kz',
    'BR': '🇧🇷', 'Global': '🌍'
}

export function getFaviconColor(name: string): string {
    const firstletter = name.charAt(0).toLowerCase()
    return faviconColors[firstletter] || '#64748b'
}

export function formatTraffic(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
    return num.toString()
}
