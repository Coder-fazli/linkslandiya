"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./session"
import { createPackage, updatePackage, deletePackage } from "./packages"

function readPackageForm(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    const price = Number(formData.get("price"))
    const buttonText = String(formData.get("buttonText") ?? "Get Started").trim() || "Get Started"
    const popular = formData.get("popular") === "on"
    const active = formData.get("active") === "on"
    const order = Number(formData.get("order")) || 0
    const features = String(formData.get("features") ?? "")
        .split("\n").map(s => s.trim()).filter(Boolean)
    const includesTitle = String(formData.get("includesTitle") ?? "What's included:").trim() || "What's included:"
    const includesRest = String(formData.get("includes") ?? "")
        .split("\n").map(s => s.trim()).filter(Boolean)

    return {
        name, description, price, buttonText, popular, active, order,
        features, includes: [includesTitle, ...includesRest],
    }
}

export async function createPackageAction(formData: FormData) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return { error: "Not authorized" }
    const data = readPackageForm(formData)
    if (!data.name) return { error: "Name is required." }
    if (!Number.isFinite(data.price) || data.price < 0) return { error: "Enter a valid price." }

    await createPackage(data)
    revalidatePath("/admin/packages")
    revalidatePath("/packages")
    redirect("/admin/packages")
}

export async function updatePackageAction(id: string, formData: FormData) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return { error: "Not authorized" }
    const data = readPackageForm(formData)
    if (!data.name) return { error: "Name is required." }
    if (!Number.isFinite(data.price) || data.price < 0) return { error: "Enter a valid price." }

    await updatePackage(id, data)
    revalidatePath("/admin/packages")
    revalidatePath("/packages")
    redirect("/admin/packages")
}

export async function deletePackageAction(id: string) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return
    await deletePackage(id)
    revalidatePath("/admin/packages")
    revalidatePath("/packages")
}

export async function togglePackageActiveAction(id: string, active: boolean) {
    const admin = await getCurrentUser()
    if (!admin?.isAdmin) return
    await updatePackage(id, { active })
    revalidatePath("/admin/packages")
    revalidatePath("/packages")
}
