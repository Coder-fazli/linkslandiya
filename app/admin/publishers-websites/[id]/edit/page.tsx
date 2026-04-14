import { getWebsiteById } from "@/app/lib/websites"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import { adminUpdateWebsiteAction } from "@/app/lib/actions"
import Link from "next/link"

export default async function AdminEditWebsitePage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")
    if (!user.isAdmin) return redirect("/")

    const { id } = await params
    const website = await getWebsiteById(id)
    if (!website) return <div>Website not found</div>

    return (
        <div className="section-content active">
            <div className="card" style={{ maxWidth: "600px" }}>

                <div style={{ marginBottom: "1.5rem" }}>
                    <Link href="/admin/publishers-websites" style={{ color: "var(--text-secondary)", fontSize: "0.85rem", textDecoration: "none" }}>
                        ← Back to Publishers Websites
                    </Link>
                    <h2 style={{ marginTop: "0.75rem", marginBottom: "0.25rem" }}>Edit Website</h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{website.url}</p>
                </div>

                <form action={adminUpdateWebsiteAction.bind(null, id)}>
                    <div className="form-grid three-col" style={{ marginBottom: "1.5rem" }}>
                        <div className="form-group">
                            <label className="form-label">DA (Moz)</label>
                            <input
                                type="number"
                                name="da"
                                className="form-input"
                                defaultValue={website.da}
                                min={0} max={100}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">DR (Ahrefs)</label>
                            <input
                                type="number"
                                name="dr"
                                className="form-input"
                                defaultValue={website.dr}
                                min={0} max={100}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Monthly Traffic</label>
                            <input
                                type="number"
                                name="traffic"
                                className="form-input"
                                defaultValue={website.traffic}
                                min={0}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                        <label className="form-label">Status</label>
                        <select name="status" className="form-input" defaultValue={website.status}>
                            <option value="pending">Pending</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary">Save Changes</button>
                </form>

            </div>
        </div>
    )
}
