   "use server"

import { redirect } from "next/navigation"
import { getCurrentUser } from "./session"
import { updateOrderStatus, updateOrder, submitForReview, confirmOrderComplete, requestOrderRevision, getOrderById } from "./orders"
import { adjustUserBalance } from "./user"
import { revalidatePath } from "next/cache"
import { getWebsitesByOwner, approveWebsite, rejectWebsite, adminUpdateWebsite } from "./websites"


export async function updateStatus(orderId:
  string, status: "pending" | "in_progress" |
  "review" | "revision" | "completed" | "cancelled"){

   const user = await getCurrentUser()
   if(!user) return redirect("/login")
   
      // Ensure user is publisher and owns the order
   const order = await getOrderById(orderId)
   if(!order) return
   if (order.publisherId !== user._id.toString()) return
   await updateOrderStatus(orderId, status)

   revalidatePath(`/admin/publisher-orders/${orderId}`)
}
 
// Publisher submits published link for buyer review
export async function submitForReviewAction(orderId: string, publishedLink: string) {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")
   const order = await getOrderById(orderId)
   if (!order) return
   if (order.publisherId !== user._id.toString()) return
  await submitForReview(orderId, publishedLink)
  revalidatePath(`/admin/publisher-orders/${orderId}`)
}

// Buyer confirms order complete — pays publisher
export async function confirmOrderAction(orderId: string) {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")
  const order = await getOrderById(orderId)
  if (!order) return
  if (order.buyerId !== user._id.toString()) return
  if (order.status === "completed") return
  // Credit publisher now that buyer has confirmed
  await adjustUserBalance(order.publisherId, order.amount)
  await confirmOrderComplete(orderId)
  revalidatePath(`/admin/buyer-orders/${orderId}`)
}

// Buyer requests revision with note
export async function requestRevisionAction(orderId: string, note: string) {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")
   const order = await getOrderById(orderId)
   if (!order) return
   if (order.buyerId !== user._id.toString()) return
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
    revalidatePath("/admin/publishers-websites")
}

// Admin sets any order status
export async function adminSetOrderStatusAction(orderId: string, formData: FormData) {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return
    const status = formData.get("status") as string
    await updateOrderStatus(orderId, status as any)
    revalidatePath(`/admin/buyer-orders/${orderId}`)
}

// Admin cancels order and refunds buyer if order was completed
export async function adminCancelOrderAction(orderId: string) {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return
    const order = await getOrderById(orderId)
    if (!order) return
    if (order.status === "cancelled") return
    // If already completed, publisher was paid — reverse the payment
    if (order.status === "completed") {
        await adjustUserBalance(order.publisherId, -order.amount) // deduct from publisher
        await adjustUserBalance(order.buyerId, order.amount)      // refund buyer
    }
    await updateOrderStatus(orderId, "cancelled")
    revalidatePath(`/admin/buyer-orders/${orderId}`)
}

// Admin updates any website (SEO metrics, status, etc.)
export async function adminUpdateWebsiteAction(websiteId: string, formData: FormData) {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return
    await adminUpdateWebsite(websiteId, {
        da: Number(formData.get("da")),
        dr: Number(formData.get("dr")),
        traffic: Number(formData.get("traffic")),
        status: formData.get("status") as string
    })
    revalidatePath("/admin/publishers-websites")
    redirect("/admin/publishers-websites")
}

// Reject website

export async function rejectWebsiteAction(websiteId: string){
   const admin = await getCurrentUser()
   if(!admin || !admin.isAdmin) return
   await rejectWebsite(websiteId)
   revalidatePath("/admin/publishers-websites")
}

// Publisher saves their uploaded article file
export async function savePublisherFile(orderId: string, url: string, name: string) {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")
   const order = await getOrderById(orderId)
  if(!order) return
  if (order.publisherId !== user._id.toString()) return
  await updateOrder(orderId, { publisherFileUrl: url, publisherFileName: name })
  revalidatePath(`/admin/publisher-orders/${orderId}`)
}

// Save published link for order

export async function savePublishedLink(orderId: string, link: string) {
   const user = await getCurrentUser();
   if (!user) return redirect("/login")
      const order = await getOrderById(orderId)                                  
  if (!order) return
  if (order.publisherId !== user._id.toString()) return   
      await updateOrder(orderId, {
   publishedLink: link })
   revalidatePath(`/admin/publisher-orders/${orderId}`)
     
}