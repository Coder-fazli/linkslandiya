"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArticleEditor } from "./ArticleEditor"
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor"



type OrderFormProps = {
  websiteId: string
  websiteName: string
  websiteDA: number
  websiteDR: number
  websitePrice: number
  createOrderAction: (data: OrderFormData) => Promise<void>
}

export type OrderFormData = {
  websiteId: string
  title: string
  targetUrl: string
  anchorText: string
  content: string
  instructions: string
}

export default function OrderForm({
  websiteId,
  websiteName,
  websiteDA,
  websiteDR,
  websitePrice,
  createOrderAction }: OrderFormProps) {

  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter()
  
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent){
      if(isDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
      window.addEventListener("beforeunload", handleBeforeUnload)
      return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [isDirty]
  ) 

  const [formData, setFormData] = useState<OrderFormData>({
    websiteId,
    title: "",
    targetUrl: "",
    anchorText: "",
    content: "",
    instructions: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)


  function updateField(field: keyof OrderFormData, value: string)
   
  {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsDirty(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title || !formData.targetUrl || !formData.anchorText) {
      alert("Please fill in all required fields")
      return
    }
    setIsSubmitting(true)
    try {
      await createOrderAction({
        ...formData,
      })
      setIsDirty(false);
    } catch (error: any) {
      if (error?.digest?.startsWith("NEXT_REDIRECT")) return
      alert("Failed to create order")
      setIsSubmitting(false)
    }
  }

  function handleCancel(){
    if (isDirty){
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to leave?")
     if(!confirmed) return
    }
    router.back()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="card-body">

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ marginBottom: "0.5rem" }}>{websiteName}</h3>
              <div style={{ display: "flex", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                <span>DA: {websiteDA}</span>
                <span>DR: {websiteDR}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>${websitePrice}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Guest Post</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Order Details</h3>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Article Title <span>*</span></label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter the title for your guest post"
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Target URL <span>*</span></label>
              <input
                type="url"
                className="form-input"
                value={formData.targetUrl}
                onChange={(e) => updateField("targetUrl", e.target.value)}
                placeholder="https://yourwebsite.com/page"
                required
              />
              <div className="form-hint">The URL you want to link to in the article</div>
            </div>
            <div className="form-group">
              <label className="form-label">Anchor Text <span>*</span></label>
              <input
                type="text"
                className="form-input"
                value={formData.anchorText}
                onChange={(e) => updateField("anchorText", e.target.value)}
                placeholder="e.g., best SEO tools"
                required
              />
              <div className="form-hint">The clickable text for your link</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Article Content</label>
            <SimpleEditor />
            <div className="form-hint">You can provide your own content or leave empty for our writers</div>
          </div>

          <div className="form-group">
            <label className="form-label">Special Instructions</label>
            <textarea
              className="form-textarea"
              value={formData.instructions}
              onChange={(e) => updateField("instructions", e.target.value)}
              placeholder="Any specific requirements, keywords to include, tone of voice, etc."
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
