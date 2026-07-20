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

const DATE_TABS = [
    { key: "all", label: "All Time" },
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
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

// Boundaries for the quick date presets — calendar-day based for
// Today/Yesterday, rolling window for Week/Month.
function getDateRange(preset: string): { from?: Date; to?: Date } {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    switch (preset) {
        case "today":
            return { from: startOfToday }
        case "yesterday": {
            const from = new Date(startOfToday)
            from.setDate(from.getDate() - 1)
            return { from, to: new Date(startOfToday.getTime() - 1) }
        }
        case "week": {
            const from = new Date(startOfToday)
            from.setDate(from.getDate() - 7)
            return { from }
        }
        case "month": {
            const from = new Date(startOfToday)
            from.setDate(from.getDate() - 30)
            return { from }
        }
        default:
            return {}
    }
}

export default async function UsersPage({ searchParams }: {
    searchParams: Promise<{ role?: string; date?: string }>
}) {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return redirect("/")

    const { role, date } = await searchParams
    const activeTab = ROLE_TABS.some(t => t.key === role) ? role! : "all"
    const activeDateTab = DATE_TABS.some(t => t.key === date) ? date! : "all"

    const users = await getAllUsers()
    const counts: Record<string, number> = {}
    for (const t of ROLE_TABS) counts[t.key] = users.filter(u => matchesRole(u, t.key)).length

    const { from, to } = getDateRange(activeDateTab)

    const filtered = users
        .filter(u => matchesRole(u, activeTab))
        .filter(u => !from || new Date(u.createdAt) >= from)
        .filter(u => !to || new Date(u.createdAt) <= to)

    function buildHref(overrides: { role?: string; date?: string }) {
        const params = new URLSearchParams()
        const nextRole = overrides.role ?? activeTab
        const nextDate = overrides.date ?? activeDateTab
        if (nextRole !== "all") params.set("role", nextRole)
        if (nextDate !== "all") params.set("date", nextDate)
        const qs = params.toString()
        return qs ? `/admin/users?${qs}` : "/admin/users"
    }

    return (
        <div className="section-content active">
            <div className="section-header">
                <h1 className="section-title">Users</h1>
                <p className="section-subtitle">All registered users on the platform</p>
            </div>

            {/* Role filter tabs */}
            <div className="tabs" style={{ marginBottom: '10px', flexWrap: 'wrap' }}>
                {ROLE_TABS.map(t => (
                    <Link
                        key={t.key}
                        href={buildHref({ role: t.key })}
                        className={`tab ${activeTab === t.key ? "active" : ""}`}
                        style={{ textDecoration: "none" }}
                    >
                        {t.label}
                        <span className="tab-count">{counts[t.key]}</span>
                    </Link>
                ))}
            </div>

            {/* Joined date quick filter */}
            <div className="tabs" style={{ marginBottom: '16px', flexWrap: 'wrap' }}>
                {DATE_TABS.map(t => (
                    <Link
                        key={t.key}
                        href={buildHref({ date: t.key })}
                        className={`tab ${activeDateTab === t.key ? "active" : ""}`}
                        style={{ textDecoration: "none" }}
                    >
                        {t.label}
                    </Link>
                ))}
            </div>

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
