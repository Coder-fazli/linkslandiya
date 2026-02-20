import { getOrdersByPublisher } from "@/app/lib/orders"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function PublisherOrdersPage(){

    // Check who is logged in
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    // Get only orders where THIS user is the publisher (orders received from buyers)
    const orders = await getOrdersByPublisher(user._id.toString())

    return (
        <div className="section-content active" id="section-orders">

            {/* Orders list wrapped in a card with a table — same structure as dashboard.html */}
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

                        {/* If no orders, show empty message */}
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                                    No orders received yet.
                                </td>
                            </tr>
                        ) : (
                            /* Loop through each order and create a table row */
                            orders.map(order => (
                                <tr key={order._id}>

                                    {/* Order ID: show last 6 characters of the MongoDB _id */}
                                    <td>#{order._id?.toString().slice(-6).toUpperCase()}</td>

                                    {/* Website ID — later we can show the website name */}
                                    <td>{order.websiteName}</td>

                                    {/* The article title the buyer wants */}
                                    <td>{order.title}</td>

                                    {/* How much the buyer is paying */}
                                    <td>${order.amount}</td>

                                    {/* Date the order was created, formatted like "Jan 15, 2026" */}
                                    <td>{new Date(order.createdAt).toLocaleDateString("en-US", {
                                        month: "short", day: "numeric", year: "numeric"
                                    })}</td>

                                    {/* Status badge — converts "in_progress" to "in-progress" for CSS */}
                                    <td>
                                        <span className={`status-badge ${order.status.replace("_", "-")}`}>
                                            {order.status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                                        </span>
                                    </td>

                                    {/* View button — links to order detail page */}
                                    <td>
                                        <div className="action-btns">
                                            <Link href={`/admin/publisher-orders/${order._id}`} className="action-btn view">
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
