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


const PRICE_INCREASE_LIMIT = 0.30 // 30% max increase

export default function WebsiteForm({ website, onSave, onCancel, isDraft, onDirtyChange }: WebsiteFormProps) {

    // Store original prices to enforce the 30% increase cap
    const originalPrice = website?.price ?? null
    const originalLinkPrice = website?.linkInsertionPrice ?? null
    const originalCasinoPrice = website?.casinoPrice ?? null

    const [formData, setFormData] = useState<Website>(website || {
          name: "",
          url: "",
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
    
    // Tracks if user has made any changes to the form (websites admin pane)
    const [isDirty, setIsDirty] = useState(false)
    const [urlError, setUrlError] = useState(false)

    // Raw string values for number inputs so user can clear and retype freely
    const [raw, setRaw] = useState({
        da:               String(website?.da               ?? ''),
        dr:               String(website?.dr               ?? ''),
        traffic:          String(website?.traffic          ?? ''),
        price:            String(website?.price            ?? ''),
        linkInsertionPrice: String(website?.linkInsertionPrice ?? ''),
        casinoPrice:      String(website?.casinoPrice      ?? ''),
    })

    function updateNumber(field: 'da' | 'dr' | 'traffic' | 'price' | 'linkInsertionPrice' | 'casinoPrice', text: string) {
        setRaw(prev => ({ ...prev, [field]: text }))
        const num = text === '' ? 0 : Number(text)
        if (!isNaN(num)) updateField(field, num === 0 && text === '' ? 0 : num)
    }

    // Price validation helpers
    function isPriceOverLimit(newPrice: number, original: number | null) {
        if (original === null || original === 0) return false
        return newPrice > original * (1 + PRICE_INCREASE_LIMIT)
    }

    const guestPriceOverLimit = isPriceOverLimit(formData.price, originalPrice)
    const linkPriceOverLimit = formData.linkInsertionPrice != null && isPriceOverLimit(formData.linkInsertionPrice, originalLinkPrice)
    const casinoPriceOverLimit = formData.casinoPrice != null && isPriceOverLimit(formData.casinoPrice, originalCasinoPrice)
    
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
            style={urlError ? { borderColor: '#ef4444' } : {}}
            value={formData.url || ''}
            onChange={(e) => {
              setUrlError(false)
              updateField("url", e.target.value)
              updateField("name", e.target.value)
            }}
            placeholder="https://example.com" />
            {urlError && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                Please enter a valid URL starting with https://
              </p>
            )}
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
                                    type="text" inputMode="numeric" pattern="[0-9]*"
                                    className="form-input"
                                    value={raw.da}
                                    onChange={(e) => updateNumber("da", e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="0-100" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">DR (Ahrefs)</label>
                                    <input
                                    type="text" inputMode="numeric" pattern="[0-9]*"
                                    className="form-input"
                                    value={raw.dr}
                                    onChange={(e) => updateNumber("dr", e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="0-100" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Monthly Traffic</label>
                                    <input
                                    type="text" inputMode="numeric" pattern="[0-9]*"
                                    className="form-input"
                                    value={raw.traffic}
                                    onChange={(e) => updateNumber("traffic", e.target.value.replace(/[^0-9]/g, ''))}
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
                                    <label className="form-label">Guest Post Price ($)</label>
                                    <input
                                    type="text" inputMode="numeric" pattern="[0-9]*"
                                    className="form-input"
                                    value={raw.price}
                                    onChange={(e) => updateNumber("price", e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="e.g., 100" />
                                    {guestPriceOverLimit && originalPrice !== null && (
                                        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                                            Max allowed: ${Math.floor(originalPrice * (1 + PRICE_INCREASE_LIMIT))} (30% above current price)
                                        </p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Link Insertion Price ($)</label>
                                    <input
                                    type="text" inputMode="numeric" pattern="[0-9]*"
                                    className="form-input"
                                    value={raw.linkInsertionPrice}
                                    onChange={(e) => {
                                        const t = e.target.value.replace(/[^0-9]/g, '')
                                        setRaw(prev => ({ ...prev, linkInsertionPrice: t }))
                                        updateField("linkInsertionPrice", t === '' ? null as any : Number(t))
                                    }}
                                    placeholder="e.g., 80" />
                                    {linkPriceOverLimit && originalLinkPrice !== null && (
                                        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                                            Max allowed: ${Math.floor(originalLinkPrice * (1 + PRICE_INCREASE_LIMIT))} (30% above current price)
                                        </p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Casino Price ($)</label>
                                    <input
                                    type="text" inputMode="numeric" pattern="[0-9]*"
                                    className="form-input"
                                    value={raw.casinoPrice}
                                    onChange={(e) => {
                                        const t = e.target.value.replace(/[^0-9]/g, '')
                                        setRaw(prev => ({ ...prev, casinoPrice: t }))
                                        updateField("casinoPrice", t === '' ? null as any : Number(t))
                                    }}
                                    placeholder="e.g., 200" />
                                    {casinoPriceOverLimit && originalCasinoPrice !== null && (
                                        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                                            Max allowed: ${Math.floor(originalCasinoPrice * (1 + PRICE_INCREASE_LIMIT))} (30% above current price)
                                        </p>
                                    )}
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
  disabled={guestPriceOverLimit || linkPriceOverLimit || casinoPriceOverLimit}
  onClick={() => {
    const url = formData.url || ''
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrlError(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    onSave(formData)
  }}>
          { isDraft ? 'Publish' : 'Save Website' }
      </button>
  </div>

                </>
    )
}