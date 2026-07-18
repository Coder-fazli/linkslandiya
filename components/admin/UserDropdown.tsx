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
  const showModeSwitcher = !!activeMode && !!(canPublish && canBuy)
  const initial = name?.charAt(0).toUpperCase() || "U"

  return (
    <>
      <div className="udm-wrap">
        {/* Trigger — gradient ring avatar */}
        <button className="udm-trigger" aria-label="User menu">
          <div className="udm-ring">
            <div className="udm-initial">{initial}</div>
          </div>
        </button>

        {/* Dropdown panel */}
        <div className="udm-panel">

          {/* Profile card */}
          <div className="udm-profile-card">
            <div className="udm-profile-text">
              <span className="udm-profile-name">{name}</span>
              <span className="udm-profile-email">{email}</span>
            </div>
            <div className="udm-ring udm-ring--sm">
              <div className="udm-initial udm-initial--sm">{initial}</div>
            </div>
          </div>

          {/* Balance + Add Funds */}
          <div className="udm-balance-row">
            <div>
              <span className="udm-balance-label">Balance</span>
              <span className="udm-balance-amount">${balance.toFixed(2)}</span>
            </div>
            <Link href="/admin/top-up" target="_blank" rel="noopener noreferrer" className="udm-add-funds-btn">
              + Add Funds
            </Link>
          </div>

          {/* Mode switcher */}
          {showModeSwitcher && (
            <div className="udm-mode-section">
              <span className="udm-mode-label">Switch Mode</span>
              <div className="udm-mode-pills">
                <form action={() => switchMode("buyer")} style={{ margin: 0, flex: 1 }}>
                  <button type="submit" className={`udm-mode-pill${activeMode === "buyer" ? " active" : ""}`}>
                    <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                      <path d="M2 3h1.5l1.8 7.5h7l1.7-5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="7" cy="13" r="1" fill="currentColor"/>
                      <circle cx="12" cy="13" r="1" fill="currentColor"/>
                    </svg>
                    Buyer
                  </button>
                </form>
                <form action={() => switchMode("publisher")} style={{ margin: 0, flex: 1 }}>
                  <button type="submit" className={`udm-mode-pill${activeMode === "publisher" ? " active" : ""}`}>
                    <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                      <rect x="2" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    Publisher
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="udm-divider" />

          <Link href="/admin/settings" className="udm-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Account Settings
          </Link>

          <form action={logOut} style={{ margin: 0 }}>
            <button type="submit" className="udm-item udm-logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </form>

        </div>
      </div>
    </>
  )
}
