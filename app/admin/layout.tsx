export const dynamic = 'force-dynamic'

import "./admin.css";
import AdminNav from "../../components/admin/AdminNav";
import ThemeSwitcher from "../../components/admin/ThemeSwitcher";
import UserDropdown from "../../components/admin/UserDropdown";
import RoleSelectionModal from "../../components/admin/RoleSelectionModal";
import WelcomeFlow from "../../components/admin/WelcomeFlow";
import SiteLogo from "../../components/layout/SiteLogo";
import { getCurrentUser } from "../lib/session";
import { getProjectsByBuyer } from "../lib/projects";
import { getSiteSettings } from "../lib/site-settings";
import { countOrders } from "../lib/orders";
import { countWebsitesNeedingReview } from "../lib/websites";
import { countUnread } from "../lib/inbox";
import { redirect } from "next/navigation"
import Link from "next/link"


import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    if (!user.hasSelectedRole) {
        return <RoleSelectionModal />
    }

    const userId = user._id!.toString()
    const settings = await getSiteSettings()
    const projects = user.canBuy ? await getProjectsByBuyer(userId) : []

    // Sidebar notification counts — things waiting for this user's action
    const [pendingOrders, websitesReview, ordersToAccept, ordersToConfirm, unreadMessages] = await Promise.all([
        user.isAdmin ? countOrders({ status: "pending" }) : 0,
        user.isAdmin ? countWebsitesNeedingReview() : 0,
        !user.isAdmin && user.canPublish ? countOrders({ status: "approved", publisherId: userId }) : 0,
        !user.isAdmin && user.canBuy ? countOrders({ status: "review", buyerId: userId }) : 0,
        countUnread(user.isAdmin ? "admin" : "user", user.isAdmin ? undefined : userId),
    ])
    const showProjectPrompt = user.canBuy 
    && user.activeMode !== "publisher" 
    && projects.length === 0 
    && !user.hasSeenProjectPrompt

    return (
     <div className="admin">
            <aside className="sidebar">
                <div className="sidebar-nav">
                    <div className="logo">
                        <SiteLogo
                            logoUrl={settings.logoUrl}
                            customSize={false}
                            maxHeight={40}
                            fallback={
                                <>
                                    <div className="logo-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="logo-text">Linkslandia</span>
                                        <span className="logo-subtitle">Link Building Platform</span>
                                    </div>
                                </>
                            }
                        />
                    </div>

                    <AdminNav
                        activeMode={user.activeMode}
                        canPublish={user.canPublish}
                        isAdmin={user.isAdmin}
                        canBuy={user.canBuy}
                        badges={{ pendingOrders, websitesReview, ordersToAccept, ordersToConfirm, unreadMessages }}
                    />
                </div>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{user.name}</span>
                            <span className="sidebar-user-email">{user.email}</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <header className="header">
                    <div>
                        <h1 id="page-title">Dashboard</h1>
                        <p className="header-subtitle">
                            Welcome back, {user.name} 👋
                        </p>
                    </div>
                    <div className="header-actions">
                        {!user.isAdmin && (
                            <div className="active-mode-badge" data-mode={user.activeMode}>
                                {user.activeMode === "buyer" ? "Buyer" : "Publisher"}
                            </div>
                        )}
                        <Link href="/admin/inbox" className="inbox-header-btn" title="Messages" aria-label="Messages">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            {unreadMessages > 0 && (
                                <span className="inbox-header-badge">{unreadMessages > 99 ? "99+" : unreadMessages}</span>
                            )}
                        </Link>
                        <ThemeSwitcher />
                        <div className="balance-pill">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                <rect x="2" y="7" width="20" height="14" rx="2"/>
                                <path d="M16 11a2 2 0 0 1 0 4h-3v-4h3z"/>
                                <path d="M2 11h5"/>
                            </svg>
                            ${(user.balance ?? 0).toFixed(2)}
                        </div>
                        <UserDropdown
                            name={user.name}
                            email={user.email}
                            balance={user.balance ?? 0}
                            activeMode={user.isAdmin ? undefined : user.activeMode}
                            canPublish={user.canPublish}
                            canBuy={user.canBuy}
                        />
                    </div>
                </header>
                <div className="main-inner">
                    {children}
                </div>
            </main>

            <WelcomeFlow userId={user._id!.toString()} canBuy={user.canBuy} showProjectPrompt={showProjectPrompt} hasSeenWelcomeBonus={!!user.hasSeenWelcomeBonus} />
    </div>

);

}
