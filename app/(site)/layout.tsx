import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getCurrentUser } from "../lib/session";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <>
      <Header isLoggedIn={!!user} />
      {children}
      <Footer />
    </>
  );
}


