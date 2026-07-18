export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/lib/session"
import { getAllPackageOrders } from "@/app/lib/package-orders"
import { getUsersByIds } from "@/app/lib/user"
import { displayName } from "@/app/lib/format"
import { adminConfirmPackageOrderAction, adminCancelPackageOrderAction } from "@/app/lib/package-orders-actions"
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton"

export default async function PackageOrdersPage() {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return redirect("/")

    const orders = await getAllPackageOrders()
    const users = await getUsersByIds(orders.map(o => o.buyerId))
    const userById = new Map(users.map(u => [u._id!.toString(), u]))

    const pending = orders.filter(o => o.status === "pending").length

    return (
        <div className="section-content active">
            <div className="section-header">
                <h1 className="section-title">Package Orders</h1>
                <p className="section-subtitle">Requests for pricing packages — separate from item-level guest post orders</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Total Requests</div>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>{orders.length}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Awaiting Follow-Up</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>{pending}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Confirmed</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#22c55e' }}>{orders.filter(o => o.status === "confirmed").length}</div>
                </div>
            </div>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Buyer</th>
                            <th>Package</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>No package requests yet.</td></tr>
                        ) : (
                            orders.map(o => {
                                const id = o._id!.toString()
                                return (
                                    <tr key={id}>
                                        <td>
                                            <Link href={`/admin/users/${o.buyerId}`}
                                                style={{ color: "var(--brand-primary)", textDecoration: "none", fontWeight: 600 }}>
                                                {displayName(userById.get(o.buyerId), o.buyerId)}
                                            </Link>
                                        </td>
                                        <td>{o.packageName}</td>
                                        <td>${o.packagePrice}/mo</td>
                                        <td>
                                            <span className={`status-badge ${o.status === "confirmed" ? "completed" : o.status === "cancelled" ? "rejected" : "pending"}`}>
                                                {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>{new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                {o.conversationId && (
                                                    <Link href={`/admin/inbox/${o.conversationId}`} className="action-btn view" title="View conversation">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                            <polyline points="22,6 12,13 2,6"></polyline>
                                                        </svg>
                                                    </Link>
                                                )}
                                                {o.status === "pending" && (
                                                    <>
                                                        <form action={adminConfirmPackageOrderAction.bind(null, id)}>
                                                            <button type="submit" className="btn-approve" title="Confirm">Confirm</button>
                                                        </form>
                                                        <form action={adminCancelPackageOrderAction.bind(null, id)}>
                                                            <ConfirmSubmitButton className="btn-reject" message={`Cancel this package request for ${o.packageName}?`}>
                                                                Cancel
                                                            </ConfirmSubmitButton>
                                                        </form>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
