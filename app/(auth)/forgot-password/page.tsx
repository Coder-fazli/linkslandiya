export const dynamic = 'force-dynamic'

import { ForgotPasswordForm } from "../../../components/auth/ForgotPasswordForm"
import { getCurrentUser } from "@/app/lib/session"
import { redirect } from "next/navigation"

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser()
  if (user) redirect("/admin")
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
