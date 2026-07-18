"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./session"
import { getPackageById } from "./packages"
import { createPackageOrder, getPackageOrderById, resolvePackageOrder } from "./package-orders"
import { createConversation, addMessage } from "./inbox"

// Buyer requests a package — creates a lead + an inbox conversation with an
// automatic acknowledgment. No balance is touched; an admin follows up.
export async function requestPackageOrderAction(packageId: string) {
    const user = await getCurrentUser()
    if (!user) return { error: "Please log in to request a package." }

    const pkg = await getPackageById(packageId)
    if (!pkg || !pkg.active) return { error: "This package is no longer available." }

    const conversationId = await createConversation({
        userId: user._id!.toString(),
        topic: "package",
        subject: `Package Request — ${pkg.name} ($${pkg.price}/mo)`,
    })

    const orderId = await createPackageOrder({
        packageId,
        packageName: pkg.name,
        packagePrice: pkg.price,
        buyerId: user._id!.toString(),
        conversationId,
    })

    await addMessage({
        conversationId,
        sender: "system",
        body: [
            `Hello! Your request for the ${pkg.name} package ($${pkg.price}/month) has been received.`,
            ``,
            `Our team will reach out here shortly to confirm the details and get you started.`,
        ].join("\n"),
    })

    revalidatePath("/admin/inbox")
    revalidatePath("/admin/package-orders")
    return { ok: true, conversationId, orderId }
}

export async function adminConfirmPackageOrderAction(orderId: string) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return

    const order = await getPackageOrderById(orderId)
    if (!order) return
    const won = await resolvePackageOrder(orderId, "confirmed", admin._id!.toString())
    if (!won) return

    if (order.conversationId) {
        await addMessage({
            conversationId: order.conversationId,
            sender: "system",
            body: `✅ Your ${order.packageName} package request has been confirmed. Welcome aboard!`,
        })
    }

    revalidatePath("/admin/package-orders")
    revalidatePath(`/admin/inbox/${order.conversationId}`)
}

export async function adminCancelPackageOrderAction(orderId: string) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return

    const order = await getPackageOrderById(orderId)
    if (!order) return
    const won = await resolvePackageOrder(orderId, "cancelled", admin._id!.toString())
    if (!won) return

    if (order.conversationId) {
        await addMessage({
            conversationId: order.conversationId,
            sender: "system",
            body: `Your ${order.packageName} package request was cancelled. Reply here if you have questions.`,
        })
    }

    revalidatePath("/admin/package-orders")
    revalidatePath(`/admin/inbox/${order.conversationId}`)
}
