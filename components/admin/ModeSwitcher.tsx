"use client"

// This component shows the [Buyer | Publisher] toggle in the header
// It's a client component because it needs onClick

import { switchMode } from "@/app/(auth)/actions"

type Props = {
  activeMode: "buyer" | "publisher"
  canPublish: boolean
}

export default function ModeSwitcher({ activeMode, canPublish }: Props) {
  return (
    <div className="mode-switcher">
      <button
        className={activeMode === "buyer" ? "active" : ""}
        onClick={() => switchMode("buyer")}
      >
        Buyer
      </button>
     
      {canPublish && (
        <button
          className={activeMode === "publisher" ? "active" : ""}
          onClick={() => switchMode("publisher")}
        >
          Publisher
        </button>
      )}
    </div>
  )
}
