"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Badges = {
    pendingOrders?: number         // admin: orders awaiting approval
    websitesReview?: number        // admin: websites/edits awaiting review
    ordersToAccept?: number        // publisher: approved orders to accept
    ordersToConfirm?: number       // buyer: published links to confirm
    unreadMessages?: number        // everyone: unread inbox messages
    pendingPackageOrders?: number  // admin: package requests awaiting follow-up
}

type Props = {
    activeMode: "buyer" | "publisher"
    canPublish: boolean
    isAdmin: boolean
    canBuy?: boolean
    badges?: Badges
}

const isActive = (pathname: string, href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

function NavBadge({ count }: { count?: number }) {
    if (!count) return null
    return <span className="nav-badge">{count > 99 ? "99+" : count}</span>
}

export default function AdminNav({ activeMode, canPublish, isAdmin, canBuy = true, badges = {} }: Props) {
   const pathName = usePathname();

   return(
      <nav>

        {/* MAIN */}
        <div className="nav-section">
          <div className="nav-section-title">Main</div>
          <Link href="/admin" className={`nav-item ${pathName === '/admin' ? 'active' : ''}`}>
            <span className="nav-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1"></rect>
              </svg>
            </span>
            Dashboard
            {pathName === '/admin' && <span className="nav-dot"></span>}
          </Link>

          <Link href="/admin/inbox" className={`nav-item ${isActive(pathName, '/admin/inbox') ? 'active' : ''}`}>
            <span className="nav-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
            Messages
            <NavBadge count={badges.unreadMessages} />
          </Link>
        </div>

        {/* ADMIN — shown first after Dashboard, only for admins */}
        {isAdmin && (
          <>
            <div className="nav-section">
              <div className="nav-section-title">Management</div>

              <Link href="/admin/users" className={`nav-item ${isActive(pathName, '/admin/users') ? 'active' : ''}`}>
                <span className="nav-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
                All Users
              </Link>

              <Link href="/admin/publishers-websites" className={`nav-item ${isActive(pathName, '/admin/publishers-websites') ? 'active' : ''}`}>
                <span className="nav-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </span>
                Publishers Websites
                <NavBadge count={badges.websitesReview} />
              </Link>

              <Link href="/admin/all-orders" className={`nav-item ${isActive(pathName, '/admin/all-orders') ? 'active' : ''}`}>
                <span className="nav-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </span>
                All Orders
                <NavBadge count={badges.pendingOrders} />
              </Link>

              <Link href="/admin/package-orders" className={`nav-item ${isActive(pathName, '/admin/package-orders') ? 'active' : ''}`}>
                <span className="nav-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </span>
                Package Orders
                <NavBadge count={badges.pendingPackageOrders} />
              </Link>
            </div>
          </>
        )}

        {/* BUYER */}
        {activeMode === "buyer" && (
          <div className="nav-section">
            <div className="nav-section-title">{isAdmin ? "Admin" : "Buyer"}</div>

            <Link href="/admin/projects" className={`nav-item ${isActive(pathName, '/admin/projects') ? 'active' : ''}`}>
              <span className="nav-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              My Projects
            </Link>

            <Link href="/admin/buyer-orders" className={`nav-item ${isActive(pathName, '/admin/buyer-orders') ? 'active' : ''}`}>
              <span className="nav-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </span>
              My Orders
              <NavBadge count={badges.ordersToConfirm} />
            </Link>

            <a href="/websites" className={`nav-item ${isActive(pathName, '/websites') ? 'active' : ''}`} target="_blank" rel="noopener noreferrer">
              <span className="nav-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </span>
              Browse Websites
            </a>
          </div>
        )}

        {/* PUBLISHER */}
        {activeMode === "publisher" && canPublish && (
          <div className="nav-section">
            <div className="nav-section-title">Publisher</div>

            <Link href="/admin/websites" className={`nav-item ${isActive(pathName, '/admin/websites') ? 'active' : ''}`}>
              <span className="nav-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                  <path d="M3 9h18"></path>
                  <path d="M9 21V9"></path>
                </svg>
              </span>
              My Websites
            </Link>

            <Link href="/admin/publisher-orders" className={`nav-item ${isActive(pathName, '/admin/publisher-orders') ? 'active' : ''}`}>
              <span className="nav-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </span>
              Orders Received
              <NavBadge count={badges.ordersToAccept} />
            </Link>
          </div>
        )}

        {/* ACCOUNT */}
        {!isAdmin && (
          <div className="nav-section">
            <div className="nav-section-title">Account</div>

            <Link href="/admin/settings" className={`nav-item ${isActive(pathName, '/admin/settings') ? 'active' : ''}`}>
              <span className="nav-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </span>
              Settings
            </Link>
          </div>
        )}

        {/* CONTENT + SETTINGS — admin only */}
        {isAdmin && (
          <>

            <div className="nav-section">
              <div className="nav-section-title">Content</div>

              <Link href="/admin/posts" className={`nav-item ${isActive(pathName, '/admin/posts') ? 'active' : ''}`}>
                <span className="nav-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </span>
                Posts
              </Link>

              <Link href="/admin/pages" className={`nav-item ${isActive(pathName, '/admin/pages') ? 'active' : ''}`}>
                <span className="nav-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </span>
                Pages
              </Link>

              <Link href="/admin/packages" className={`nav-item ${isActive(pathName, '/admin/packages') ? 'active' : ''}`}>
                <span className="nav-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </span>
                Packages
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-section-title">Settings</div>

              <Link href="/admin/settings" className={`nav-item ${isActive(pathName, '/admin/settings') ? 'active' : ''}`}>
                <span className="nav-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </span>
                Settings
              </Link>

              <Link href="/admin/payment-settings" className={`nav-item ${isActive(pathName, '/admin/payment-settings') ? 'active' : ''}`}>
                <span className="nav-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 11a2 2 0 0 1 0 4h-3v-4h3z"/>
                    <path d="M2 11h5"/>
                  </svg>
                </span>
                Payment Settings
              </Link>

              <Link href="/admin/appearance" className={`nav-item ${isActive(pathName, '/admin/appearance') ? 'active' : ''}`}>
                <span className="nav-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </span>
                Appearance
              </Link>

              <Link href="/admin/emails" className={`nav-item ${isActive(pathName, '/admin/emails') ? 'active' : ''}`}>
                <span className="nav-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                Emails
              </Link>
            </div>
          </>
        )}

      </nav>
   );
}
