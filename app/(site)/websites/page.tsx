import WebsiteTable from "@/components/Websites/WebsiteTable";
import { getAllWebsites } from "@/app/lib/websites";
import { getCurrentUser } from "@/app/lib/session";
import { redirect } from "next/navigation";


export default async function WebsitesPage() {
    const user = await getCurrentUser()
    if (!user) return redirect("/login")

    const rawWebsites = await getAllWebsites();
    const websites = rawWebsites.map(site => ({
        ...site,
        _id: site._id?.toString(),
        ownerId: site.ownerId?.toString()
    }))  
    return(
        <>     
            <main className="page">
                <WebsiteTable initialWebsites={websites} />
            </main>
        </>
       );
    }