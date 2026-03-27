import { getCurrentUser } from "@/app/lib/session"
import { getUserById } from "@/app/lib/user"
import { getOrdersByBuyer, getOrdersByPublisher } from "@/app/lib/orders"
import { getWebsitesByOwner } from "@/app/lib/websites"
import { redirect } from "next/navigation"
import Link from "next/link"
import UserDetailClient from "./UserDetailClient"

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser()
  if (!admin?.isAdmin) return redirect("/admin")

  const { id } = await params
  const user = await getUserById(id)
  if (!user) return <div>User not found</div>

  const [buyerOrders, publisherOrders, websites] = await Promise.all([
    getOrdersByBuyer(id),
    getOrdersByPublisher(id),
    getWebsitesByOwner(id),
  ])

  const safeUser = {
    _id: user._id?.toString() ?? id,
    name: user.name,
    email: user.email,
    balance: user.balance ?? 0,
    isAdmin: user.isAdmin ?? false,
    canPublish: user.canPublish ?? false,
    canBuy: user.canBuy ?? true,
    activeMode: user.activeMode ?? "buyer",
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—",
    country: user.country,
    phone: user.phone,
    companyWebsite: user.companyWebsite,
  }

  return (
    <div className="section-content active">
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/users" style={{ color: "var(--brand-primary)", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          ← All Users
        </Link>
      </div>

      <UserDetailClient
        user={safeUser}
        buyerOrders={JSON.parse(JSON.stringify(buyerOrders))}
        publisherOrders={JSON.parse(JSON.stringify(publisherOrders))}
        websites={JSON.parse(JSON.stringify(websites))}
      />
    </div>
  )
}
