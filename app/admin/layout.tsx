import "./admin.css";
import AdminNav from "../../components/admin/AdminNav";
import ModeSwitcher from "../../components/admin/ModeSwitcher";
import ThemeSwitcher from "../../components/admin/ThemeSwitcher";
import { getCurrentUser } from "../lib/session";
import { redirect } from "next/navigation"


import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    return (
     <div className="admin">
            <aside className="sidebar">
                <div className="logo">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                    </div>
                    <span className="logo-text">Linkslandiya</span>
                </div>

                       <AdminNav
                       activeMode={user.activeMode}
                       canPublish={user.canPublish}
                       isAdmin={user.isAdmin}
                       />

        </aside><main className="main-content">

                <header className="header" style={{ backgroundColor: "unset" }}>
                    <h1 id="page-title">Dashboard</h1>
                    <div className="header-actions">
                       {!user.isAdmin && (                                        
                       <ModeSwitcher activeMode={user.activeMode} 
                        canPublish={user.canPublish} />                            
                )}     
                        <ThemeSwitcher />
                        <div className="user-avatar">U</div>
                    </div>
                </header>
                {children}
            </main>
    </div>

);

}
