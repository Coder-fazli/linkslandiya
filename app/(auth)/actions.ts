"use server"
import { z } from "zod"
import { signInSchema, signUpSchema } from "./schemas"
import { redirect } from "next/navigation"
import { generateSalt, hashPassword } from "./core/passwordHasher"
import { getUserByEmail, createUser, getCollection, switchUserMode } from "../lib/user"
import { createSession, deleteSession, getCurrentUser } from "../lib/session"
import { revalidatePath } from "next/cache"  

    
export async function signIn(unsafeData: z.infer<typeof signInSchema>)
{
   const { success, data } = 
    signInSchema.safeParse(unsafeData)
    if (!success) return "Invalid data"

    const user = await getUserByEmail(data.email)
    if (!user) return "Invalid email or password"

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

     const salt = generateSalt()
     const passwordHash = await hashPassword(data.password, salt)

       await createUser({
          name: data.name,
          email: data.email,
          passwordHash, salt,
          canBuy: true,
          canPublish: true,
          activeMode: "buyer",
          isAdmin: false
       })
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

