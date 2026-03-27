"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ShineButtonProps {
  label?: string
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
  href?: string
  target?: string
  rel?: string
}

const sizeStyles: Record<NonNullable<ShineButtonProps["size"]>, { padding: string; fontSize: string }> = {
  sm: { padding: "0.4rem 0.85rem", fontSize: "0.8rem" },
  md: { padding: "0.55rem 1.2rem", fontSize: "0.95rem" },
  lg: { padding: "0.75rem 1.6rem", fontSize: "1rem" },
}

// Brand gradient: dark → light → dark (same structure as Lightswind)
// #0096b7 (dark) → #48cae4 (light) → #0096b7 (dark)
const BRAND_GRADIENT =
  "linear-gradient(325deg, #0096b7 0%, #48cae4 55%, #0096b7 90%)"

export function ShineButton({ label = "Get Started", onClick, className, size = "md", href, target, rel }: ShineButtonProps) {
  const { padding, fontSize } = sizeStyles[size]

  const sharedStyle: React.CSSProperties = {
    backgroundImage: BRAND_GRADIENT,
    backgroundSize: "280% auto",
    backgroundPosition: "initial",
    color: "#fff",
    fontSize,
    padding,
    transition: "background-position 0.8s ease, transform 0.15s ease",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    textDecoration: "none",
    minWidth: "unset",
    minHeight: "36px",
    position: "relative",
    overflow: "hidden",
  }

  const sharedClass = cn(
    "relative font-semibold transition-all duration-700",
    "shadow-[0px_0px_20px_rgba(0,180,216,0.5),0px_5px_5px_-1px_rgba(0,150,183,0.25),inset_4px_4px_8px_rgba(72,202,228,0.5),inset_-4px_-4px_8px_rgba(0,100,150,0.35)]",
    "hover:scale-[1.03] active:scale-95",
    className
  )

  const shineDiv = (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: "-75%",
        width: "200%",
        height: "100%",
        background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
        transform: "skewX(-20deg)",
        animation: "shineMove 2.8s infinite",
        pointerEvents: "none",
        zIndex: 20,
      }}
    />
  )

  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.backgroundPosition = "right top"
  }
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.backgroundPosition = "initial"
  }

  if (href) {
    return (
      <>
        <a href={href} target={target} rel={rel} className={sharedClass} style={sharedStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
          {label}
          {shineDiv}
        </a>
        <style>{`@keyframes shineMove { 0%{left:-75%} 60%{left:125%} 100%{left:125%} }`}</style>
      </>
    )
  }

  return (
    <>
      <button onClick={onClick} className={sharedClass} style={sharedStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {label}
        {shineDiv}
      </button>
      <style>{`@keyframes shineMove { 0%{left:-75%} 60%{left:125%} 100%{left:125%} }`}</style>
    </>
  )
}
