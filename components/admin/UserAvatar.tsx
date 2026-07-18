type Props = {
    avatarUrl?: string
    name: string
    className?: string
    style?: React.CSSProperties
}

// A user's avatar — their uploaded photo, or an initial-letter fallback
export default function UserAvatar({ avatarUrl, name, className, style }: Props) {
    if (avatarUrl) {
        return (
            <div className={className} style={{ overflow: "hidden", ...style }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
        )
    }
    return (
        <div className={className} style={style}>
            {(name || "U").charAt(0).toUpperCase()}
        </div>
    )
}
