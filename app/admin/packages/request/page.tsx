export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/lib/session"
import { getPackageById } from "@/app/lib/packages"
import RequestPackageButton from "./RequestPackageButton"

export default async function RequestPackagePage({ searchParams }: {
    searchParams: Promise<{ packageId?: string }>
}) {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    const { packageId } = await searchParams
    if (!packageId) return redirect("/packages")

    const pkg = await getPackageById(packageId)
    if (!pkg || !pkg.active) {
        return (
            <div className="section-content active">
                <h1>Package not found</h1>
                <p>This package is no longer available.</p>
                <Link href="/packages" style={{ color: "var(--brand-primary)" }}>← Back to Packages</Link>
            </div>
        )
    }

    return (
        <div className="section-content active">
            <div style={{ marginBottom: "20px" }}>
                <Link href="/packages" style={{ color: "var(--brand-primary)", fontSize: "14px", textDecoration: "none" }}>
                    ← Back to Packages
                </Link>
            </div>

            <div className="section-header">
                <h1 className="section-title">Confirm Package Request</h1>
                <p className="section-subtitle">
                    We&apos;ll notify our team and follow up with you in your inbox — no payment is taken now.
                </p>
            </div>

            <div className="card" style={{ maxWidth: "480px" }}>
                <div className="card-header"><h3>{pkg.name}</h3></div>
                <div className="card-body">
                    <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>{pkg.description}</p>
                    <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--brand-primary)", marginBottom: "16px" }}>
                        ${pkg.price}<span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)" }}>/month</span>
                    </div>
                    {pkg.features.length > 0 && (
                        <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                            {pkg.features.map(f => (
                                <li key={f} style={{ fontSize: "14px", color: "var(--text-primary, #0f172a)" }}>✓ {f}</li>
                            ))}
                        </ul>
                    )}
                    <RequestPackageButton packageId={packageId} />
                </div>
            </div>
        </div>
    )
}
