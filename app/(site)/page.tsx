import WebsiteTablePreview from "@/components/Websites/WebsiteTablePreview";
import { MarqueeDemo } from "@/components/ui/marquee";
import Hero from "@/components/ui/hero";
import Services from "@/components/Sections/Services";
import Features from "@/components/Sections/Features";
import ProcessTimeline from "@/components/Sections/ProcessTimeline";
import GlobalReach from "@/components/Sections/GlobalReach";
import Faq from "@/components/Sections/Faq";
import { getAllWebsites } from "../lib/websites";

export default async function Home() {
  const websites = await getAllWebsites();

  return (
    <main className="main">
      <Hero />
      <Services />
      <Features />
      <ProcessTimeline />
      <GlobalReach />
      <div className="container">
        <h2 className="page-title">Last Added Sites</h2>
         <WebsiteTablePreview websites={websites} limit={6} showBlur={true} />
         <h2 className="page-title">What Our Clients Say</h2>
        <MarqueeDemo />
      </div>
      <Faq />
    </main>
  );
}
