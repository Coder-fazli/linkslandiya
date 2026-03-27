"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor"
import { cleanDomain } from "@/app/lib/types"
import Link from "next/link"

type OrderType = 'guest_post' | 'link_insertion' | 'casino'

type OrderFormProps = {
  websiteId: string
  websiteName: string
  websiteUrl: string
  websiteDA: number
  websiteDR: number
  websitePrice: number
  websiteLinkInsertionPrice?: number
  websiteCasinoPrice?: number
  websiteLanguage?: string
  userBalance: number
  createOrderAction: (data: OrderFormData) => Promise<void>
}

export type OrderFormData = {
  websiteId: string
  orderType: OrderType
  title: string
  targetUrl: string
  anchorText: string
  content: string
  instructions: string
  existingPostUrl: string
  landingPageUrl: string
}

export default function OrderForm({
  websiteId,
  websiteName,
  websiteUrl,
  websiteDA,
  websiteDR,
  websitePrice,
  websiteLinkInsertionPrice,
  websiteCasinoPrice,
  websiteLanguage,
  userBalance,
  createOrderAction,
}: OrderFormProps) {

  const [orderType, setOrderType] = useState<OrderType>('guest_post')
  const [isDirty, setIsDirty] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<OrderFormData>({
    websiteId,
    orderType: 'guest_post',
    title: "",
    targetUrl: "",
    anchorText: "",
    content: "",
    instructions: "",
    existingPostUrl: "",
    landingPageUrl: "",
  })

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) { e.preventDefault(); e.returnValue = "" }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  function updateField(field: keyof OrderFormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  function handleTypeChange(type: OrderType) {
    setOrderType(type)
    setFormData(prev => ({ ...prev, orderType: type }))
    setIsDirty(true)
  }

  function handleClear() {
    setFormData(prev => ({
      ...prev,
      title: "", targetUrl: "", anchorText: "", content: "",
      instructions: "", existingPostUrl: "", landingPageUrl: "",
    }))
  }

  const selectedPrice =
    orderType === 'link_insertion' ? (websiteLinkInsertionPrice ?? 0) :
    orderType === 'casino' ? (websiteCasinoPrice ?? 0) :
    websitePrice

  const shortfall = selectedPrice - userBalance
  const hasEnoughBalance = userBalance >= selectedPrice

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hasEnoughBalance) return

    if (orderType === 'guest_post' && (!formData.title || !formData.targetUrl || !formData.anchorText)) {
      alert("Please fill in all required fields")
      return
    }
    if ((orderType === 'link_insertion' || orderType === 'casino') &&
        (!formData.existingPostUrl || !formData.anchorText || !formData.landingPageUrl)) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await createOrderAction({ ...formData, orderType })
      setIsDirty(false)
    } catch (error: any) {
      if (error?.digest?.startsWith("NEXT_REDIRECT")) return
      alert("Failed to create order")
      setIsSubmitting(false)
    }
  }

  function handleCancel() {
    if (isDirty) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to leave?")
      if (!confirmed) return
    }
    router.back()
  }

  const tabs: { type: OrderType; label: string; price?: number }[] = [
    { type: 'guest_post', label: 'Guest Post', price: websitePrice },
    ...(websiteLinkInsertionPrice != null ? [{ type: 'link_insertion' as OrderType, label: 'Link Insertion', price: websiteLinkInsertionPrice }] : []),
    ...(websiteCasinoPrice != null ? [{ type: 'casino' as OrderType, label: 'Casino', price: websiteCasinoPrice }] : []),
  ]

  return (
    <form onSubmit={handleSubmit}>

      {/* Website info bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        background: 'var(--card-bg)', border: '1px solid var(--border-color)',
        borderRadius: '12px', padding: '14px 20px', marginBottom: '16px',
      }}>
        <span style={{ fontWeight: 700, fontSize: '15px' }}>{cleanDomain(websiteUrl, websiteName)}</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>DA: <strong>{websiteDA}</strong></span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>DR: <strong>{websiteDR}</strong></span>
        <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: '18px', color: 'var(--brand-primary)' }}>
          ${selectedPrice}
        </span>
      </div>

      {/* Tab selector */}
      <div style={{
        display: 'flex', background: 'var(--card-bg)',
        border: '1px solid var(--border-color)', borderRadius: '12px',
        padding: '6px', gap: '4px', marginBottom: '16px',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.type}
            type="button"
            onClick={() => handleTypeChange(tab.type)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
              background: orderType === tab.type ? 'var(--brand-primary)' : 'transparent',
              color: orderType === tab.type ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: orderType === tab.type ? 'rgba(255,255,255,0.7)' : '#cbd5e1',
              flexShrink: 0,
            }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Balance warning */}
      {!hasEnoughBalance && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff7ed', border: '1px solid #fed7aa',
          borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{ fontSize: '14px', color: '#9a3412', fontWeight: 500 }}>
              You need <strong>${shortfall.toFixed(2)} more</strong> to place this order. Your balance: <strong>${userBalance.toFixed(2)}</strong>
            </span>
          </div>
          <Link href="/admin/settings" style={{
            padding: '7px 16px', background: '#f97316', color: '#fff',
            borderRadius: '9999px', fontWeight: 700, fontSize: '13px',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            + Add Funds
          </Link>
        </div>
      )}

      {/* Form body */}
      <div className="card">
        <div className="card-header"><h3>Order Details</h3></div>
        <div className="card-body">

          {/* Guest Post form */}
          {orderType === 'guest_post' && (
            <>
              <div className="form-group">
                <label className="form-label">Article Title <span>*</span></label>
                <input
                  type="text" className="form-input"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Enter the title for your guest post"
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Target URL <span>*</span></label>
                  <input
                    type="url" className="form-input"
                    value={formData.targetUrl}
                    onChange={(e) => updateField("targetUrl", e.target.value)}
                    placeholder="https://yourwebsite.com/page"
                  />
                  <div className="form-hint">The URL you want to link to in the article</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Anchor Text <span>*</span></label>
                  <input
                    type="text" className="form-input"
                    value={formData.anchorText}
                    onChange={(e) => updateField("anchorText", e.target.value)}
                    placeholder="e.g., best SEO tools"
                  />
                  <div className="form-hint">The clickable text for your link</div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Article Content</label>
                <SimpleEditor onChange={(html) => updateField("content", html)} />
                <div className="form-hint">You can provide your own content or leave empty for our writers</div>
              </div>
              <div className="form-group">
                <label className="form-label">Special Instructions</label>
                <textarea
                  className="form-textarea"
                  value={formData.instructions}
                  onChange={(e) => updateField("instructions", e.target.value)}
                  placeholder="Any specific requirements, keywords, tone of voice, etc."
                />
              </div>
            </>
          )}

          {/* Link Insertion / Casino form */}
          {(orderType === 'link_insertion' || orderType === 'casino') && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Existing Post URL <span>*</span></label>
                  <input
                    type="url" className="form-input"
                    value={formData.existingPostUrl}
                    onChange={(e) => updateField("existingPostUrl", e.target.value)}
                    placeholder="eg. https://example.com/post"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Anchor Text <span>*</span></label>
                  <input
                    type="text" className="form-input"
                    value={formData.anchorText}
                    onChange={(e) => updateField("anchorText", e.target.value)}
                    placeholder="Enter Anchor Text"
                  />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Landing Page URL <span>*</span></label>
                  <input
                    type="url" className="form-input"
                    value={formData.landingPageUrl}
                    onChange={(e) => updateField("landingPageUrl", e.target.value)}
                    placeholder="eg. https://example.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Language <span>*</span></label>
                  <input
                    type="text" className="form-input"
                    value={websiteLanguage || ''}
                    readOnly
                    style={{ background: 'var(--input-bg, #f1f5f9)', cursor: 'not-allowed' }}
                  />
                  {websiteLanguage && (
                    <div className="form-hint">The publisher only accepts content in {websiteLanguage}</div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Special Note</label>
                <textarea
                  className="form-textarea"
                  value={formData.instructions}
                  onChange={(e) => updateField("instructions", e.target.value)}
                  placeholder="Add special note"
                />
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || !hasEnoughBalance}>
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </button>
          </div>

        </div>
      </div>
    </form>
  )
}
