"use server"
import { z } from "zod"
import { signInSchema, signUpSchema } from "./schemas"
import { redirect } from "next/navigation"
import { generateSalt, hashPassword } from "./core/passwordHasher"
import { getUserByEmail, createUser, switchUserMode, countRegistrationsByIp } from "../lib/user"
import { createSession, deleteSession, getCurrentUser } from "../lib/session"
import { revalidatePath } from "next/cache"
import { updateUserRoles } from "./data/user"
import { isDisposableEmail } from "../lib/blocked-domains"
import { headers } from "next/headers"
import { sendWelcomeEmail } from "../lib/welcome-email"

    
export async function signIn(unsafeData: z.infer<typeof signInSchema>)
{
   const { success, data } = 
    signInSchema.safeParse(unsafeData)
    if (!success) return "Invalid data"

    const user = await getUserByEmail(data.email)
    if (!user) return "Invalid email or password"

    // Account created via Google sign-in has no password
    if (!user.passwordHash || !user.salt) {
        return "This account uses Google sign-in — please use the Google button"
    }

    const passwordHash = await hashPassword(data.password, user.salt)
    if (passwordHash !== user.passwordHash) {
          return "Invalid email or password"
    }
      
       await createSession(user._id!.toString())
       redirect("/admin")
   }

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
   const { success, data } = signUpSchema.safeParse(unsafeData)
   if (!success) return "Unable to create account"

    const existingUser = await getUserByEmail(data.email)
    if (existingUser) return "Email already in use"

    if (isDisposableEmail(data.email)) return "Please use a real email address"

    const headersList = await headers()
    const ip = headersList.get("x-real-ip")
               ?? headersList.get("x-forwarded-for")?.split(",")[0]?.trim()
               ?? "unknown"

    if (ip !== "unknown") {
        const ipCount = await countRegistrationsByIp(ip)
        if (ipCount >= 3) return "Too many accounts registered from this device"
    }

    const salt = generateSalt()
    const passwordHash = await hashPassword(data.password, salt)

    await createUser({
        name: data.name,
        email: data.email,
        passwordHash, salt,
        canBuy: false,
        canPublish: false,
        activeMode: "buyer",
        isAdmin: false,
        hasSelectedRole: false,
        balance: 10,
        registrationIp: ip,
    })
    await sendWelcomeEmail(data.name, data.email)
    redirect("/login")

       }

export async function logOut() {

   await deleteSession()
   redirect("/login")
}

export async function switchMode(mode: "buyer" | "publisher") {
   const user = await getCurrentUser()
   if (!user) redirect("/login")

    await switchUserMode(user._id!.toString(), mode)
    revalidatePath("/admin")
    redirect("/admin")

}


export async function selectUserRoles(canBuy: boolean, canPublish: boolean) { 
   const user = await getCurrentUser()
   if (!user) redirect("/login")

    await updateUserRoles(user._id!.toString(), canBuy, canPublish)
       revalidatePath("/admin")                                       
    redirect("/admin")
}