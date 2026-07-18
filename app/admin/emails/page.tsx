export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/lib/session"
import { getAllEmailTemplates } from "@/app/lib/email-templates"
import EmailsForm from "./EmailsForm"

export default async function EmailsPage() {
  const user = await getCurrentUser()
  if (!user?.isAdmin) return redirect("/admin")

  const templates = await getAllEmailTemplates()

  return <EmailsForm templates={templates} />
}
