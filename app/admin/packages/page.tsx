export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/lib/session"
import { getAllPackages } from "@/app/lib/packages"
import { deletePackageAction, togglePackageActiveAction } from "@/app/lib/packages-actions"
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton"

export default async function AdminPackagesPage() {
    const user = await getCurrentUser()
    if (!user?.isAdmin) return redirect("/")

    const packages = await getAllPackages()

    return (
        <div className="section-content active">
            <div className="section-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div>
                    <h1 className="section-title">Packages</h1>
                    <p className="section-subtitle">Manage the plans shown on the public /packages page</p>
                </div>
                <Link href="/admin/packages/new" className="btn btn-primary" style={{ textDecoration: "none" }}>
                    + New Package
                </Link>
            </div>

            {packages.length === 0 ? (
                <div className="card" style={{ padding: "48px", textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No packages yet</div>
                    <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
                        The public page currently shows placeholder demo packages. Create a real one to replace them.
                    </p>
                    <Link href="/admin/packages/new" className="btn btn-primary" style={{ textDecoration: "none" }}>
                        + New Package
                    </Link>
                </div>
            ) : (
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Popular</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map(p => {
                                const id = p._id!.toString()
                                return (
                                    <tr key={id}>
                                        <td>{p.order}</td>
                                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                                        <td>${p.price}</td>
                                        <td>{p.popular ? <span className="status-badge active">Popular</span> : "—"}</td>
                                        <td>
                                            <form action={togglePackageActiveAction.bind(null, id, !p.active)}>
                                                <button type="submit" className={`status-badge ${p.active ? "active" : ""}`}
                                                    style={{ border: "none", cursor: "pointer" }}
                                                    title={p.active ? "Click to hide from public page" : "Click to show on public page"}>
                                                    {p.active ? "Active" : "Hidden"}
                                                </button>
                                            </form>
                                        </td>
                                        <td>
                                            <div className="action-btns" style={{ display: "flex", gap: "6px" }}>
                                                <Link href={`/admin/packages/${id}/edit`} className="action-btn view" title="Edit">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                    </svg>
                                                </Link>
                                                <form action={deletePackageAction.bind(null, id)}>
                                                    <ConfirmSubmitButton
                                                        className="action-btn delete"
                                                        title="Delete package"
                                                        message={`Delete the "${p.name}" package? This cannot be undone.`}
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                                                        </svg>
                                                    </ConfirmSubmitButton>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
