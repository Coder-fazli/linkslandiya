import "./admin.css";
import AdminNav from "../../components/admin/AdminNav";
import ModeSwitcher from "../../components/admin/ModeSwitcher";
import ThemeSwitcher from "../../components/admin/ThemeSwitcher";
import UserDropdown from "../../components/admin/UserDropdown";
import { getCurrentUser } from "../lib/session";
import { redirect } from "next/navigation"

import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    return (
     <div className="admin">
            <aside className="sidebar">
                <div className="sidebar-nav">
                    <div className="logo">
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
                            <ModeSwitcher activeMode={user.activeMode} canPublish={user.canPublish} />
                        )}
                        <ThemeSwitcher />
                        <UserDropdown name={user.name} email={user.email} />
                    </div>
                </header>
                <div className="main-inner">
                    {children}
                </div>
            </main>
    </div>

);

}
