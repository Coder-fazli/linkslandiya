"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Props type: what data this component receives from layout.tsx
type Props = {
    activeMode: "buyer" | "publisher"
    canPublish: boolean
    isAdmin: boolean
}

// Helper: checks if a nav link should be highlighted
const isActive = (pathname: string, href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

export default function AdminNav({ activeMode, canPublish, isAdmin }: Props) {
   const pathName = usePathname();

   return(
      <nav>

        {/* =============================================
            MAIN SECTION - Always visible to everyone
            Dashboard link is always shoxwn regardless of mode
            ============================================= */}
        <div className="nav-section">
          <div className="nav-section-title">Main</div>
          <Link href="/admin"
            className={`nav-item ${pathName === '/admin' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </Link>
        </div>

        {/* =============================================
            BUYER SECTION - Only visible when activeMode is "buyer"
            Shows: My Orders, Browse Websites
            ============================================= */}
        {activeMode === "buyer" && (
          <div className="nav-section">
            <div className="nav-section-title">Buyer</div>

            {/* My Orders: orders this user has purchased */}
            <Link href="/admin/buyer-orders" className={`nav-item ${isActive(pathName, '/admin/buyer-orders') ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              My Orders
            </Link>

            {/* Browse Websites: go to public marketplace to find websites */}
            <a href="/websites" className={`nav-item ${isActive(pathName, '/websites') ? 'active' : ''}`}target="_blank" rel="noopener noreferrer"> 
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Browse Websites
            </a>
          </div>
        )}

        {/* =============================================
            PUBLISHER SECTION - Only visible when activeMode is "publisher"
            Shows: My Websites, Orders Received
            ============================================= */}
        {activeMode === "publisher" && (
          <div className="nav-section">
            <div className="nav-section-title">Publisher</div>

            {/* My Websites: websites this user has listed for sale */}
            <Link href="/admin/websites" className={`nav-item ${isActive(pathName, '/admin/websites') ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              My Websites
            </Link>

            {/* Orders Received: orders other users placed on this user's websites */}
            <Link href="/admin/publisher-orders" className={`nav-item ${isActive(pathName, '/admin/publisher-orders') ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Orders Received
            </Link>
          </div>
        )}

        {/* =============================================
            ADMIN SECTION - Only visible when isAdmin is true
            Regular users NEVER see this section.
            Shows: All Users, All Websites, All Orders, Posts, Pages, Settings
            ============================================= */}
        {isAdmin && (
          <>
            <div className="nav-section">
              <div className="nav-section-title">Admin</div>

              <Link href="/admin/users" className={`nav-item ${isActive(pathName, '/admin/users') ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                All Users
              </Link>

              <Link href="/admin/all-websites" className={`nav-item ${isActive(pathName, '/admin/all-websites') ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                All Websites
              </Link>

              <Link href="/admin/all-orders" className={`nav-item ${isActive(pathName, '/admin/all-orders') ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                All Orders
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-section-title">Content</div>

              <Link href="/admin/posts" className={`nav-item ${isActive(pathName, '/admin/posts') ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                Posts
              </Link>

              <Link href="/admin/pages" className={`nav-item ${isActive(pathName, '/admin/pages') ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Pages
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-section-title">Settings</div>

              <Link href="/admin/settings" className={`nav-item ${isActive(pathName, '/admin/settings') ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                Settings
              </Link>
            </div>
          </>
        )}

      </nav>
   );
}
