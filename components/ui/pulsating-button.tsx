import React from "react"
import { cn } from "@/lib/utils"

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
      pulseColor = "rgba(96,165,250,0.6)",
      duration = "2s",
      style,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative flex cursor-pointer items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-bold text-white",
          className
        )}
        style={{
          background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
          boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
          overflow: "visible",
          "--pulse-color": pulseColor,
          "--duration": duration,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {/* Ring 1 — starts immediately */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            border: "2px solid var(--pulse-color)",
            background: "transparent",
            animation: `pulsating-ring var(--duration) ease-out infinite`,
            pointerEvents: "none",
          }}
        />
        {/* Ring 2 — offset by half duration for continuous effect */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            border: "2px solid var(--pulse-color)",
            background: "transparent",
            animation: `pulsating-ring var(--duration) ease-out calc(var(--duration) / 2) infinite`,
            pointerEvents: "none",
          }}
        />
        <span className="relative z-10 flex items-center gap-2.5">{children}</span>
      </button>
    )
  }
)

PulsatingButton.displayName = "PulsatingButton"
