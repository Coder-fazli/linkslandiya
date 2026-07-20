import { getAllUsers, User } from "@/app/lib/user"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import UserAvatar from "@/components/admin/UserAvatar"

const ROLE_TABS = [
    { key: "all", label: "All" },
    { key: "buyer", label: "Buyers" },
    { key: "publisher", label: "Publishers" },
    { key: "both", label: "Buyer + Publisher" },
    { key: "admin", label: "Admins" },
] as const

function matchesRole(user: User, role: string): boolean {
    switch (role) {
        case "buyer": return !user.isAdmin && user.canBuy && !user.canPublish
        case "publisher": return !user.isAdmin && user.canPublish && !user.canBuy
        case "both": return !user.isAdmin && user.canBuy && user.canPublish
        case "admin": return user.isAdmin
        default: return true
    }
}

export default async function UsersPage({ searchParams }: {
    searchParams: Promise<{ role?: string; dateFrom?: string; dateTo?: string }>
}) {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return redirect("/")

    const { role, dateFrom, dateTo } = await searchParams
    const activeTab = ROLE_TABS.some(t => t.key === role) ? role! : "all"

    const users = await getAllUsers()
    const counts: Record<string, number> = {}
    for (const t of ROLE_TABS) counts[t.key] = users.filter(u => matchesRole(u, t.key)).length

    const fromDate = dateFrom ? new Date(dateFrom) : null
    // Include the entire "to" day, not just midnight
    const toDate = dateTo ? new Date(new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1) : null

    const filtered = users
        .filter(u => matchesRole(u, activeTab))
        .filter(u => !fromDate || new Date(u.createdAt) >= fromDate)
        .filter(u => !toDate || new Date(u.createdAt) <= toDate)

    const roleQuery = activeTab !== "all" ? `role=${activeTab}` : ""

    return (
        <div className="section-content active">
            <div className="section-header">
                <h1 className="section-title">Users</h1>
                <p className="section-subtitle">All registered users on the platform</p>
            </div>

            {/* Role filter tabs */}
            <div className="tabs" style={{ marginBottom: '16px', flexWrap: 'wrap' }}>
                {ROLE_TABS.map(t => {
                    const params = new URLSearchParams()
                    if (t.key !== "all") params.set("role", t.key)
                    if (dateFrom) params.set("dateFrom", dateFrom)
                    if (dateTo) params.set("dateTo", dateTo)
                    const qs = params.toString()
                    return (
                        <Link
                            key={t.key}
                            href={qs ? `/admin/users?${qs}` : "/admin/users"}
                            className={`tab ${activeTab === t.key ? "active" : ""}`}
                            style={{ textDecoration: "none" }}
                        >
                            {t.label}
                            <span className="tab-count">{counts[t.key]}</span>
                        </Link>
                    )
                })}
            </div>

            {/* Registration date filter */}
            <form method="get" className="card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap', padding: '16px', marginBottom: '16px' }}>
                {activeTab !== "all" && <input type="hidden" name="role" value={activeTab} />}
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Joined From</label>
                    <input type="date" name="dateFrom" className="form-input" defaultValue={dateFrom ?? ""} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Joined To</label>
                    <input type="date" name="dateTo" className="form-input" defaultValue={dateTo ?? ""} />
                </div>
                <button type="submit" className="btn btn-secondary">Apply</button>
                {(dateFrom || dateTo) && (
                    <Link href={roleQuery ? `/admin/users?${roleQuery}` : "/admin/users"} className="btn btn-secondary" style={{ textDecoration: "none" }}>
                        Clear Dates
                    </Link>
                )}
            </form>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Balance</th>
                            <th>Role</th>
                            <th>Mode</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                                    No users in this category.
                                </td>
                            </tr>
                        ) : (
                        filtered.map(user => (
                            <tr key={user._id?.toString()} style={{ cursor: "pointer" }}>
                                <td>
                                    <Link href={`/admin/users/${user._id?.toString()}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                        <div className="user-cell">
                                            <UserAvatar avatarUrl={user.avatarUrl} name={user.name} className="user-cell-avatar" />
                                            <span className="user-cell-name">{user.name}</span>
                                        </div>
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`/admin/users/${user._id?.toString()}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                        {user.email}
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`/admin/users/${user._id?.toString()}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                        <strong style={{ color: "var(--brand-primary)" }}>${(user.balance ?? 0).toFixed(2)}</strong>
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`/admin/users/${user._id?.toString()}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                        {user.isAdmin ? (
                                            <span className="status-badge" style={{ background: "#7c3aed", color: "#fff" }}>Admin</span>
                                        ) : user.canBuy && user.canPublish ? (
                                            <span className="status-badge approved">Buyer + Publisher</span>
                                        ) : user.canPublish ? (
                                            <span className="status-badge active">Publisher</span>
                                        ) : (
                                            <span className="status-badge">Buyer</span>
                                        )}
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`/admin/users/${user._id?.toString()}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                        <span className="status-badge">
                                            {user.activeMode ?? "buyer"}
                                        </span>
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`/admin/users/${user._id?.toString()}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : "—"}
                                    </Link>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
