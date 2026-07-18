import { ObjectId } from "mongodb";
import { getDb } from "./db";
import { Website } from "./types";


export async function getAllWebsites() {
  const db = await getDb();
  const websites = await db.collection("websites").find({}).toArray();
  return websites.map(w => ({ ...w, _id: w._id.toString() })) as unknown as Website[];
}

 export async function getPublishedWebsites() {                             
    const db = await getDb();                   
    const websites = await db.collection("websites").find({ status:          
  "published" }).toArray();                                                  
    return websites.map(w => ({ ...w, _id: w._id.toString() })) as unknown as
   Website[];                                                                
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

   if (website?.status === 'draft' || website?.status === 'pending' || website?.status === 'rejected' || !website?.status) {
        // Draft, pending, or rejected → delete forever
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
   if (!website) return null;
   return { ...website, _id: website._id.toString() } as unknown as Website;
}

// UpdatedWebsite function

export async function UpdatedWebsite(id: string, ownerId: string, data: any) {
    const db = await getDb();
    const { _id, ...updateData } = data;

    const result = await db.collection("websites").updateOne(
      { _id: new ObjectId(id), ownerId: ownerId },
      { $set: updateData }
    );

    return result.modifiedCount;
}

// Get websites owned by THIS user ("My Websites"for publisher)
export async function getWebsitesByOwner(ownerId: string) {
  const db = await getDb()
  const websites = await db.collection("websites").find({ ownerId: ownerId }).toArray()
  return websites.map(w => ({ ...w, _id: w._id.toString() })) as unknown as Website[]
}

// Admin updates any website fields
export async function adminUpdateWebsite(id: string, data: Partial<Website>) {
    const db = await getDb();
    const { _id, ...updateData } = data as any
    await db.collection("websites").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    )
}

// Approving website

export async function approveWebsite(id: string){
     const db = await getDb();
     await db.collection("websites").updateOne(
        {_id: new ObjectId(id)},
        {$set: {status: 'published'}}
     )
}

// Rejecting website

export async function rejectWebsite(id: string) {
   const db = await getDb();
   await db.collection("websites").updateOne(
      {_id: new ObjectId(id)},
      {$set: {status: 'rejected'}}
   )
}

// Save Publisher edits into Waiting room

// Websites waiting for admin review: new submissions + edits pending approval
export async function countWebsitesNeedingReview() {
   const db = await getDb();
   return db.collection("websites").countDocuments({
      $or: [{ status: "pending" }, { pendingData: { $exists: true, $ne: null } }]
   })
}

export async function savePendingChanges(id: string, ownerId: string, data: Partial<Website>) {
   const db = await getDb();
   const result = await db.collection("websites").updateOne(
   { _id: new ObjectId(id), ownerId: ownerId },
   { $set: { pendingData: data } }
   )
   return result.modifiedCount
}

// Admin approves pending changes - copy pendginData into main fields

export async function approvePendingChanges(id: string) {
   const db = await getDb();
   const website = await db.collection("websites").findOne({
      _id: new ObjectId(id)
   })
   if (!website?.pendingData) return 
   const { _id, ...updates } = website.pendingData as any
   await db.collection("websites").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates, $unset: { pendingData: "" } }
   )
}

export async function rejectPendingChanges(id: string) {
   const db = await getDb();
   await db.collection("websites").updateOne({
      _id: new ObjectId(id)
   }, {
      $unset: { pendingData: "" }
   })
}