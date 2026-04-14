import { getClientPromise } from "@/mongodb"

// Get database instance
export async function getDb() {
    const client = await getClientPromise()
    const dbName = process.env.MONGODB_DB
    if (!dbName) throw new Error("MONGODB_DB is not set");
    return client.db(dbName);
}
