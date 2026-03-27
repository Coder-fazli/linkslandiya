import { ObjectId } from "mongodb";
import { getDb } from "./db";


// Type for order data
  export type Order = {
      _id?: string
      websiteId: string
      websiteName:string
      websiteUrl: string
      publisherId: string
      buyerId: string
      amount: number
      orderType: 'guest_post' | 'link_insertion' | 'casino'
      // Guest post fields
      title: string
      targetUrl: string
      anchorText: string
      content: string
      instructions: string
      // Link insertion / casino fields
      existingPostUrl?: string
      landingPageUrl?: string
      attachmentUrl?: string
      attachmentName?: string
      contentMode?: 'provide' | 'get'
      // Publisher uploaded file (when buyer chose "get content from us")
      publisherFileUrl?: string
      publisherFileName?: string
      status: "pending" | "in_progress" | "review" | "revision" | "completed" | "cancelled"
      createdAt: Date
      publishedLink?: string
      revisionNote?: string
  }


  // Create new order
  export async function createOrder(data: Omit<Order, "_id" | "status" | "createdAt">)
  {
     const db = await getDb()
     const order = {
        ...data, status: "pending",
        createdAt: new Date()
     }
        const result = await db.collection("orders").insertOne(order)
        return result.insertedId
  }

  // Get all orders
    export async function getAllOrders(){
        const db = await getDb()
        const orders = await db.collection("orders").find({}).toArray()
        return orders as unknown as Order[]
    }

   // Get order by id
     export async function getOrderById(id: string){
      const db = await getDb()
      const order = await db.collection("orders").findOne({ _id: new ObjectId(id) })
       return order as unknown as Order
   }

   // Update order status

   export async function updateOrderStatus(id: string, status: Order["status"]){
      const db = await getDb()
      await db.collection("orders").updateOne({ _id: new ObjectId(id) },
      { $set: {status} })
   }

   // Submit published link for buyer review
   export async function submitForReview(id: string, publishedLink: string) {
      const db = await getDb()
      await db.collection("orders").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "review", publishedLink, revisionNote: "" } }
      )
   }

   // Buyer confirms order is complete — credits publisher
   export async function confirmOrderComplete(id: string) {
      const db = await getDb()
      await db.collection("orders").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "completed" } }
      )
   }

   // Buyer requests revision with a note
   export async function requestOrderRevision(id: string, note: string) {
      const db = await getDb()
      await db.collection("orders").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "revision", revisionNote: note } }
      )
   }

   // Update full order

   export async function updateOrder(id: string, data: Partial<Order>) {
      const db = await getDb()

      const { _id, ...updateData } = data

      const result = await db.collection("orders").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )
             return result.modifiedCount
   }

   // Get orders where THIS user is the publisher("Orders Received" for publisher)
  export async function getOrdersByPublisher(publisherId: string) {
      const db = await getDb()
      const orders = await db.collection("orders")
        .find({ publisherId: publisherId })
        .sort({ createdAt: -1 })
        .toArray()
      return orders as unknown as Order[]
  }

  // Get orders where THIS user is the buyer ("MyOrders" for buyer)
  export async function getOrdersByBuyer(buyerId: string) {
    const db = await getDb()
    const orders = await db.collection("orders").find({ buyerId: buyerId }).sort({ createdAt: -1 }).toArray()
    return orders as unknown as Order[]
  }