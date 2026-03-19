export default function AdminHome() {
  return (
    <div>

      {/* Stat Cards */}
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
          <span className="stat-card-badge">⏳ Awaiting</span>
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

    </div>
  );
}
