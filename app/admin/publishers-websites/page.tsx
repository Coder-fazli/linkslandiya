import { getAllWebsites } from "@/app/lib/websites"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import { approveWebsiteAction, rejectWebsiteAction, approvePendingChangesAction, rejectPendingChangesAction } from "@/app/lib/actions"
import Link from "next/link"

export default async function AllWebsitesPage() {

    // Check who is logged in
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    // Only admins can see this page
    if (!user.isAdmin) return redirect("/")

    // Get every website from every publisher
    const websites = await getAllWebsites()

    return (
        <div className="section-content active">

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Website</th>
                            <th>Publisher</th>
                            <th>DA</th>
                            <th>DR</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                    {websites.length === 0 ? (
                        <tr>
                            <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                                No websites yet.
                            </td>
                        </tr>
                    ) : (
                        websites.map(website => (
                            <tr key={website._id}>

                                {/* Website name */}
                                <td>
                                    {website.name}
                                    {website.pendingData && (
                                        <span style={{ marginLeft: "8px", fontSize: "0.75rem", background: "#f59e0b", color: "#fff", padding: "2px 8px", borderRadius: "999px" }}>
                                            Pending Changes
                                        </span>
                                    )}
                                </td>

                                {/* Publisher ID — later we can show their name */}
                                <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                    {website.ownerId}
                                </td>

                                <td>{website.da}</td>
                                <td>{website.dr}</td>
                                <td>${website.price}</td>

                                {/* Status badge */}
                                <td>
                                    <span className={`status-badge ${website.status}`}>
                                        {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td>
                                    <div className="action-btns">
                                        {/* Edit button — always visible for admin */}
                                        <Link href={`/admin/publishers-websites/${website._id}/edit`} className="action-btn view" title="Edit">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </Link>
                                        {/* Approve/Reject pending changes */}
                                        {website.pendingData && (
                                            <>
                                                <form action={approvePendingChangesAction.bind(null, website._id!)}>
                                                    <button type="submit" className="action-btn view" title="Approve Changes">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    </button>
                                                </form>
                                                <form action={rejectPendingChangesAction.bind(null, website._id!)}>
                                                    <button type="submit" className="action-btn delete" title="Reject Changes">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                    </button>
                                                </form>
                                            </>
                                        )}

                                        {website.status === "pending" && (
                                            <>
                                                {/* Approve button — green checkmark */}
                                                <form action={approveWebsiteAction.bind(null, website._id!)}>
                                                    <button type="submit" className="action-btn view" title="Approve">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    </button>
                                                </form>

                                                {/* Reject button — red X */}
                                                <form action={rejectWebsiteAction.bind(null, website._id!)}>
                                                    <button type="submit" className="action-btn delete" title="Reject">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                    </button>
                                                </form>
                                            </>
                                        )}
                                    </div>
                                </td>

                            </tr>
                        ))
                    )}

                    </tbody>
                </table>
            </div>

        </div>
    )
}
