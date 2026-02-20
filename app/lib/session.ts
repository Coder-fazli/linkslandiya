import { cookies } from "next/headers";
import { getDb } from "./db";
import { ObjectId } from "mongodb";
import { getUserById } from "./user";

// Session last 7 days
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

export type Session = {
    _id?: ObjectId
    userId: ObjectId
    expiresAt: Date
}

// Create session after login
export async function createSession(userId: string){
      const db = await getDb()

      // Create session in db
      const session = {
        userId: new ObjectId(userId),
        expiresAt: new Date(Date.now() + SESSION_DURATION)
      }

      const result = await db.collection("sessions").insertOne(session)
      const sessionId = result.insertedId.toString()

    // Setting cookie in browser
     const cookieStore = await cookies()
     cookieStore.set("sessionId", sessionId, {
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: "lax",
     expires: session.expiresAt,
     path: "/",
      })
        return sessionId
    }

    // Get current session (like who is logged in)
      export async function getSession(){
        const cookieStore = await cookies()
        const sessionId = cookieStore.get("sessionId")?.value

        if(!sessionId) return null

         const db = await getDb()
         const session = await db.collection("sessions").findOne({
            _id: new ObjectId(sessionId),
            expiresAt: { $gt: new Date() } // Not expired
         })

         if (!session) return null

         return {
            userId: session.userId.toString()
         }
     }

     // Delete session on logout
     export async function deleteSession(){
        const cookieStore = await cookies()
        const sessionId = cookieStore.get("sessionId")?.value
        
        if (sessionId) {
            const db = await getDb()
            await db.collection("sessions").deleteOne({
            _id: new ObjectId(sessionId)
        
        })
    }
       cookieStore.delete("sessionId")
     }

     // Get current logged in user
      export async function getCurrentUser(){
        const session = await getSession()

         if (!session) return null
         const user = await getUserById(session.userId)
         return user
      }