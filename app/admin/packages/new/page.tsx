export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/lib/session"
import PackageForm from "../PackageForm"

export default async function NewPackagePage() {
    const user = await getCurrentUser()
    if (!user?.isAdmin) return redirect("/")

    return (
        <div className="section-content active">
            <div style={{ marginBottom: "20px" }}>
                <Link href="/admin/packages" style={{ color: "var(--brand-primary)", fontSize: "14px", textDecoration: "none" }}>
                    ← Packages
                </Link>
            </div>
            <div className="section-header">
                <h1 className="section-title">New Package</h1>
            </div>
            <PackageForm mode="create" />
        </div>
    )
}
