"use client"
import { useState } from "react"
import { ArrowRight } from "lucide-react"

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  children: React.ReactNode
}

export function InteractiveHoverButton({ children, href, style, ...props }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "9999px",
        border: "2px solid #2563eb",
        padding: "11px 28px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "14px",
        background: "#fff",
        color: "#2563eb",
        textDecoration: "none",
        width: "100%",
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    >
      {/* Expanding blue dot */}
      <span style={{
        position: "absolute",
        left: "20px",
        width: "10px",
        height: "10px",
        borderRadius: "9999px",
        background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
        transform: hovered ? "scale(180)" : "scale(1)",
        transition: "transform 0.45s ease",
        zIndex: 0,
      }} />

      {/* Default text — slides out right on hover */}
      <span style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transform: hovered ? "translateX(48px)" : "translateX(0)",
        opacity: hovered ? 0 : 1,
        transition: "transform 0.3s ease, opacity 0.25s ease",
        color: "#2563eb",
      }}>
        {children}
      </span>

      {/* Hover text — slides in from left */}
      <span style={{
        position: "absolute",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transform: hovered ? "translateX(0)" : "translateX(-48px)",
        opacity: hovered ? 1 : 0,
        transition: "transform 0.3s ease, opacity 0.25s ease",
        color: "#fff",
        whiteSpace: "nowrap",
      }}>
        {children}
        <ArrowRight size={15} />
      </span>
    </a>
  )
}
