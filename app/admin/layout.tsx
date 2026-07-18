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
import { redirect } from "next/navigation"


import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    if (!user.hasSelectedRole) {
        return <RoleSelectionModal />
    }

    const settings = await getSiteSettings()
    const projects = user.canBuy ? await getProjectsByBuyer(user._id!.toString()) : []
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
                            logoWidth={settings.logoWidth}
                            logoHeight={settings.logoHeight}
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
