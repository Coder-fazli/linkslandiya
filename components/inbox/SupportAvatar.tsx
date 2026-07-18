type Props = {
    avatarUrl?: string
    name: string
    className?: string
    style?: React.CSSProperties
}

// Administration's avatar in the inbox — configured image, or initial letter fallback
export default function SupportAvatar({ avatarUrl, name, className = "inbox-avatar", style }: Props) {
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
            {name.charAt(0).toUpperCase()}
        </div>
    )
}
