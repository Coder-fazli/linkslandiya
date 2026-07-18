   "use server"

import { redirect } from "next/navigation"
import { getCurrentUser } from "./session"
import { updateOrderStatus, updateOrder, submitForReview, requestOrderRevision, getOrderById, transitionOrderStatus } from "./orders"
import { adjustUserBalance, markWelcomeBonusSeen, markProjectPromptSeen, setGrayTopicAccess } from "./user"
import { revalidatePath } from "next/cache"
import { getWebsitesByOwner, approveWebsite, rejectWebsite, adminUpdateWebsite, approvePendingChanges, rejectPendingChanges } from "./websites"


// Publisher accepts an admin-approved order and starts working.
// This is the ONLY status change a publisher can make directly.
export async function acceptOrderAction(orderId: string){

   const user = await getCurrentUser()
   if(!user) return redirect("/login")

      // Ensure user is publisher and owns the order
   const order = await getOrderById(orderId)
   if(!order) return
   if (order.publisherId !== user._id.toString()) return
   // Only an admin-approved order can be accepted
   await transitionOrderStatus(orderId, ["approved"], "in_progress")

   revalidatePath(`/admin/publisher-orders/${orderId}`)
}

// Publisher submits published link for buyer review
export async function submitForReviewAction(orderId: string, publishedLink: string) {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")
   const order = await getOrderById(orderId)
   if (!order) return
   if (order.publisherId !== user._id.toString()) return
   if (order.status !== "in_progress" && order.status !== "revision") return
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
  // Atomic transition — the publisher can only ever be credited once
  const confirmed = await transitionOrderStatus(orderId, ["approved", "in_progress", "review", "revision"], "completed")
  if (confirmed) {
    await adjustUserBalance(order.publisherId, order.amount)
  }
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

const ORDER_STATUSES = ["pending", "approved", "in_progress", "review", "revision", "completed", "cancelled"] as const

// Admin sets any order status
export async function adminSetOrderStatusAction(orderId: string, formData: FormData) {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return
    const status = formData.get("status") as string
    if (!ORDER_STATUSES.includes(status as typeof ORDER_STATUSES[number])) return
    await updateOrderStatus(orderId, status as typeof ORDER_STATUSES[number])
    revalidatePath(`/admin/buyer-orders/${orderId}`)
    revalidatePath("/admin/all-orders")
}

// Admin approves a new order — publisher can now see and accept it
export async function adminApproveOrderAction(orderId: string) {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return
    await transitionOrderStatus(orderId, ["pending"], "approved")
    revalidatePath("/admin/all-orders")
    revalidatePath(`/admin/buyer-orders/${orderId}`)
}

// Admin rejects a new order — cancels it and refunds the buyer
export async function adminRejectOrderAction(orderId: string) {
    await adminCancelOrderAction(orderId)
    revalidatePath("/admin/all-orders")
}

// Admin cancels order — buyer paid at creation, so always refund the buyer;
// take the payout back from the publisher only if they were already paid.
// Each transition is atomic, so a double submission can never refund twice.
export async function adminCancelOrderAction(orderId: string) {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return
    const order = await getOrderById(orderId)
    if (!order) return
    if (await transitionOrderStatus(orderId, ["completed"], "cancelled")) {
        await adjustUserBalance(order.publisherId, -order.amount) // deduct from publisher
        await adjustUserBalance(order.buyerId, order.amount)      // refund buyer
    } else if (await transitionOrderStatus(orderId, ["pending", "approved", "in_progress", "review", "revision"], "cancelled")) {
        await adjustUserBalance(order.buyerId, order.amount)      // refund buyer
    }
    revalidatePath(`/admin/buyer-orders/${orderId}`)
    revalidatePath("/admin/all-orders")
}

// Admin updates any website (all fields)
export async function adminUpdateWebsiteAction(websiteId: string, formData: FormData) {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return
    const casinoRaw = formData.get("casinoPrice") as string
    const linkRaw = formData.get("linkInsertionPrice") as string
    await adminUpdateWebsite(websiteId, {
        url: formData.get("url") as string,
        name: formData.get("url") as string,
        desc: formData.get("desc") as string,
        da: Number(formData.get("da")),
        dr: Number(formData.get("dr")),
        traffic: Number(formData.get("traffic")),
        price: Number(formData.get("price")),
        linkInsertionPrice: linkRaw ? Number(linkRaw) : undefined,
        casinoPrice: casinoRaw ? Number(casinoRaw) : undefined,
        country: formData.get("country") as string,
        language: formData.get("language") as string,
        topic: formData.get("topic") as string,
        dofollow: formData.get("dofollow") === "on",
        status: formData.get("status") as any,
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

// Aprrove publihser pending chnages
export async function approvePendingChangesAction(websiteId: string) {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return
    await approvePendingChanges(websiteId)
    revalidatePath("/admin/publishers-websites")  
}

// Reject publisher pending changes
  export async function rejectPendingChangesAction(websiteId: string)
  {
      const admin = await getCurrentUser()
      if (!admin || !admin.isAdmin) return
      await rejectPendingChanges(websiteId)
      revalidatePath("/admin/publishers-websites")
  }

// Mark welcome bonus popup as seen for current user
export async function markWelcomeBonusSeenAction() {
    const user = await getCurrentUser()
    if (!user) return
    await markWelcomeBonusSeen(user._id!.toString())
}

export async function markProjectPromptSeenAction(){
    const user = await getCurrentUser()
    if (!user) return
    await markProjectPromptSeen(user._id!.toString())
}

// Admin grants/revokes a buyer's ability to see gray-topic (casino) orders.
// Hidden from everyone by default — enabled only after a private conversation.
export async function setGrayTopicAccessAction(userId: string, enabled: boolean) {
    const admin = await getCurrentUser()
    if (!admin || !admin.isAdmin) return
    await setGrayTopicAccess(userId, enabled)
    revalidatePath(`/admin/users/${userId}`)
}