import Link from "next/link"
import OrderForm, { OrderFormData } from "@/components/admin/OrderForm"
import { getWebsiteById } from "@/app/lib/websites"
import { createOrder } from "@/app/lib/orders"
import { adjustUserBalance } from "@/app/lib/user"
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
        if (!user) return redirect("/login")
        if (!website) return

        // Pick correct price based on order type
        const amount =
          data.orderType === 'link_insertion' ? (website.linkInsertionPrice ?? website.price) :
          data.orderType === 'casino' ? (website.casinoPrice ?? website.price) :
          website.price

        await createOrder({
          ...data,
          buyerId: user._id.toString(),
          publisherId: website.ownerId.toString(),
          amount,
          websiteName: website.name,
          websiteUrl: website.url,
        })

        // Deduct from buyer, credit publisher
        await adjustUserBalance(user._id.toString(), -amount)
        await adjustUserBalance(website.ownerId.toString(), amount)

        redirect("/admin/buyer-orders")
      }

      const user = await getCurrentUser()

      return (
        <div>
              <h1>New Order</h1>
              <OrderForm
                  websiteId={website._id.toString()}
                  websiteName={website.name}
                  websiteUrl={website.url}
                  websiteDA={website.da}
                  websiteDR={website.dr}
                  websitePrice={website.price}
                  websiteLinkInsertionPrice={website.linkInsertionPrice}
                  websiteCasinoPrice={website.casinoPrice}
                  websiteLanguage={website.language}
                  userBalance={user?.balance ?? 0}
                  createOrderAction={createOrderAction}
              />
          </div>
      )
  }