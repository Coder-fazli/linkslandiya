import { getAllOrders } from "@/app/lib/orders"
import { getUsersByIds } from "@/app/lib/user"
import { displayName } from "@/app/lib/format"
import { getCurrentUser } from "@/app/lib/session"
import { adminApproveOrderAction, adminRejectOrderAction } from "@/app/lib/actions"
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton"
import { redirect } from "next/navigation"
import Link from "next/link"
import { colors } from "@/app/lib/colors"

const TABS = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "in_progress", label: "In Progress" },
    { key: "review", label: "Review" },
    { key: "revision", label: "Revision" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
] as const

export default async function AllOrdersPage({ searchParams }: {
    searchParams: Promise<{ status?: string }>
}) {

    const user = await getCurrentUser()
    if (!user) return redirect("/login")
    if (!user.isAdmin) return redirect("/")

    const { status } = await searchParams
    const activeTab = TABS.some(t => t.key === status) ? status! : "all"

    const orders = await getAllOrders()
    const users = await getUsersByIds(orders.flatMap(o => [o.buyerId, o.publisherId]))
    const userById = new Map(users.map(u => [u._id!.toString(), u]))

    const counts: Record<string, number> = { all: orders.length }
    for (const t of TABS) {
        if (t.key !== "all") counts[t.key] = orders.filter(o => o.status === t.key).length
    }

    const filtered = activeTab === "all" ? orders : orders.filter(o => o.status === activeTab)

    const totalOrders = orders.length
    const pending = counts.pending
    const inProgress = counts.in_progress
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

            {/* Status filter tabs */}
            <div className="tabs" style={{ marginBottom: '16px', flexWrap: 'wrap' }}>
                {TABS.map(t => (
                    <Link
                        key={t.key}
                        href={t.key === "all" ? "/admin/all-orders" : `/admin/all-orders?status=${t.key}`}
                        className={`tab ${activeTab === t.key ? "active" : ""}`}
                        style={{ textDecoration: "none" }}
                    >
                        {t.label}
                        <span className="tab-count">{counts[t.key]}</span>
                    </Link>
                ))}
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
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={9} style={{ textAlign: "center", padding: "2rem" }}>
                                {activeTab === "all" ? "No orders yet." : `No ${activeTab.replace("_", " ")} orders.`}
                            </td>
                        </tr>
                    ) : (
                        filtered.map(order => (
                            <tr key={order._id?.toString()}>
                                <td>#{order._id?.toString().slice(-6).toUpperCase()}</td>
                                <td>{order.websiteName}</td>
                                <td style={{ fontSize: "0.8rem" }}>
                                    <span className="status-badge">
                                        {order.orderType.replace("_", " ")}
                                    </span>
                                </td>
                                <td style={{ fontSize: "0.85rem" }}>
                                    <Link href={`/admin/users/${order.buyerId}`}
                                        style={{ color: "var(--brand-primary)", textDecoration: "none", fontWeight: 500 }}>
                                        {displayName(userById.get(order.buyerId), order.buyerId)}
                                    </Link>
                                </td>
                                <td style={{ fontSize: "0.85rem" }}>
                                    <Link href={`/admin/users/${order.publisherId}`}
                                        style={{ color: "var(--brand-primary)", textDecoration: "none", fontWeight: 500 }}>
                                        {displayName(userById.get(order.publisherId), order.publisherId)}
                                    </Link>
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
                                                    <button type="submit" className="btn-approve" title="Approve — publisher will see the order">
                                                        Approve
                                                    </button>
                                                </form>
                                                <form action={adminRejectOrderAction.bind(null, order._id!.toString())}>
                                                    <ConfirmSubmitButton
                                                        className="btn-reject"
                                                        title="Reject — order cancelled, buyer refunded"
                                                        message={`Reject this order? It will be cancelled and $${order.amount} refunded to the buyer.`}
                                                    >
                                                        Reject
                                                    </ConfirmSubmitButton>
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
