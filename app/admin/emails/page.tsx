export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/lib/session"
import { getAllEmailTemplates } from "@/app/lib/email-templates"
import { getCampaignHistory } from "@/app/lib/campaign-logs"
import { getUsersByIds } from "@/app/lib/user"
import { displayName } from "@/app/lib/format"
import { getSiteSettings } from "@/app/lib/site-settings"
import EmailsForm from "./EmailsForm"

export default async function EmailsPage() {
  const user = await getCurrentUser()
  if (!user?.isAdmin) return redirect("/admin")

  const [templates, history, settings] = await Promise.all([
    getAllEmailTemplates(),
    getCampaignHistory(),
    getSiteSettings(),
  ])
  const senders = await getUsersByIds(history.map(h => h.sentBy))
  const senderById = new Map(senders.map(u => [u._id!.toString(), u]))

  const historyForClient = history.map(h => ({
    id: h._id!.toString(),
    audienceLabel: h.audienceLabel,
    subject: h.subject,
    sentCount: h.sentCount,
    sentBy: displayName(senderById.get(h.sentBy), h.sentBy),
    createdAt: h.createdAt.toString(),
  }))

  return <EmailsForm templates={templates} history={historyForClient} logoUrl={settings.logoUrl} />
}
