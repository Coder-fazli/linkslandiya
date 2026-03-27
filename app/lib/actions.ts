   "use server"

import { redirect } from "next/navigation"
import { getCurrentUser } from "./session"
import { updateOrderStatus, updateOrder, submitForReview, confirmOrderComplete, requestOrderRevision, getOrderById } from "./orders"
import { adjustUserBalance } from "./user"
import { revalidatePath } from "next/cache"
import { getWebsitesByOwner, approveWebsite, rejectWebsite } from "./websites"


export async function updateStatus(orderId:
  string, status: "pending" | "in_progress" |
  "review" | "revision" | "completed" | "cancelled"){

   const user = await getCurrentUser()
   if(!user) return redirect("/login")
   await updateOrderStatus(orderId, status)

   revalidatePath(`/admin/publisher-orders/${orderId}`)
}

// Publisher submits published link for buyer review
export async function submitForReviewAction(orderId: string, publishedLink: string) {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")
  await submitForReview(orderId, publishedLink)
  revalidatePath(`/admin/publisher-orders/${orderId}`)
}

// Buyer confirms order complete — pays publisher
export async function confirmOrderAction(orderId: string) {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")
  const order = await getOrderById(orderId)
  if (!order) return
  // Credit publisher now that buyer has confirmed
  await adjustUserBalance(order.publisherId, order.amount)
  await confirmOrderComplete(orderId)
  revalidatePath(`/admin/buyer-orders/${orderId}`)
}

// Buyer requests revision with note
export async function requestRevisionAction(orderId: string, note: string) {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")
  await requestOrderRevision(orderId, note)
  revalidatePath(`/admin/buyer-orders/${orderId}`)
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