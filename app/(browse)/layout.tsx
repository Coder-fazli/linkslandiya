import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import "../admin/admin.css"

export default async function BrowseLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")

  return (
    <>
      <header className="browse-header">
        <div className="browse-header-inner">
          <Link href="/" className="browse-logo">
            <div className="logo-icon-sm">L</div>
            <span className="browse-logo-text">Linkslandia</span>
          </Link>

          <div className="browse-header-actions">
            <div className="balance-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 11a2 2 0 0 1 0 4h-3v-4h3z"/>
                <path d="M2 11h5"/>
              </svg>
              ${(user.balance ?? 0).toFixed(2)}
            </div>

            <Link href="/admin/settings" className="browse-add-funds-btn">
              + Add Funds
            </Link>

            <InteractiveHoverButton href="/admin">Dashboard</InteractiveHoverButton>
          </div>
        </div>
      </header>

      <main className="browse-main">
        {children}
      </main>
    </>
  )
}
