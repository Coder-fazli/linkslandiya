   "use server"

import { redirect } from "next/navigation"
import { getCurrentUser } from "./session"
import { updateOrderStatus, updateOrder } from "./orders"
import { revalidatePath } from "next/cache"
import { getWebsitesByOwner, approveWebsite, rejectWebsite } from "./websites"


export async function updateStatus(orderId:
  string, status: "pending" | "in_progress" |
  "completed" | "cancelled"){

   const user = await getCurrentUser()
   if(!user) return redirect("/login")
   await updateOrderStatus(orderId, status)
   
   revalidatePath(`/admin/publisher-orders/${orderId}`)
}

// Get publisher websites

export async function getPublisherWebsites(){
   const user = await getCurrentUser()
   if(!user) return []
   return await getWebsitesByOwner(user._id.toString())
}

// Approve wesite

export async function approveWebsiteAction(websiteId: string){
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return
    await approveWebsite(websiteId)
    revalidatePath("/admin/all-websites")
}

// Reject website

export async function rejectWebsiteAction(websiteId: string){
   const admin = await getCurrentUser()
   if(!admin || !admin.isAdmin) return
   await rejectWebsite(websiteId)
   revalidatePath("/admin/all-websites")
}

// Save published link for order

export async function savePublishedLink(orderId: string, link: string) {
   const user = await getCurrentUser();
   if (!user) return redirect("/login")
      await updateOrder(orderId, {
   publishedLink: link })
   revalidatePath(`/admin/publisher-orders/${orderId}`)
     
}