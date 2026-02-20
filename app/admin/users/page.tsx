import { getAllUsers } from "@/app/lib/user"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"

export default async function UsersPage() {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return redirect("/admin")

    const users = await getAllUsers()

    return (
        <div className="section-content active">
            <div className="section-header">
                <h1 className="section-title">Users</h1>
                <p className="section-subtitle">All registered users on the platform</p>
            </div>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Mode</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id?.toString()}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-cell-avatar">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="user-cell-name">{user.name}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    {user.isAdmin && (
                                        <span className="status-badge" style={{ background: "#7c3aed", color: "#fff" }}>Admin</span>
                                    )}
                                    {!user.isAdmin && user.canPublish && (
                                        <span className="status-badge active">Publisher</span>
                                    )}
                                    {!user.isAdmin && !user.canPublish && (
                                        <span className="status-badge">Buyer</span>
                                    )}
                                </td>
                                <td>
                                    <span className="status-badge">
                                        {user.activeMode ?? "buyer"}
                                    </span>
                                </td>
                                <td>
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString()
                                        : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
