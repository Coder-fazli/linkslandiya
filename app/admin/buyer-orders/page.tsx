import { getOrdersByBuyer } from "@/app/lib/orders"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function BuyerOrdersPage(){

    // Check who is logged in
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    // Get only orders where THIS user is the buyer (orders I placed)
    const orders = await getOrdersByBuyer(user._id.toString())
    const totalOrders = orders.length
    const pendign = orders.filter(o => o.status === "pending").length
    const inProgress = orders.filter(o => o.status === "in_progress").length
    const completed  = orders.filter(o => o.status === "completed").length                          
    const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0) 

    return (
        <div className="section-content active" id="section-orders">

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Total Orders</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a' }}>{totalOrders}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>📦 All time</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Pending</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>{pendign}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>⏳ Awaiting publisher</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Completed</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#22c55e' }}>{completed}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>✅ Done</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Total Spent</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#2563eb' }}>${totalSpent}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>💳 Lifetime</div>
                </div>
            </div>

            {/* Orders */}
            {orders.length === 0 ? (
                <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>No orders yet</div>
                    <div style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Browse websites to place your first order.</div>
                    <Link href="/websites" style={{
                        display: 'inline-block', background: '#2563eb', color: '#fff',
                        padding: '10px 24px', borderRadius: 9999, fontWeight: 600, fontSize: 14, textDecoration: 'none'
                    }}>
                        Browse Websites
                    </Link>
                </div>
            ) : (
                <div id="orders-list">
                    <div className="card">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Website</th>
                                    <th>Title</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>#{order._id?.toString().slice(-6).toUpperCase()}</td>
                                    <td>{order.websiteName}</td>
                                    <td>{order.title}</td>
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
                                        <div className="action-btns">
                                            <Link href={`/admin/buyer-orders/${order._id}`} className="action-btn view">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
