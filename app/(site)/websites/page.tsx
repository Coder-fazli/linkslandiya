import WebsiteTable from "@/components/Websites/WebsiteTable";
import { getAllWebsites } from "@/app/lib/websites";


export default async function WebsitesPage() {
    const rawWebsites = await getAllWebsites();
    const websites = rawWebsites.map(site => ({
        ...site,
        _id: site._id?.toString()
    }))  
    return(
        <>     
            <main className="page">
                <WebsiteTable initialWebsites={websites} />
            </main>
        </>
       );
    }