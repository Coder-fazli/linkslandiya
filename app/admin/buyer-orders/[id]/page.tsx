import { getOrderById } from "@/app/lib/orders"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function BuyerOrderDetailPage({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    const order = await getOrderById(id)
    if (!order) return <div>Order not found</div>

    return (
        <div className="section-content active">

            {/* Back link */}
            <Link href="/admin/buyer-orders" className="back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to My Orders
            </Link>

            {/* Header */}
            <div className="edit-header">
                <h2>Order #{id.slice(-6).toUpperCase()}</h2>
                <span className={`status-badge ${order.status.replace("_", "-")}`}>
                    {order.status.replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </span>
            </div>

            {/* Two-column layout */}
            <div className="order-detail-grid">
                <div className="order-main">

                    {/* ============ Card 1: Order Timeline ============ */}
                    <div className="card" style={{ marginBottom: "1.25rem" }}>
                        <div className="card-header">
                            <h3>Order Progress</h3>
                        </div>
                        <div className="card-body">
                            <div className="order-timeline">

                                {/* Step 1: Order Placed — always completed */}
                                <div className={`timeline-item ${order.status !== "cancelled" ? "completed" : ""}`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">Order Placed</div>
                                        <div className="timeline-date">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                month: "short", day: "numeric", year: "numeric"
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2: Publisher working on it */}
                                <div className={`timeline-item ${
                                    order.status === "completed" ? "completed" :
                                    order.status === "in_progress" ? "active" : ""
                                }`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">Content Being Written</div>
                                        <div className="timeline-date">
                                            {order.status === "pending" ? "Waiting for publisher..." :
                                             order.status === "in_progress" ? "Publisher is working on it..." : "Done"}
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3: Published */}
                                <div className={`timeline-item ${order.status === "completed" ? "completed" : ""}`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">Published</div>
                                        <div className="timeline-date">
                                            {order.status === "completed" ? "Your post is live!" : "Pending"}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ============ Card 2: What you submitted ============ */}
                    <div className="card" style={{ marginBottom: "1.25rem" }}>
                        <div className="card-header">
                            <h3>Your Submission</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label className="form-label">Article Title</label>
                                <input type="text" className="form-input" value={order.title} readOnly />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Target URL</label>
                                    <input type="text" className="form-input" value={order.targetUrl} readOnly />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Anchor Text</label>
                                    <input type="text" className="form-input" value={order.anchorText} readOnly />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Article Content</label>
                                <textarea className="form-textarea" readOnly style={{ minHeight: "200px" }} defaultValue={order.content || "No content provided"} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Special Instructions</label>
                                <textarea className="form-textarea" readOnly style={{ minHeight: "100px" }} defaultValue={order.instructions || "No instructions provided"} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* ============ Sidebar ============ */}
                <div className="order-sidebar">

                    {/* Payment card */}
                    <div className="card" style={{ marginBottom: "1.25rem" }}>
                        <div className="card-header">
                            <h3>Payment</h3>
                        </div>
                        <div className="card-body">
                            <div className="payment-row total">
                                <span>Amount Paid</span>
                                <span>${order.amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Info card */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Order Info</h3>
                        </div>
                        <div className="card-body">
                            <div className="detail-row" style={{ flexDirection: "column", gap: "0.75rem" }}>
                                <div className="detail-item">
                                    <div className="detail-label">Website</div>
                                    <div className="detail-value">{order.websiteName || order.websiteId}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Order Date</div>
                                    <div className="detail-value">
                                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                                            month: "short", day: "numeric", year: "numeric"
                                        })}
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Order ID</div>
                                    <div className="detail-value" style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                        {id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}
