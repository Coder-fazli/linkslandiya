export default function AdminHome() {
  return (
    <div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid">

        <div className="stat-card stat-card-blue">
          <div className="stat-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <div className="stat-card-label">Total Orders</div>
          <div className="stat-card-value">—</div>
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
          <div className="stat-card-value">—</div>
          <span className="stat-card-badge">⏳ Awaiting publisher</span>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="stat-card-label">Completed</div>
          <div className="stat-card-value">—</div>
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
          <div className="stat-card-value">—</div>
          <span className="stat-card-badge">💳 All time</span>
        </div>

      </div>

      {/* ── Bottom Grid ── */}
      <div className="dashboard-grid">

        {/* Recent Orders — left 2/3 */}
        <div>
          <div className="dashboard-section-header">
            <h2>Recent Orders</h2>
            <a href="/admin/buyer-orders">View all →</a>
          </div>

          <div className="order-row-headers">
            <div>Website</div>
            <div style={{ textAlign: "center" }}>DA</div>
            <div style={{ textAlign: "right" }}>Price</div>
            <div>Date</div>
            <div>Status</div>
          </div>

          {/* Placeholder — replace with real orders from DB later */}
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <p>No orders yet — <a href="/websites" style={{ color: "var(--accent)" }}>browse websites</a> to place your first order.</p>
          </div>
        </div>

        {/* Right column — 1/3 */}
        <div className="dashboard-right">

          {/* Quick Actions */}
          <div className="quick-actions-card">
            <h2>Quick Actions</h2>
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
          </div>

          {/* Order Breakdown — placeholder */}
          <div className="breakdown-card">
            <h2>Order Breakdown</h2>
            <div className="breakdown-list">
              <div className="breakdown-row">
                <div className="breakdown-row-header">
                  <span className="breakdown-row-label">Completed</span>
                  <span className="breakdown-row-badge" style={{ background: "#f0fdf4", color: "#16a34a" }}>— · —%</span>
                </div>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: "0%", background: "#4ade80" }}></div>
                </div>
              </div>
              <div className="breakdown-row">
                <div className="breakdown-row-header">
                  <span className="breakdown-row-label">Pending</span>
                  <span className="breakdown-row-badge" style={{ background: "#fffbeb", color: "#d97706" }}>— · —%</span>
                </div>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: "0%", background: "#fbbf24" }}></div>
                </div>
              </div>
              <div className="breakdown-row">
                <div className="breakdown-row-header">
                  <span className="breakdown-row-label">Rejected</span>
                  <span className="breakdown-row-badge" style={{ background: "#fef2f2", color: "#dc2626" }}>— · —%</span>
                </div>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: "0%", background: "#f87171" }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
