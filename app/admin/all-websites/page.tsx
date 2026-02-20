import { getAllWebsites } from "@/app/lib/websites"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import { approveWebsiteAction, rejectWebsiteAction } from "@/app/lib/actions"

export default async function AllWebsitesPage() {

    // Check who is logged in
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    // Only admins can see this page
    if (!user.isAdmin) return redirect("/admin")

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
                                <td>{website.name}</td>

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

                                {/* Approve and Reject buttons — only show for pending websites */}
                                <td>
                                    <div className="action-btns">
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
