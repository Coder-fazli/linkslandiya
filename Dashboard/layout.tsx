import { redirect } from "next/navigation"
  import { getCurrentUser } from "@/app/lib/session"
  import Link from "next/link"

  export default async function ({ children }: {
    children: React.ReactNode
  }) {

   const user = await getCurrentUser()

    if (!user)
      { 
        redirect("/login")
      } 
  
       return(
        <div className="dashboard">
     
          {/* Sidebar */}
           <aside className="sidebar">
             <div className="logo">
                <span>Linkslandiya</span>
             </div>\
           </aside>
        </div>
       )
  }