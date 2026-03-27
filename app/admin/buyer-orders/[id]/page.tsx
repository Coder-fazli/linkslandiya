import { getOrderById } from "@/app/lib/orders"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import TipTapViewer from "@/components/admin/TipTapViewer"
import BuyerOrderActions from "@/components/admin/BuyerOrderActions"

export default async function BuyerOrderDetailPage({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    const order = await getOrderById(id)
    if (!order) return <div>Order not found</div>

    const statusLabel: Record<string, string> = {
        pending: "Pending",
        in_progress: "In Progress",
        review: "Under Review",
        revision: "Revision Requested",
        completed: "Completed",
        cancelled: "Cancelled",
    }

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
                    {statusLabel[order.status] ?? order.status}
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

                                {/* Step 1: Order Placed */}
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

                                {/* Step 2: Publisher working */}
                                <div className={`timeline-item ${
                                    ["review", "revision", "completed"].includes(order.status) ? "completed" :
                                    order.status === "in_progress" ? "active" : ""
                                }`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">Being Published</div>
                                        <div className="timeline-date">
                                            {order.status === "pending" ? "Waiting for publisher..." :
                                             order.status === "in_progress" ? "Publisher is working on it..." : "Done"}
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3: Under review / revision */}
                                <div className={`timeline-item ${
                                    order.status === "completed" ? "completed" :
                                    order.status === "review" ? "active" :
                                    order.status === "revision" ? "active" : ""
                                }`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">
                                            {order.status === "revision" ? "Revision in Progress" : "Your Review"}
                                        </div>
                                        <div className="timeline-date">
                                            {order.status === "review" ? "Please confirm the published link" :
                                             order.status === "revision" ? "Publisher is making changes..." :
                                             order.status === "completed" ? "Confirmed" : "Pending"}
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4: Completed */}
                                <div className={`timeline-item ${order.status === "completed" ? "completed" : ""}`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">Completed</div>
                                        <div className="timeline-date">
                                            {order.status === "completed" ? "Your post is live!" : "Pending"}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ============ Revision note sent — shown when status is 'revision' ============ */}
                    {order.status === "revision" && order.revisionNote && (
                        <div className="card" style={{ marginBottom: "1.25rem" }}>
                            <div className="card-header"><h3>Revision Request Sent</h3></div>
                            <div className="card-body">
                                <div style={{ padding: "14px 16px", background: "#fff7ed", borderRadius: "10px", border: "1px solid #fed7aa" }}>
                                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#c2410c", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Your note to the publisher</div>
                                    <p style={{ margin: 0, fontSize: "14px", color: "#9a3412", lineHeight: 1.6 }}>{order.revisionNote}</p>
                                </div>
                            </div>
                        </div>
                    )}

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
                                <TipTapViewer content={order.content || '<p>No content provided.</p>'} />
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

                    {/* Review Published Link — top of sidebar when status is review */}
                    {order.status === "review" && order.publishedLink && (
                        <BuyerOrderActions orderId={id} publishedLink={order.publishedLink} />
                    )}

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
                            {order.status !== "completed" && (
                                <p style={{ margin: "10px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                                    Funds are held and released to publisher upon your confirmation
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Published Link card — shown for review/completed */}
                    {order.publishedLink && order.status === "completed" && (
                        <div className="card" style={{ marginBottom: "1.25rem" }}>
                            <div className="card-header">
                                <h3>Published Link</h3>
                            </div>
                            <div className="card-body">
                                <a
                                    href={order.publishedLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#818cf8", wordBreak: "break-all", fontSize: "0.9rem" }}
                                >
                                    {order.publishedLink}
                                </a>
                            </div>
                        </div>
                    )}

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
