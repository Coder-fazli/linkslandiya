export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/lib/session"
import { getSiteSettings } from "@/app/lib/site-settings"
import { DEFAULT_SITE_TITLE } from "@/models/site-settings"
import AppearanceForm from "./AppearanceForm"

export default async function AppearancePage() {
  const user = await getCurrentUser()
  if (!user?.isAdmin) return redirect("/admin")

  const settings = await getSiteSettings()

  return (
    <AppearanceForm
      logoUrl={settings.logoUrl}
      faviconUrl={settings.faviconUrl}
      logoWidth={settings.logoWidth}
      logoHeight={settings.logoHeight}
      siteTitle={settings.siteTitle ?? DEFAULT_SITE_TITLE}
      showSiteTitle={settings.showSiteTitle ?? true}
    />
  )
}
