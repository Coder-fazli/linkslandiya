"use client"

import Link from "next/link"
import { logOut, switchMode } from "@/app/(auth)/actions"

type Props = {
  name: string
  email: string
  balance?: number
  activeMode?: "buyer" | "publisher"
  canPublish?: boolean
  canBuy?: boolean
}

export default function UserDropdown({ name, email, balance = 0, activeMode, canPublish, canBuy }: Props) {
  const initial = name?.charAt(0).toUpperCase() || "U"
  const showModeSwitcher = !!activeMode && (canPublish || canBuy)

  return (
    <div className="user-dropdown-wrap">
      <button className="user-avatar-btn" aria-label="User menu">
        {initial}
      </button>

      <div className="user-dropdown-menu">
        {/* User info header */}
        <div className="udm-header">
          <div className="udm-avatar">{initial}</div>
          <div>
            <div className="udm-name">{name}</div>
            <div className="udm-email">{email}</div>
          </div>
        </div>

        <div className="udm-divider" />

        {/* Balance */}
        <div className="udm-balance">
          <span className="udm-balance-label">Balance</span>
          <span className="udm-balance-amount">${balance.toFixed(2)}</span>
        </div>

        {/* Mode switcher — only for non-admin users with multiple roles */}
        {showModeSwitcher && (canPublish && canBuy) && (
          <>
            <div className="udm-divider" />
            <div className="udm-mode-section">
              <span className="udm-mode-label">Switch Mode</span>
              <div className="udm-mode-pills">
                {canBuy && (
                  <form action={() => switchMode("buyer")} style={{ margin: 0 }}>
                    <button
                      type="submit"
                      className={`udm-mode-pill${activeMode === "buyer" ? " udm-mode-pill--active" : ""}`}
                    >
                      <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                        <path d="M2 3h1.5l1.8 7.5h7l1.7-5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="7" cy="13" r="1" fill="currentColor"/>
                        <circle cx="12" cy="13" r="1" fill="currentColor"/>
                      </svg>
                      Buyer
                    </button>
                  </form>
                )}
                {canPublish && (
                  <form action={() => switchMode("publisher")} style={{ margin: 0 }}>
                    <button
                      type="submit"
                      className={`udm-mode-pill${activeMode === "publisher" ? " udm-mode-pill--active" : ""}`}
                    >
                      <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                        <rect x="2" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      Publisher
                    </button>
                  </form>
                )}
              </div>
            </div>
          </>
        )}

        <div className="udm-divider" />

        {/* Links */}
        <Link href="/admin/settings" className="udm-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Account Settings
        </Link>

        <form action={logOut} style={{ margin: 0 }}>
          <button type="submit" className="udm-item udm-logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log out
          </button>
        </form>
      </div>
    </div>
  )
}
