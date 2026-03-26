import React from "react"
import { colors } from "@/app/lib/colors"

interface PulsatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string
  duration?: string
}

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
>(
  (
    {
      className,
      children,
      pulseColor = `rgba(0,180,216,0.55)`,
      duration = "2s",
      style,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={className}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          padding: "14px 32px",
          borderRadius: "999px",
          background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 50%, ${colors.primaryDark} 100%)`,
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "15px",
          fontFamily: "inherit",
          cursor: "pointer",
          border: "none",
          overflow: "visible",
          boxShadow: `0 8px 28px ${colors.primaryShadow}`,
          whiteSpace: "nowrap",
          ...style,
        }}
        {...props}
      >
        {/* Ring 1 */}
        <span style={{
          position: "absolute",
          inset: 0,
          borderRadius: "999px",
          border: `2px solid ${pulseColor}`,
          background: "transparent",
          animation: `pulsating-ring ${duration} ease-out infinite`,
          pointerEvents: "none",
        }} />
        {/* Ring 2 — staggered */}
        <span style={{
          position: "absolute",
          inset: 0,
          borderRadius: "999px",
          border: `2px solid ${pulseColor}`,
          background: "transparent",
          animation: `pulsating-ring ${duration} ease-out 1s infinite`,
          pointerEvents: "none",
        }} />
        <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
          {children}
        </span>
      </button>
    )
  }
)

PulsatingButton.displayName = "PulsatingButton"
