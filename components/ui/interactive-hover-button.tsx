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
        padding: "9px 24px 9px 36px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "14px",
        background: "#fff",
        color: "#2563eb",
        textDecoration: "none",
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    >
      {/* Static dot — always visible at left, fades out on hover */}
      <span style={{
        position: "absolute",
        left: "16px",
        width: "9px",
        height: "9px",
        borderRadius: "9999px",
        background: "#2563eb",
        flexShrink: 0,
        opacity: hovered ? 0 : 1,
        transition: "opacity 0.2s ease",
        zIndex: 2,
      }} />

      {/* Expanding blue fill — grows from left on hover */}
      <span style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: hovered ? "100%" : "0%",
        background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
        transition: "width 0.35s ease",
        zIndex: 0,
        borderRadius: "9999px",
      }} />

      {/* Default text — slides out right on hover */}
      <span style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        transform: hovered ? "translateX(40px)" : "translateX(0)",
        opacity: hovered ? 0 : 1,
        transition: "transform 0.3s ease, opacity 0.2s ease",
        color: "#2563eb",
        whiteSpace: "nowrap",
      }}>
        {children}
      </span>

      {/* Hover text + arrow — slides in from left */}
      <span style={{
        position: "absolute",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transform: hovered ? "translateX(0)" : "translateX(-40px)",
        opacity: hovered ? 1 : 0,
        transition: "transform 0.3s ease, opacity 0.2s ease",
        color: "#fff",
        whiteSpace: "nowrap",
      }}>
        {children}
        <ArrowRight size={15} />
      </span>
    </a>
  )
}
