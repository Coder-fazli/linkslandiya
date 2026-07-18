export const dynamic = 'force-dynamic'

import { ResetPasswordForm } from "../../../components/auth/ResetPasswordForm"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"

export default async function ResetPasswordPage({ searchParams }: {
  searchParams: Promise<{ token?: string }>
}) {
  const user = await getCurrentUser()
  if (user) redirect("/admin")

  const { token } = await searchParams
  if (!token) redirect("/forgot-password")

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
