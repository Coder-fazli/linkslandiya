export const dynamic = 'force-dynamic'

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getCurrentUser } from "../lib/session";
import { getSiteSettings } from "../lib/site-settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const settings = await getSiteSettings();
  return (
    <>
      <Header
        isLoggedIn={!!user}
        logoUrl={settings.logoUrl}
        logoWidth={settings.logoWidth}
        logoHeight={settings.logoHeight}
      />
      {children}
      <Footer />
    </>
  );
}


