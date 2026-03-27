import { getOrderById } from "@/app/lib/orders"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import OrderStatusUpdated from "@/components/admin/OrderStatusUpdater"
import ContentCopyPanel from "@/components/admin/ContentCopyPanel"
import PublisherUpload from "@/components/admin/PublisherUpload"

export default async function OrderDetailPage({ params }: {
    params: Promise<{ id: string }>
}) {
    // Get the order ID from the URL
    const { id } = await params

    // Check who is logged in
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    // Fetch the order from database
    const order = await getOrderById(id)
    if (!order) return <div>Order not found</div>

    return (
        <div className="section-content active">

            {/* Back link — takes publisher back to orders list */}
            <Link href="/admin/publisher-orders" className="back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Orders
            </Link>

            {/* Header — Order ID, website, status */}
            <div className="edit-header">
                <div>
                    <h2 style={{ margin: 0 }}>Order #{id.slice(-6).toUpperCase()}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" width="14" height="14">
                            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        <a href={order.websiteUrl || `https://${order.websiteName}`} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: "13px", color: "var(--brand-primary)", textDecoration: "none", fontWeight: 500 }}>
                            {order.websiteUrl || order.websiteName}
                        </a>
                    </div>
                </div>
                <span className={`status-badge ${order.status.replace("_", "-")}`}>
                    {order.status.replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </span>
            </div>

            {/* Two-column layout: main content on left, sidebar on right */}
            <div className="order-detail-grid">
                <div className="order-main">

                    {/* ============ Card 1: Order Status + Timeline ============ */}
                    <div className="card" style={{ marginBottom: "1.25rem" }}>
                        <div className="card-header">
                            <h3>Order Status</h3>
                            <span className={`status-badge ${order.status.replace("_", "-")}`}>
                                {order.status.replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="order-timeline">

                                {/* Step 1: Order Placed — always completed unless cancelled */}
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

                                {/* Step 2: In Progress */}
                                <div className={`timeline-item ${
                                    ["review", "revision", "completed"].includes(order.status) ? "completed" :
                                    order.status === "in_progress" ? "active" : ""
                                }`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">Work in Progress</div>
                                        <div className="timeline-date">
                                            {order.status === "pending" ? "Waiting to accept..." :
                                             order.status === "in_progress" ? "Working on it..." : "Done"}
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3: Submitted for review */}
                                <div className={`timeline-item ${
                                    order.status === "completed" ? "completed" :
                                    order.status === "review" ? "active" :
                                    order.status === "revision" ? "active" : ""
                                }`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">
                                            {order.status === "revision" ? "Revision Requested" : "Awaiting Buyer Confirmation"}
                                        </div>
                                        <div className="timeline-date">
                                            {order.status === "review" ? "Waiting for buyer to confirm..." :
                                             order.status === "revision" ? "Fix and resubmit" :
                                             order.status === "completed" ? "Buyer confirmed" : "Pending"}
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4: Completed */}
                                <div className={`timeline-item ${order.status === "completed" ? "completed" : ""}`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">Completed & Paid</div>
                                        <div className="timeline-date">
                                            {order.status === "completed" ? "Payment released!" : "Pending confirmation"}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ============ Card 2: Customer Requirements (read-only) ============ */}
                    <div className="card" style={{ marginBottom: "1.25rem" }}>
                        <div className="card-header">
                            <h3>Customer Requirements</h3>
                        </div>
                        <div className="card-body">
                            <ContentCopyPanel
                                orderType={order.orderType}
                                title={order.title}
                                content={order.content || ''}
                                targetUrl={order.targetUrl}
                                anchorText={order.anchorText}
                                existingPostUrl={order.existingPostUrl}
                                landingPageUrl={order.landingPageUrl}
                                hasAttachment={!!order.attachmentUrl}
                            />

                            {/* Buyer uploaded a file — show download link */}
                            {order.attachmentUrl && (
                                <div style={{ margin: "1rem 0 0", padding: "12px 16px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" width="22" height="22">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                    </svg>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#1d4ed8", marginBottom: "2px" }}>Article file provided by buyer</div>
                                        <a href={order.attachmentUrl} target="_blank" rel="noopener noreferrer"
                                            style={{ fontSize: "13px", color: "#3b82f6", fontWeight: 500 }}>
                                            {order.attachmentName || "Download file"}
                                        </a>
                                    </div>
                                    <a href={order.attachmentUrl} download style={{ padding: "6px 14px", background: "#3b82f6", color: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                                        Download
                                    </a>
                                </div>
                            )}

                            <div className="form-group" style={{ marginBottom: 0, marginTop: '1rem' }}>
                                <label className="form-label">Special Instructions</label>
                                <textarea className="form-textarea" readOnly style={{ minHeight: "100px" }} defaultValue={order.instructions || "No instructions provided"} />
                            </div>
                        </div>
                    </div>

                    {/* ============ Card 3: Publisher uploads article (when buyer chose "get content from us") ============ */}
                    {order.orderType !== 'link_insertion' && (order.contentMode === 'get' || (!order.content && !order.attachmentUrl)) && (
                        <PublisherUpload
                            orderId={id}
                            existingFileUrl={order.publisherFileUrl}
                            existingFileName={order.publisherFileName}
                        />
                    )}

                </div>

                {/* ============ Sidebar ============ */}
                <div className="order-sidebar">

                    {/* Update Status — publisher can change order status */}
                    <OrderStatusUpdated
                    orderId={id}
                    currentStatus={order.status}
                    currentLink={order.publishedLink}
                    websiteName={order.websiteUrl || order.websiteName}
                    revisionNote={order.revisionNote}
                    />

                    {/* Card 3: Payment */}
                    <div className="card" style={{ marginBottom: "1.25rem" }}>
                        <div className="card-header">
                            <h3>Payment</h3>
                        </div>
                        <div className="card-body">
                            <div className="payment-row total">
                                <span>Amount</span>
                                <span>${order.amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Order Info */}
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
