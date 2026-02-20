import { NextResponse } from "next/server";
import { getAllWebsites, createWebsites, deleteWebsiteById, UpdatedWebsite } from "../../lib/websites";
import { getCurrentUser } from "@/app/lib/session";


 export async function GET()
  { 
    try {
      const websites = await getAllWebsites();
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

    const body = await req.json();
    body.ownerId = user._id.toString() // Here we attach the owner
    const insertedId = await createWebsites(body);
    return NextResponse.json({ insertedId });
 }

 export async function PUT(req: Request){
   const body = await req.json();
   const updated = await UpdatedWebsite(body._id, body);
   return NextResponse.json({ updated })

 }

// Delete Website Api Function  
export async function DELETE(req: Request) {
  try {
     const { id } = await req.json();
     const deleted = await deleteWebsiteById(id);
     return NextResponse.json({ deleted });
  } catch (error) {
    console.error("DELETE /api/websites failed:", error);
return NextResponse.json({ error: "Failed to delete website" }, { status: 500 });
  }
}
