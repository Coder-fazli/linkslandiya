import type { Metadata } from "next"
import Packages from "@/components/Sections/Packages"
import { getActivePackages } from "@/app/lib/packages"
import { getCurrentUser } from "@/app/lib/session"

export const metadata: Metadata = {
    title: "Packages & Pricing — Linkslandia",
    description: "Done-for-you guest posting and link building packages, matched to how much authority you need to build each month.",
}

export default async function PackagesPage() {
    const [packages, user] = await Promise.all([getActivePackages(), getCurrentUser()])

    return (
        <main className="main">
            <Packages packages={JSON.parse(JSON.stringify(packages))} isLoggedIn={!!user} />
        </main>
    )
}
