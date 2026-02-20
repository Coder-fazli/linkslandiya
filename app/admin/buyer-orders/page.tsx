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

    return (
        <div className="section-content active" id="section-orders">

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

                        {/* If no orders, show a message with a link to browse websites */}
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                                    No orders yet. <a href="/websites">Browse websites</a> to place your first order.
                                </td>
                            </tr>
                        ) : (
                            orders.map(order => (
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
                            ))
                        )}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
