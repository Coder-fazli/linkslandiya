import { ObjectId } from "mongodb"
import { getDb } from "./db"

export type Project = {
  _id?: string
  buyerId: string
  name: string
  targetDomain: string
  category?: string
  competitors?: string[]
  note?: string
  archived?: boolean
  createdAt: Date
}

export async function getProjectsByBuyer(buyerId: string): Promise<Project[]> {
  const db = await getDb()
  const projects = await db.collection("projects")
    .find({ buyerId })
    .sort({ createdAt: -1 })
    .toArray()
  return projects as unknown as Project[]
}

export async function createProject(data: Omit<Project, "_id" | "createdAt">) {
  const db = await getDb()
  const result = await db.collection("projects").insertOne({
    ...data,
    archived: false,
    createdAt: new Date(),
  })
  return result.insertedId
}

export async function updateProject(id: string, buyerId: string, data: Partial<Pick<Project, "targetDomain" | "category" | "competitors" | "note">>) {
  const db = await getDb()
  await db.collection("projects").updateOne(
    { _id: new ObjectId(id), buyerId },
    { $set: data }
  )
}

export async function archiveProject(id: string, buyerId: string, archived: boolean) {
  const db = await getDb()
  await db.collection("projects").updateOne(
    { _id: new ObjectId(id), buyerId },
    { $set: { archived } }
  )
}

export async function deleteProject(id: string, buyerId: string) {
  const db = await getDb()
  await db.collection("projects").deleteOne({ _id: new ObjectId(id), buyerId })
}
