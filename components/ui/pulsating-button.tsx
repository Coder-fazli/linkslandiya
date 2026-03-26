import React from "react"

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
      pulseColor = "rgba(96,165,250,0.55)",
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
          background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "15px",
          fontFamily: "inherit",
          cursor: "pointer",
          border: "none",
          overflow: "visible",
          boxShadow: "0 8px 28px rgba(37,99,235,0.35)",
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
          animation: `pulsating-ring ${duration} ease-out ${parseFloat(duration) / 2}s infinite`,
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
