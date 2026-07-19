export const dynamic = 'force-dynamic'

import { getWebsiteById } from "@/app/lib/websites"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"
import { adminUpdateWebsiteAction, refreshWebsiteScreenshotAction } from "@/app/lib/actions"
import ScreenshotStatusPoller from "@/components/admin/ScreenshotStatusPoller"
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

            {/* Back link + header */}
            <Link href="/admin/publishers-websites" className="back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Publishers Websites
            </Link>

            <div className="edit-header">
                <h2>Edit Website</h2>
                <span className={`status-badge ${website.status}`}>
                    {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
                </span>
            </div>

            {/* Homepage screenshot — captured automatically on approval/URL change */}
            <div className="card" style={{ marginBottom: "1.25rem" }}>
                <div className="card-header">
                    <h3>Homepage Screenshot</h3>
                    <span className={`status-badge ${website.screenshotStatus === "failed" ? "rejected" : website.screenshotStatus === "ready" ? "active" : "pending"}`}>
                        {website.screenshotStatus === "failed" ? "Failed" : website.screenshotStatus === "ready" ? "Ready" : website.screenshotStatus === "pending" ? "Capturing…" : "Not captured yet"}
                    </span>
                </div>
                <div className="card-body" style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{
                        width: "220px", height: "138px", borderRadius: "10px", overflow: "hidden",
                        background: "var(--bg-hover, #f1f5f9)", border: "1px solid var(--border-color, #e2e8f0)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                        {website.screenshotUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={website.screenshotUrl} alt={`${website.name} homepage`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>No screenshot yet</span>
                        )}
                    </div>
                    <div>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 12px", maxWidth: "360px" }}>
                            Captured automatically when this website is approved or its URL changes. Refresh manually if the homepage has changed since.
                        </p>
                        {website.screenshotStatus === "failed" && website.screenshotError && (
                            <p style={{ fontSize: "13px", color: "#ef4444", margin: "0 0 12px", maxWidth: "360px" }}>
                                {website.screenshotError}
                            </p>
                        )}
                        <form action={refreshWebsiteScreenshotAction.bind(null, id)}>
                            <button type="submit" className="btn btn-secondary">Refresh Screenshot</button>
                        </form>
                    </div>
                </div>
            </div>
            {website.screenshotStatus === "pending" && <ScreenshotStatusPoller />}

            <form action={adminUpdateWebsiteAction.bind(null, id)}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem", alignItems: "start" }}>

                    {/* Left column */}
                    <div>

                        {/* Basic Info */}
                        <div className="card" style={{ marginBottom: "1.25rem" }}>
                            <div className="card-header"><h3>Basic Info</h3></div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label className="form-label">Website URL</label>
                                    <input type="url" name="url" className="form-input" defaultValue={website.url} placeholder="https://example.com" />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Description</label>
                                    <textarea name="desc" className="form-textarea" defaultValue={website.desc} placeholder="Brief description..." />
                                </div>
                            </div>
                        </div>

                        {/* SEO Metrics */}
                        <div className="card" style={{ marginBottom: "1.25rem" }}>
                            <div className="card-header"><h3>SEO Metrics</h3></div>
                            <div className="card-body">
                                <div className="form-grid three-col">
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">DA (Moz)</label>
                                        <input type="number" name="da" className="form-input" defaultValue={website.da} min={0} max={100} placeholder="0-100" />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">DR (Ahrefs)</label>
                                        <input type="number" name="dr" className="form-input" defaultValue={website.dr} min={0} max={100} placeholder="0-100" />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Monthly Traffic</label>
                                        <input type="number" name="traffic" className="form-input" defaultValue={website.traffic} min={0} placeholder="e.g. 50000" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="card" style={{ marginBottom: "1.25rem" }}>
                            <div className="card-header"><h3>Pricing</h3></div>
                            <div className="card-body">
                                <div className="form-grid three-col">
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Guest Post ($)</label>
                                        <input type="number" name="price" className="form-input" defaultValue={website.price} min={0} placeholder="e.g. 100" />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Link Insertion ($)</label>
                                        <input type="number" name="linkInsertionPrice" className="form-input" defaultValue={website.linkInsertionPrice ?? ""} min={0} placeholder="e.g. 80" />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Gray Niche Price ($)</label>
                                        <input type="number" name="casinoPrice" className="form-input" defaultValue={website.casinoPrice ?? ""} min={0} placeholder="e.g. 300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="card">
                            <div className="card-header"><h3>Details</h3></div>
                            <div className="card-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Country</label>
                                        <select name="country" className="form-select" defaultValue={website.country}>
                                            <option value="">Select Country</option>
                                            <option value="AZ">Azerbaijan</option>
                                            <option value="KZ">Kazakhstan</option>
                                            <option value="RU">Russia</option>
                                            <option value="US">United States</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="DE">Germany</option>
                                            <option value="FR">France</option>
                                            <option value="ES">Spain</option>
                                            <option value="IT">Italy</option>
                                            <option value="TR">Turkey</option>
                                            <option value="IN">India</option>
                                            <option value="BR">Brazil</option>
                                            <option value="Global">Global</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Language</label>
                                        <select name="language" className="form-select" defaultValue={website.language}>
                                            <option value="">Select Language</option>
                                            <option value="Azerbaijani">Azerbaijani</option>
                                            <option value="Kazakh">Kazakh</option>
                                            <option value="Russian">Russian</option>
                                            <option value="English">English</option>
                                            <option value="German">German</option>
                                            <option value="French">French</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="Italian">Italian</option>
                                            <option value="Turkish">Turkish</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Portuguese">Portuguese</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Topic / Category</label>
                                        <select name="topic" className="form-select" defaultValue={website.topic}>
                                            <option value="">Select Topic</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Business">Business</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Health">Health</option>
                                            <option value="Travel">Travel</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Lifestyle">Lifestyle</option>
                                            <option value="Education">Education</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="News">News</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Link Type</label>
                                        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                                            <input type="checkbox" name="dofollow" defaultChecked={website.dofollow} />
                                            <span>Dofollow Link</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right column — Status + Save */}
                    <div>
                        <div className="card" style={{ marginBottom: "1.25rem" }}>
                            <div className="card-header"><h3>Status</h3></div>
                            <div className="card-body">
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <select name="status" className="form-select" defaultValue={website.status}>
                                        <option value="pending">Pending</option>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-body">
                                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                                    <div style={{ marginBottom: "6px" }}>Owner ID:</div>
                                    <div style={{ fontFamily: "monospace", fontSize: "0.75rem", wordBreak: "break-all" }}>{website.ownerId}</div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </form>

        </div>
    )
}
