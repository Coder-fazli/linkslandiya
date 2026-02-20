import { ObjectId } from "mongodb";
import { getDb } from "./db";


// Type for order data
  export type Order = {
      _id?: string
      websiteId: string
      websiteName:string
      publisherId: string
      title: string
      targetUrl: string
      anchorText: string
      instructions: string
      status: "pending" | "in_progress" |     
  "completed" | "cancelled"
      createdAt: Date
      buyerId: string 
      amount: number 
      content: string
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
       return order
   }

   // Update order status

   export async function updateOrderStatus(id: string, status: Order["status"]){
      const db = await getDb()

      const result = await db.collection("orders").updateOne({ _id: new ObjectId(id) }, 
      { $set: {status} })
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