export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/lib/session"
import { getPackageById } from "@/app/lib/packages"
import PackageForm from "../../PackageForm"

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser()
    if (!user?.isAdmin) return redirect("/")

    const { id } = await params
    const pkg = await getPackageById(id)
    if (!pkg) return <div>Package not found</div>

    return (
        <div className="section-content active">
            <div style={{ marginBottom: "20px" }}>
                <Link href="/admin/packages" style={{ color: "var(--brand-primary)", fontSize: "14px", textDecoration: "none" }}>
                    ← Packages
                </Link>
            </div>
            <div className="section-header">
                <h1 className="section-title">Edit Package</h1>
            </div>
            <PackageForm mode="edit" packageId={id} initial={JSON.parse(JSON.stringify(pkg))} />
        </div>
    )
}
