import Image from 'next/image'

type Props = {
    url: string
    name: string
    className?: string
    size?: number
}

export default function WebsiteFavicon({ name, className = "site-favicon", size = 32 }: Props) {
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
