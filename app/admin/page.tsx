import { getCurrentUser } from "../lib/session"
import { redirect } from "next/navigation"
import { getOrdersByBuyer, getOrdersByPublisher } from "../lib/orders"
import Link from "next/link"

export default async function AdminHome() {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")

  const isPublisher = user.activeMode === "publisher"
  const uid = user._id.toString()

  const orders = isPublisher
    ? await getOrdersByPublisher(uid)
    : await getOrdersByBuyer(uid)

  const totalOrders  = orders.length
  const pending      = orders.filter(o => o.status === "pending").length
  const inProgress   = orders.filter(o => o.status === "in_progress").length
  const completed    = orders.filter(o => o.status === "completed").length
  const cancelled    = orders.filter(o => o.status === "cancelled").length
  const totalMoney   = orders.reduce((sum, o) => sum + o.amount, 0)

  const pct = (n: number) => totalOrders === 0 ? 0 : Math.round((n / totalOrders) * 100)

  const recentOrders = orders.slice(0, 5)

  return (
    <div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid">

        {isPublisher ? (
          <>
            <div className="stat-card stat-card-blue">
              <div className="stat-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18"/><path d="M9 21V9"/>
                </svg>
              </div>
              <div className="stat-card-label">Total Orders</div>
              <div className="stat-card-value">{totalOrders}</div>
              <span className="stat-card-badge">📦 All time</span>
            </div>

            <div className="stat-card stat-card-yellow">
              <div className="stat-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="stat-card-label">Pending Orders</div>
              <div className="stat-card-value">{pending}</div>
              <span className="stat-card-badge">⏳ Need action</span>
            </div>

            <div className="stat-card stat-card-green">
              <div className="stat-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="stat-card-label">Completed</div>
              <div className="stat-card-value">{completed}</div>
              <span className="stat-card-badge">✅ Done</span>
            </div>

            <div className="stat-card stat-card-purple">
              <div className="stat-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="stat-card-label">Total Earned</div>
              <div className="stat-card-value">${totalMoney}</div>
              <span className="stat-card-badge">💰 All time</span>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card stat-card-blue">
              <div className="stat-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div className="stat-card-label">Total Orders</div>
              <div className="stat-card-value">{totalOrders}</div>
              <span className="stat-card-badge">📦 All time</span>
            </div>

            <div className="stat-card stat-card-yellow">
              <div className="stat-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="stat-card-label">Pending</div>
              <div className="stat-card-value">{pending}</div>
              <span className="stat-card-badge">⏳ Awaiting publisher</span>
            </div>

            <div className="stat-card stat-card-green">
              <div className="stat-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="stat-card-label">Completed</div>
              <div className="stat-card-value">{completed}</div>
              <span className="stat-card-badge">✅ Done</span>
            </div>

            <div className="stat-card stat-card-purple">
              <div className="stat-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="stat-card-label">Total Spent</div>
              <div className="stat-card-value">${totalMoney}</div>
              <span className="stat-card-badge">💳 All time</span>
            </div>
          </>
        )}

      </div>

      {/* ── Bottom Grid ── */}
      <div className="dashboard-grid">

        {/* Left 2/3 */}
        <div>
          <div className="dashboard-section-header">
            <h2>{isPublisher ? "Recent Orders Received" : "Recent Orders"}</h2>
            <a href={isPublisher ? "/admin/publisher-orders" : "/admin/buyer-orders"}>View all →</a>
          </div>

          <div className="order-row-headers">
            <div>Website</div>
            <div style={{ textAlign: "center" }}>DA</div>
            <div style={{ textAlign: "right" }}>Price</div>
            <div>Date</div>
            <div>Status</div>
          </div>

          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {isPublisher ? (
                <p>No orders received yet — <a href="/admin/websites" style={{ color: "var(--accent)" }}>add your websites</a> to start receiving orders.</p>
              ) : (
                <p>No orders yet — <a href="/websites" style={{ color: "var(--accent)" }}>browse websites</a> to place your first order.</p>
              )}
            </div>
          ) : (
            recentOrders.map(order => (
              <Link key={order._id} href={isPublisher ? `/admin/publisher-orders/${order._id}` : `/admin/buyer-orders/${order._id}`} className="order-row">
                <div>{order.websiteName}</div>
                <div style={{ textAlign: "center" }}>—</div>
                <div style={{ textAlign: "right" }}>${order.amount}</div>
                <div>{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                <div>
                  <span className={`status-badge ${order.status.replace("_", "-")}`}>
                    {order.status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Right 1/3 */}
        <div className="dashboard-right">

          {/* Quick Actions */}
          <div className="quick-actions-card">
            <h2>Quick Actions</h2>
            {isPublisher ? (
              <>
                <a href="/admin/websites/new" className="btn-browse">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  Add New Website
                </a>
                <a href="/admin/publisher-orders" className="btn-view-orders">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  View Orders Received
                </a>
              </>
            ) : (
              <>
                <a href="/websites" className="btn-browse" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Browse Websites
                </a>
                <a href="/admin/buyer-orders" className="btn-view-orders">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  View All Orders
                </a>
              </>
            )}
          </div>

          {/* Breakdown */}
          <div className="breakdown-card">
            <h2>{isPublisher ? "Orders Breakdown" : "Order Breakdown"}</h2>
            <div className="breakdown-list">
              <div className="breakdown-row">
                <div className="breakdown-row-header">
                  <span className="breakdown-row-label">Completed</span>
                  <span className="breakdown-row-badge" style={{ background: "#f0fdf4", color: "#16a34a" }}>{completed} · {pct(completed)}%</span>
                </div>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: `${pct(completed)}%`, background: "#4ade80" }}></div>
                </div>
              </div>
              <div className="breakdown-row">
                <div className="breakdown-row-header">
                  <span className="breakdown-row-label">Pending</span>
                  <span className="breakdown-row-badge" style={{ background: "#fffbeb", color: "#d97706" }}>{pending} · {pct(pending)}%</span>
                </div>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: `${pct(pending)}%`, background: "#fbbf24" }}></div>
                </div>
              </div>
              <div className="breakdown-row">
                <div className="breakdown-row-header">
                  <span className="breakdown-row-label">Cancelled</span>
                  <span className="breakdown-row-badge" style={{ background: "#fef2f2", color: "#dc2626" }}>{cancelled} · {pct(cancelled)}%</span>
                </div>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: `${pct(cancelled)}%`, background: "#f87171" }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
