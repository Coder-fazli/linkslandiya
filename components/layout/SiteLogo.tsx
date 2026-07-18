import { CSSProperties, ReactNode } from "react"
import { DEFAULT_SITE_TITLE } from "@/models/site-settings"

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
    /** Site title text, shown beside the logo image when showTitle is true */
    title?: string
    showTitle?: boolean
    /** CSS class for the title text — pass the placement's existing style */
    titleClassName?: string
}

// The admin-uploaded site logo, sized by the appearance settings.
// Falls back to the given markup when no logo is uploaded.
export default function SiteLogo({
    logoUrl, logoWidth, logoHeight, maxHeight = 48, customSize = true, fallback, alt = DEFAULT_SITE_TITLE,
    title = DEFAULT_SITE_TITLE, showTitle = true, titleClassName,
}: Props) {
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

    const image = (
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

    if (!showTitle || !title) return image

    return (
        <>
            {image}
            <span className={titleClassName}>{title}</span>
        </>
    )
}
