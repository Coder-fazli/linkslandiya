import { ReactNode } from "react"

type Props = {
    logoUrl?: string
    logoWidth?: number
    logoHeight?: number
    /** Height cap used only when no custom height is set */
    maxHeight?: number
    /** Rendered when no logo has been uploaded */
    fallback: ReactNode
    alt?: string
}

// The admin-uploaded site logo, sized by the appearance settings.
// Falls back to the given markup when no logo is uploaded.
export default function SiteLogo({ logoUrl, logoWidth, logoHeight, maxHeight = 48, fallback, alt = "Linkslandia" }: Props) {
    if (!logoUrl) return <>{fallback}</>
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={logoUrl}
            alt={alt}
            style={{
                width: logoWidth ? `${logoWidth}px` : "auto",
                height: logoHeight ? `${logoHeight}px` : "auto",
                maxHeight: logoHeight ? undefined : maxHeight,
                maxWidth: "100%",
                objectFit: "contain",
                display: "block",
            }}
        />
    )
}
