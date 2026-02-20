import clientPromise from "@/lib/mongodb"

// Get database instance
export async function getDb() {
    const client = await clientPromise
    const dbName = process.env.MONGODB_DB
    if (!dbName) throw new Error("MONGODB_DB is not set");
    return client.db(dbName);
}
