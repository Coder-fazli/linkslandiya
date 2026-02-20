"use client"

import { Website } from "@/app/lib/types"
import { useEffect, useState } from "react"

 type WebsiteFormProps = {
      website?: Website
      isDraft?: boolean
      onSave: (website: Website) => void
      onCancel: () => void
      onDirtyChange?: (dirty: boolean) => void
  }


export default function WebsiteForm({ website, onSave, onCancel, isDraft, onDirtyChange }: WebsiteFormProps) {
     
    const [formData, setFormData] = useState<Website>(website || {
          name: "",
          desc: "",
          dofollow: true,
          da: 0,
          dr: 0,
          traffic: 0,
          country: "",
          language: "",
          topic: "",
          price: 0,
          status: 'pending',
          ownerId: "", // Add a default value for ownerId
    })
    
    // Tracks if user hase made any changes to the from(websites admin pane)
    const [isDirty, setIsDirty] = useState(false)
    
    function updateField(field: keyof Website, value: string | number | boolean) {
         setIsDirty(true)  
        setFormData(prev => ({
            ...prev,
               [field]: value
          }))
    }

      useEffect(() => {
        if (isDirty){
         onDirtyChange?.(isDirty)
        }
      }, [isDirty, onDirtyChange])
      
    
    // Warn user if they try to close browser tab with unsaved changes
      useEffect(() => {
        function handleBeforeUnload(e: BeforeUnloadEvent) {
            if (isDirty) {
                e.preventDefault()
                e.returnValue = ""
            }
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload",      
            handleBeforeUnload)
                }, [isDirty])
    
     // Confirm before closing form if there are unsaved changes
      function handleCancel() {
        if(isDirty) {
            const confirmed = window.confirm("You have unsaved changes. Are you sure you want to leave?") 
            if (!confirmed) return 
      }
      onCancel()
        }
        

    return(
          <>
          <div className="form-group">
            <label className="form-label">Website URL <span>*</span></label>
            <input 
            type="url" 
            className="form-input" 
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="https://example.com" />
        </div><div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                    className="form-textarea"
                    id="desc"
                    value={formData.desc}
                    onChange={(e) => updateField("desc", e.target.value)}
                    placeholder="Brief description of the website...">
                </textarea>
            </div>

                <h4 style={{ 
                               margin: "1.5rem 0 1rem", 
                               color: "var(--text-secondary)",
                               fontSize: "0.9rem",
                               }}
                              >SEO Metrics</h4>
                            <div className="form-grid three-col">
                                <div className="form-group">
                                    <label className="form-label">DA (Moz)</label>
                                    <input 
                                    type="number" 
                                    className="form-input" 
                                    value={formData.da}
                                    onChange={(e) => updateField("da", Number(e.target.value))}
                                    placeholder="0-100" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">DR (Ahrefs)</label>
                                    <input 
                                    type="number" 
                                    value={formData.dr}
                                    onChange={(e) => updateField("dr", Number(e.target.value))}
                                    className="form-input" placeholder="0-100" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Monthly Traffic</label>
                                    <input 
                                    type="number" 
                                    className="form-input" 
                                    value={formData.traffic}
                                    onChange={(e) => updateField("traffic", Number(e.target.value))}
                                    placeholder="e.g., 50000" />
                                </div>
                            </div>

                            <h4 style={{
                                margin: "1.5rem 0 1rem",
                                color: "var(--text-secondary)", 
                                fontSize: "0.9rem",
                            }}
                            >Details</h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Country</label>
                                    <select
                                        className="form-select"
                                        value={formData.country}
                                        onChange={(e) => updateField("country", e.target.value)}
                                    >
                                         <option value="">Select Country</option>
                                         <option value="AZ">Azerbaijan</option>
                                          <option value="KZ">Kazakhstan</option>
                                        <option value="US">United States</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="DE">Germany</option>
                                        <option value="FR">France</option>
                                        <option value="ES">Spain</option>
                                        <option value="IT">Italy</option>
                                        <option value="TR">Turkey</option>
                                        <option value="IN">India</option>
                                        <option value="BR">Brazil</option>
                                        <option value="Global">Global</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Language</label>
                                    <select
                                        className="form-select"
                                        value={formData.language}
                                        onChange={(e) => updateField("language", e.target.value)}
                                    >
                                        <option value="">Select Language</option>
                                        <option value="Azerbaijani">Azerbaijan</option>
                                        <option value="Kazakh">Kazakhstan</option>
                                        <option value="English">English</option>
                                        <option value="German">German</option>
                                        <option value="French">French</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="Italian">Italian</option>
                                        <option value="Turkish">Turkish</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Portuguese">Portuguese</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Topic/Category</label>
                                    <select
                                        className="form-select"
                                        value={formData.topic}
                                        onChange={(e) => updateField("topic", e.target.value)}
                                    >
                                        <option value="">Select Topic</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Business">Business</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Health">Health</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                        <option value="Education">Education</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="News">News</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price ($)</label>
                                    <input 
                                    type="number" 
                                    className="form-input" 
                                    value={formData.price}
                                    onChange={(e) => updateField("price", Number(e.target.value))}
                                    placeholder="e.g., 100" />
                                </div>
                            </div>

                          <div className="form-group">
      <label className="form-label">Link
  Type</label>
      <label style={{ display: "flex", alignItems:
   "center", gap: "8px" }}>
          <input
              type="checkbox"
              checked={formData.dofollow}
              onChange={(e) =>
  updateField("dofollow", e.target.checked)}      
          />
          <span>Dofollow Link</span>
      </label>
  </div>

                         <div style={{ display: "flex", gap: "12px", 
  marginTop: "24px" }}>                                 <button className="btn btn-secondary" 
  onClick={handleCancel}>                             
          Cancel 
      </button>
      <button className="btn btn-primary"
  onClick={() => onSave(formData)}>
          { isDraft ? 'Publish' : 'Save Website' }
      </button>
  </div>

                </>
    )
}