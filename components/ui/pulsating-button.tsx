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
      pulseColor = "rgba(96,165,250,0.5)",
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
          "relative flex cursor-pointer items-center justify-center gap-2.5 overflow-visible rounded-full px-8 py-4 text-base font-bold text-white",
          className
        )}
        style={{
          background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
          boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
          "--pulse-color": pulseColor,
          "--duration": duration,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {/* Expanding ring 1 */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: "var(--pulse-color)",
            animation: `pulsating-ring var(--duration) ease-out infinite`,
          }}
        />
        {/* Expanding ring 2 — offset by half duration */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: "var(--pulse-color)",
            animation: `pulsating-ring var(--duration) ease-out calc(var(--duration) / 2) infinite`,
          }}
        />
        <span className="relative z-10 flex items-center gap-2.5">{children}</span>
      </button>
    )
  }
)

PulsatingButton.displayName = "PulsatingButton"
