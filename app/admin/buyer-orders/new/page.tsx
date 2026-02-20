import Link from "next/link"                  
import OrderForm, { OrderFormData } from "@/components/admin/OrderForm"
import { getWebsiteById } from "@/app/lib/websites"
import { createOrder } from "@/app/lib/orders"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/lib/session"

  export default async function NewOrderPage({ searchParams }: {
    searchParams: Promise<{ websiteId?: string }>
  })
  {

  const { websiteId } = await searchParams
      
     // If no websites in Url, show error
      if (!websiteId) {
        return(
           <div>
                  <h1>Error</h1>
                  <p>No website selected</p>  
                  <Link
                  href="/admin/websites">Go back to
                  websites</Link>
              </div>
        )
      }
      // Fetch website from database
      const website = await getWebsiteById(websiteId)

      if (!website || !website._id) {
        return   <div>Website not found</div> 
      }

      // Server action
      async function createOrderAction(data: OrderFormData) {
              "use server"
              const user = await getCurrentUser()

              if (!user){
              redirect("/login")
    }
              await createOrder({
                  ...data, buyerId: user._id.toString(),
                  publisherId: website.ownerId.toString(),
                  amount: website.price,
                  websiteName: website.name
              })
              redirect("/admin/buyer-orders")
      }

      return (
        <div>
              <h1>New Order</h1>
              <OrderForm
                  websiteId={website._id.toString()}
                  websiteName={website.name}  
                  websiteDA={website.da}      
                  websiteDR={website.dr}      
                  websitePrice={website.price}
                  createOrderAction={createOrderAction}       
              />
          </div>
      )
  }