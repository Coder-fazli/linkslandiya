import { getAllOrders } from "@/app/lib/orders"
import { getCurrentUser } from "@/app/lib/session"
import { adminApproveOrderAction, adminRejectOrderAction } from "@/app/lib/actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import { colors } from "@/app/lib/colors"

export default async function AllOrdersPage() {

    const user = await getCurrentUser()
    if (!user) return redirect("/login")
    if (!user.isAdmin) return redirect("/")

    const orders = await getAllOrders()

    const totalOrders = orders.length
    const pending = orders.filter(o => o.status === "pending").length
    const inProgress = orders.filter(o => o.status === "in_progress").length
    const completed = orders.filter(o => o.status === "completed").length
    const totalRevenue = orders.filter(o => o.status === "completed").reduce((sum, o) => sum + o.amount, 0)

    return (
        <div className="section-content active">

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Total Orders</div>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>{totalOrders}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Awaiting Your Approval</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>{pending}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>In Progress</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>{inProgress}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Revenue (completed)</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: colors.primary }}>${totalRevenue}</div>
                </div>
            </div>

            {/* Orders table */}
            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Website</th>
                            <th>Type</th>
                            <th>Buyer</th>
                            <th>Publisher</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={9} style={{ textAlign: "center", padding: "2rem" }}>No orders yet.</td>
                        </tr>
                    ) : (
                        orders.map(order => (
                            <tr key={order._id}>
                                <td>#{order._id?.toString().slice(-6).toUpperCase()}</td>
                                <td>{order.websiteName}</td>
                                <td style={{ fontSize: "0.8rem" }}>
                                    <span className="status-badge">
                                        {order.orderType.replace("_", " ")}
                                    </span>
                                </td>
                                <td style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                    {order.buyerId.slice(-6)}
                                </td>
                                <td style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                    {order.publisherId.slice(-6)}
                                </td>
                                <td>${order.amount}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric"
                                })}</td>
                                <td>
                                    <span className={`status-badge ${order.status.replace("_", "-")}`}>
                                        {order.status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Link href={`/admin/buyer-orders/${order._id}`} className="action-btn view" title="View">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </Link>
                                        {order.status === "pending" && (
                                            <>
                                                <form action={adminApproveOrderAction.bind(null, order._id!.toString())}>
                                                    <button type="submit" title="Approve — publisher will see the order" style={{
                                                        padding: "5px 12px", background: "rgba(34,197,94,0.1)", color: "#16a34a",
                                                        border: "1px solid rgba(34,197,94,0.35)", borderRadius: "7px",
                                                        fontSize: "12px", fontWeight: 700, cursor: "pointer",
                                                    }}>
                                                        Approve
                                                    </button>
                                                </form>
                                                <form action={adminRejectOrderAction.bind(null, order._id!.toString())}>
                                                    <button type="submit" title="Reject — order cancelled, buyer refunded" style={{
                                                        padding: "5px 12px", background: "rgba(239,68,68,0.08)", color: "#dc2626",
                                                        border: "1px solid rgba(239,68,68,0.3)", borderRadius: "7px",
                                                        fontSize: "12px", fontWeight: 700, cursor: "pointer",
                                                    }}>
                                                        Reject
                                                    </button>
                                                </form>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}
