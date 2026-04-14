import { NextResponse } from "next/server";
import { getAllWebsites, createWebsites, deleteWebsiteById, getWebsiteById, getPublishedWebsites, savePendingChanges, rejectPendingChanges  } from "../../lib/websites";
import { getCurrentUser } from "@/app/lib/session";


 export async function GET()
  { 
    try {
       const user = await getCurrentUser()
      if(!user) return NextResponse.json({ 
      error: "Not logged in" }, { status: 401 })

      const websites = user.isAdmin ? await getAllWebsites() : await getPublishedWebsites();
      return NextResponse.json(websites);
    } 
    catch (error) {  
      console.error("GET /api/websites failed:", error);
      return NextResponse.json({ error: "Failed to load websites"}, {status: 500}); 
    }
 }

 // POst Website Api 

 export async function POST(req: Request){
    const user = await getCurrentUser()
    if(!user) return NextResponse.json({ 
      error: "Not logged in" }, { status: 401 })
        
        if (!user.canPublish && !user.isAdmin) return NextResponse.json({ error: "Not a publisher" }, { status: 403 })

    const body = await req.json();
    const  { name, url, desc, dofollow, da, dr, traffic, country, language, topic, price, linkInsertionPrice, casinoPrice } = body;

    const insertedId = await createWebsites({
     name, url, desc, dofollow, da, dr, traffic,             
    country, language, topic, price,
    linkInsertionPrice, casinoPrice,
    ownerId: user._id.toString(),                              status: "pending",
   })
    return NextResponse.json({ insertedId })
 }

 export async function PUT(req: Request){
  try {
     const user = await getCurrentUser()
    if(!user) return NextResponse.json({ 
      error: "Not logged in" }, { status: 401 })

    const body = await req.json();
    if (!body._id) return NextResponse.json({ error: "Missing _id" }, { status: 400 })
 
    const { name, url, desc, dofollow, da, dr, traffic, country, language, topic, price, linkInsertionPrice, casinoPrice } = body 

    const updated = await savePendingChanges(body._id, user._id.toString(), { name, url, desc, dofollow, da, dr, traffic, country, language, topic, price, linkInsertionPrice, casinoPrice 
    });
    return NextResponse.json({ updated })
  } catch (error) {
    console.error("PUT /api/websites failed:", error)
    return NextResponse.json({ error: "Failed to update website" }, { status: 500 })
  }
}

// Delete Website Api Function  
export async function DELETE(req: Request) {
  try {
     const user = await getCurrentUser()
    if(!user) return NextResponse.json({ 
      error: "Not logged in" }, { status: 401 })

     const { id } = await req.json();
     const website = await getWebsiteById(id)
     if (!website) return NextResponse.json({ error: "Not found" }, { status: 404 })
     if (website.ownerId !== user._id.toString() && !user.isAdmin) {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 })
     }
     const deleted = await deleteWebsiteById(id);
     return NextResponse.json({ deleted });
  } catch (error) {
    console.error("DELETE /api/websites failed:", error);
return NextResponse.json({ error: "Failed to delete website" }, { status: 500 });
  }
}
