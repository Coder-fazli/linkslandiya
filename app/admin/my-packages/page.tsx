export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/lib/session"
import { getPackageOrdersByBuyer } from "@/app/lib/package-orders"

export default async function MyPackagesPage() {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    const orders = await getPackageOrdersByBuyer(user._id!.toString())

    return (
        <div className="section-content active">
            <div className="section-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div>
                    <h1 className="section-title">My Packages</h1>
                    <p className="section-subtitle">Packages you&apos;ve requested from Linkslandia</p>
                </div>
                <Link href="/packages" className="btn btn-primary" style={{ textDecoration: "none" }}>
                    Browse Packages
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="card" style={{ padding: "48px", textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🎁</div>
                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No package requests yet</div>
                    <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
                        Browse our packages and request one — our team will follow up with you.
                    </p>
                    <Link href="/packages" className="btn btn-primary" style={{ textDecoration: "none" }}>
                        Browse Packages
                    </Link>
                </div>
            ) : (
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Package</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Requested</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => {
                                const id = o._id!.toString()
                                return (
                                    <tr key={id}>
                                        <td style={{ fontWeight: 600 }}>{o.packageName}</td>
                                        <td>${o.packagePrice}/mo</td>
                                        <td>
                                            <span className={`status-badge ${o.status === "confirmed" ? "completed" : o.status === "cancelled" ? "rejected" : "pending"}`}>
                                                {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>{new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                                        <td>
                                            {o.conversationId && (
                                                <Link href={`/admin/inbox/${o.conversationId}`} className="action-btn view" title="View conversation">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                        <polyline points="22,6 12,13 2,6"></polyline>
                                                    </svg>
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
