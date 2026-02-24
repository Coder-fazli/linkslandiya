"use client"
 import { useState, useEffect } from "react"
 import { useSearchParams } from "next/navigation"
 import { Website, getFaviconColor, formatTraffic } from "@/app/lib/types";
 import WebsiteForm from "@/components/admin/WebsiteForm";
import { getPublisherWebsites } from "@/app/lib/actions";

export default function WebsitePage() {
  const searchParams = useSearchParams()
  const [editing, setEditing] = useState(false);
  const [editingSite, setEditingSite] = useState<Website | null>(null)
  const [websites, setWebsites] = useState<Website[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'draft'>('all')
  const [isFormDirty, setIsFormDirty] = useState(false)

  // Action animation 
 
  const [loadingAction, setLoadingAction] = useState<string |      
  null>(null)
  // null = not loading
  // "saving" = saving in progress
  // "deleting" = deleting in progress

   // Check if "Add New" was clicked from header
   useEffect(() => {
      if (searchParams.get("action") === "add") {
        // If editing with unsaved changes, show warning
        if (editing && isFormDirty) {
          const confirmed = window.confirm("You have unsaved changes. Are you sure?")
          if (!confirmed) {
              // Go back to previous URL  
                  window.history.back()       
                  return
          }
        }
         setEditing(true)
         setEditingSite(null)
      } else {
        setEditing(false)
      }
   }, [searchParams])

   useEffect(() => {
      async function loadWebsites() {
          const data = await getPublisherWebsites()
          setWebsites(data)
      }
       loadWebsites()
   }, [])

    // Save website to Db
      async function handleSave(website: Website) {
         
        const isEditing = !!website._id  // true if website already exists
           setLoadingAction("saving") // Show Loading

        const response = await fetch('/api/websites', {
            method: isEditing ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(website)  
        })
        
        if(response.ok) {
            // refresh list
            const data = await getPublisherWebsites()
            setWebsites(data)
            // Close from
            setEditing(false)
        }
        setLoadingAction(null) // Hide Loading
    }
    
    // Confirm before deleting
      async function handleDelete(websiteId: string) {
      const confirmed = window.confirm("Are you sure you wan to delete this website?")

      if (!confirmed) return
        // Send DELETE request
        setLoadingAction("deleting")  // ← Show "Deleting..."
        const response = await fetch('/api/websites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: websiteId })
        })

        if (response.ok){
          // Refresh the list
          const data = await fetch('/api/websites').then(res => res.json())
          setWebsites(data)
        }
        setLoadingAction(null)  // ← Hide "Deleting..."
      }
      

    return(
        <>

         <div className="section-content active" id="section-websites">
                <div className="tabs">
                    <div
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >All Websites</div>
                    <div
                        className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >Active</div>
                    <div
                        className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >Pending</div>
                    <div
                        className={`tab draft ${activeTab === 'draft' ? 'active' : ''}`}
                        onClick={() => setActiveTab('draft')}
                    >Draft</div>
                </div>

         {editing ? (
            <div id="website-edit" className="edit-page">

                          <div className="back-link" onClick={() => {
                            if (isFormDirty) {
                              const confirmed = window.confirm("You have unsaved changes. Are you sure?")
                                if(!confirmed) return
                            }
                             setEditing(false)
                          }}>
                   <svg viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5"    
                  y2="12"></line>
                  <polyline points="12 19 5 12 12 
                   5"></polyline>
              </svg>
                      Back to Websites
          </div>
          <div className="card">
              <div className="card-body">
                  <WebsiteForm
                      key={editingSite?._id || 'new' }
                      website={editingSite || undefined} 
                      isDraft={editingSite?.status === 'draft'}
                      onCancel={() => 
                      setEditing(false)}
                      onSave={handleSave}
                      onDirtyChange={setIsFormDirty}
                  />
              </div>
          </div>
      </div>
  ) : (

               <div id="websites-list">
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                        <button className="btn btn-primary" onClick={() => { setEditing(true); setEditingSite(null); }}>
                            + Add New Website
                        </button>
                    </div>
                    <div className="card">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Website</th>
                                    <th>DA</th>
                                    <th>DR</th>
                                    <th>Traffic</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {websites
                                .filter(site => {
                                    if (activeTab === 'all') return site.status !=='draft'
                                    if (activeTab === 'draft') return site.status === 'draft'
                                    if (activeTab === 'active') return site.status === 'published'
                                    if (activeTab === 'pending') return site.status === 'pending'
                                    return true
                                })
                                .map(site => (
                                <tr key={site._id}>
                                  <td>
          <div className="user-cell">
            <div
              className="user-cell-avatar"
              style={{background: `linear-gradient(135deg,
   ${getFaviconColor(site.name)},
  ${getFaviconColor(site.name)}dd)`}}
            >
              {site.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-cell-info">
              <span
  className="user-cell-name">{site.name}</span>
              <span
  className="user-cell-email">{site.topic}</span>
            </div>
          </div>
        </td>
        <td>{site.da}</td>
        <td>{site.dr || '-'}</td>
        <td>{formatTraffic(site.traffic)}</td>
        <td>${site.price}</td>
        <td><span className={`status-badge ${site.status}`}>
          {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
          </span></td>
        <td>
          <div className="action-btns">
            <button 
            className="action-btn edit"
                    onClick={() => {
                    setEditingSite(site);
                    setEditing(true);
            }}>
              <svg viewBox="0 0 24 24" fill="none"        
  stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 
  0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3    
  3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button 
            className="action-btn delete"
             onClick={() =>{
              if (site._id) handleDelete(site._id)}}
            >        
              <svg viewBox="0 0 24 24" fill="none"        
  stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21
  6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 
  1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>  
              </svg>
            </button>
          </div>
        </td>
      </tr>
    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

         )
        }       

       { /*  The Overlay */} 
  {loadingAction && (
      <div className="loading-overlay">
          <div className="dot-spinner">
              <div></div><div></div><div></div><div></div>
              <div></div><div></div><div></div><div></div>
          </div>
          <p className="loading-text">
              {loadingAction === "saving" && "Saving..."}
              {loadingAction === "deleting" && "Deleting..."}      
          </p>
      </div>
  )}
      </div>


        </>
    );
}