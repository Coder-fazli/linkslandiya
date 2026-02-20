import { ObjectId } from "mongodb";
import { getDb } from "./db";
import { Website } from "./types";


export async function getAllWebsites() {
  const db = await getDb();
  const websites = await db.collection("websites").find({}).toArray();
  return websites as unknown as Website[];
}

export async function createWebsites(data: any) {
    const db = await getDb();
    const result = await db.collection("websites").insertOne(data);
    return result.insertedId;
}

export async function deleteWebsiteById(id: string) {
   const db = await getDb();

   // First, check current status
   const website = await
   db.collection("websites").findOne({ _id: new    
   ObjectId(id) });

   if (website?.status === 'draft' || !website?.status) {
        // Already draft → delete forever
          const result = await db.collection("websites").deleteOne({ _id: new ObjectId(id) });
          return result.deletedCount; }
         
          else {
              //  Published -> move to draft
              const result = await db.collection("websites").updateOne(
                { _id: new ObjectId(id) },
                { $set: {status: 'draft'} }
              );
              return result.modifiedCount;
          }
   }

export async function getWebsiteById(id: string){
   const db = await getDb();
   const website = await db.collection("websites").findOne({ _id: new ObjectId(id) });
   return website as unknown as Website;
}

// UpdatedWebsite function

export async function UpdatedWebsite(id: string, data: any) {
    const db = await getDb();
    const { _id, ...updateData } = data;

   //Debug
     const found = await db.collection("websites").findOne({ _id: new ObjectId(id) });
        console.log("Found document:", found);

     if (!found) {
       console.log("ERROR: Document not found with _id:", id);
     }

    const result = await db.collection("websites").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

   console.log("matchedCount:",
  result.matchedCount);
      console.log("modifiedCount:",
  result.modifiedCount);

    return result.modifiedCount;
} 

// Get websites owned by THIS user ("My Websites"for publisher)
export async function getWebsitesByOwner(ownerId: string) {
  const db = await getDb()
  const websites = await db.collection("websites").
  find({ ownerId: ownerId }).toArray()
  return websites as unknown as Website[]
}

// Approving website

export async function approveWebsite(id: string){
     const db = await getDb();
     await db.collection("websites").updateOne(
        {_id: new ObjectId(id)},
        {$set: {status: 'published'}}
     )
}

// Rejecting website (moving to draft)

export async function rejectWebsite(id: string) {
   const db = await getDb();
   await db.collection("websites").updateOne(
      {_id: new ObjectId(id)},
      {$set: {status: 'draft'}}
   )
}