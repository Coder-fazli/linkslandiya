import { CSSProperties, ReactNode } from "react"

type Props = {
    logoUrl?: string
    logoWidth?: number
    logoHeight?: number
    /** Height cap; in compact placements it always wins over the custom size */
    maxHeight?: number
    /**
     * true (default): use the admin-set custom logo size (main site header).
     * false: compact placement — always scale the logo to fit maxHeight,
     * ignoring the custom size so it can never break a slim bar.
     */
    customSize?: boolean
    /** Rendered when no logo has been uploaded */
    fallback: ReactNode
    alt?: string
}

// The admin-uploaded site logo, sized by the appearance settings.
// Falls back to the given markup when no logo is uploaded.
export default function SiteLogo({ logoUrl, logoWidth, logoHeight, maxHeight = 48, customSize = true, fallback, alt = "Linkslandia" }: Props) {
    if (!logoUrl) return <>{fallback}</>

    const style: CSSProperties = customSize
        ? {
            width: logoWidth ? `${logoWidth}px` : "auto",
            height: logoHeight ? `${logoHeight}px` : "auto",
            maxHeight: logoHeight ? undefined : maxHeight,
        }
        : {
            width: "auto",
            height: maxHeight,
        }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={logoUrl}
            alt={alt}
            style={{
                ...style,
                maxWidth: "100%",
                objectFit: "contain",
                display: "block",
            }}
        />
    )
}
