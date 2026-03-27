"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor"
import { cleanDomain } from "@/app/lib/types"
import Link from "next/link"

type OrderType = 'guest_post' | 'link_insertion' | 'casino'
type ContentMode = 'provide' | 'get'

const ALLOWED_EXTENSIONS = ['.doc', '.docx']
const ALLOWED_MIME_TYPES = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

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
  contentMode: ContentMode
  title: string
  targetUrl: string
  anchorText: string
  content: string
  instructions: string
  existingPostUrl: string
  landingPageUrl: string
  attachmentUrl: string
  attachmentName: string
}

function validateFile(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `Invalid file type "${ext}". Only .doc and .docx files are accepted.`
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type) && file.type !== '') {
    return 'Invalid file format. Only Word documents (.doc, .docx) are accepted.'
  }
  if (file.size === 0) {
    return 'The file is empty. Please upload a valid document.'
  }
  if (file.size > MAX_SIZE_BYTES) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1)
    return `File too large (${sizeMB} MB). Maximum allowed size is ${MAX_SIZE_MB} MB.`
  }
  return null
}

export default function OrderForm({
  websiteId, websiteName, websiteUrl, websiteDA, websiteDR,
  websitePrice, websiteLinkInsertionPrice, websiteCasinoPrice,
  websiteLanguage, userBalance, createOrderAction,
}: OrderFormProps) {

  const [orderType, setOrderType] = useState<OrderType>('guest_post')
  const [contentMode, setContentMode] = useState<ContentMode>('provide')
  const [isDirty, setIsDirty] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [formData, setFormData] = useState<OrderFormData>({
    websiteId, orderType: 'guest_post', contentMode: 'provide',
    title: '', targetUrl: '', anchorText: '', content: '',
    instructions: '', existingPostUrl: '', landingPageUrl: '',
    attachmentUrl: '', attachmentName: '',
  })

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
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

  function handleModeChange(mode: ContentMode) {
    setContentMode(mode)
    setFormData(prev => ({ ...prev, contentMode: mode }))
    setSelectedFile(null)
    setFileError(null)
  }

  function handleClear() {
    setFormData(prev => ({
      ...prev, title: '', targetUrl: '', anchorText: '', content: '',
      instructions: '', existingPostUrl: '', landingPageUrl: '',
      attachmentUrl: '', attachmentName: '',
    }))
    setSelectedFile(null)
    setFileError(null)
  }

  function handleFileSelect(file: File) {
    setFileError(null)
    const error = validateFile(file)
    if (error) { setFileError(error); return }
    setSelectedFile(file)
    setIsDirty(true)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const selectedPrice =
    orderType === 'link_insertion' ? (websiteLinkInsertionPrice ?? 0) :
    orderType === 'casino' ? (websiteCasinoPrice ?? 0) :
    websitePrice

  const shortfall = selectedPrice - userBalance
  const hasEnoughBalance = userBalance >= selectedPrice

  const showContentTabs = orderType === 'guest_post' || orderType === 'casino'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hasEnoughBalance) return

    // Validate required fields
    if (orderType === 'link_insertion') {
      if (!formData.existingPostUrl || !formData.anchorText || !formData.landingPageUrl) {
        alert('Please fill in all required fields')
        return
      }
    } else {
      // guest_post or casino
      if (!formData.targetUrl || !formData.anchorText) {
        alert('Please fill in Target URL and Anchor Text')
        return
      }
      if (contentMode === 'provide' && !selectedFile && !formData.attachmentUrl) {
        setFileError('Please upload your content file (.doc or .docx)')
        return
      }
    }

    setIsSubmitting(true)
    try {
      let attachmentUrl = formData.attachmentUrl
      let attachmentName = formData.attachmentName

      // Upload file if provided
      if (selectedFile) {
        setIsUploading(true)
        const fd = new FormData()
        fd.append('file', selectedFile)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) {
          setFileError(data.error || 'Upload failed. Please try again.')
          setIsSubmitting(false)
          setIsUploading(false)
          return
        }
        attachmentUrl = data.url
        attachmentName = data.filename
        setIsUploading(false)
      }

      await createOrderAction({ ...formData, orderType, contentMode, attachmentUrl, attachmentName })
      setIsDirty(false)
    } catch (error: any) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) return
      alert('Failed to create order')
      setIsSubmitting(false)
      setIsUploading(false)
    }
  }

  function handleCancel() {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) return
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
      <div className="card" style={{ marginBottom: '12px' }}>
        <div className="card-body" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '16px' }}>{cleanDomain(websiteUrl, websiteName)}</span>
            <span style={{ background: '#f1f5f9', borderRadius: '6px', padding: '3px 10px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
              DA: <strong style={{ color: '#0f172a' }}>{websiteDA}</strong>
            </span>
            <span style={{ background: '#f1f5f9', borderRadius: '6px', padding: '3px 10px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
              DR: <strong style={{ color: '#0f172a' }}>{websiteDR}</strong>
            </span>
            <span style={{ marginLeft: '8px', fontWeight: 800, fontSize: '20px', color: 'var(--brand-primary)' }}>${selectedPrice}</span>
          </div>
        </div>
      </div>

      {/* Order type tabs */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <div className="card-body" style={{ padding: '8px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {tabs.map(tab => (
              <button key={tab.type} type="button" onClick={() => handleTypeChange(tab.type)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '11px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
                background: orderType === tab.type ? 'var(--brand-primary)' : '#f8fafc',
                color: orderType === tab.type ? '#fff' : '#64748b',
                boxShadow: orderType === tab.type ? '0 2px 8px rgba(0,180,216,0.3)' : 'none',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: orderType === tab.type ? 'rgba(255,255,255,0.8)' : '#cbd5e1' }} />
                {tab.label}
                {tab.price != null && (
                  <span style={{ marginLeft: '4px', fontSize: '12px', fontWeight: 700, color: orderType === tab.type ? 'rgba(255,255,255,0.85)' : '#94a3b8' }}>${tab.price}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Balance warning */}
      {!hasEnoughBalance && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff7ed', border: '1px solid #fed7aa',
          borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', gap: '12px',
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
          <Link href="/admin/settings" style={{ padding: '7px 16px', background: '#f97316', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            + Add Funds
          </Link>
        </div>
      )}

      {/* Form body */}
      <div className="card">
        <div className="card-body">

          {/* Content mode sub-tabs (Guest Post + Casino only) */}
          {showContentTabs && (
            <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '24px', gap: '0' }}>
              {(['provide', 'get'] as ContentMode[]).map(mode => (
                <button key={mode} type="button" onClick={() => handleModeChange(mode)} style={{
                  padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '14px', color: contentMode === mode ? 'var(--brand-primary)' : '#64748b',
                  borderBottom: contentMode === mode ? '2px solid var(--brand-primary)' : '2px solid transparent',
                  marginBottom: '-2px', transition: 'all 0.2s',
                }}>
                  {mode === 'provide' ? 'Provide Content' : 'Get Content from Us'}
                </button>
              ))}
            </div>
          )}

          {/* Language row */}
          {websiteLanguage && (
            <div className="form-group">
              <label className="form-label">Language <span>*</span></label>
              <input type="text" className="form-input" value={websiteLanguage} readOnly
                style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
              <div className="form-hint">The publisher only accepts content in {websiteLanguage}</div>
            </div>
          )}

          {/* LINK INSERTION form */}
          {orderType === 'link_insertion' && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Existing Post URL <span>*</span></label>
                  <input type="url" className="form-input" value={formData.existingPostUrl}
                    onChange={(e) => updateField('existingPostUrl', e.target.value)}
                    placeholder="eg. https://example.com/post" />
                </div>
                <div className="form-group">
                  <label className="form-label">Anchor Text <span>*</span></label>
                  <input type="text" className="form-input" value={formData.anchorText}
                    onChange={(e) => updateField('anchorText', e.target.value)}
                    placeholder="Enter Anchor Text" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Landing Page URL <span>*</span></label>
                <input type="url" className="form-input" value={formData.landingPageUrl}
                  onChange={(e) => updateField('landingPageUrl', e.target.value)}
                  placeholder="eg. https://example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Special Note</label>
                <textarea className="form-textarea" value={formData.instructions}
                  onChange={(e) => updateField('instructions', e.target.value)}
                  placeholder="Add special note" />
              </div>
            </>
          )}

          {/* GUEST POST / CASINO — Provide Content */}
          {showContentTabs && contentMode === 'provide' && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Target URL <span>*</span></label>
                  <input type="url" className="form-input" value={formData.targetUrl}
                    onChange={(e) => updateField('targetUrl', e.target.value)}
                    placeholder="https://yourwebsite.com/page" />
                  <div className="form-hint">The URL you want to link to</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Anchor Text <span>*</span></label>
                  <input type="text" className="form-input" value={formData.anchorText}
                    onChange={(e) => updateField('anchorText', e.target.value)}
                    placeholder="e.g., best SEO tools" />
                </div>
              </div>

              {/* File upload */}
              <div className="form-group">
                <label className="form-label">
                  Article File <span>*</span>
                  <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: '8px', fontSize: '12px' }}>
                    Supports only .doc, .docx — max {MAX_SIZE_MB} MB
                  </span>
                </label>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${fileError ? '#ef4444' : isDragging ? 'var(--brand-primary)' : selectedFile ? '#22c55e' : '#cbd5e1'}`,
                    borderRadius: '10px', padding: '32px 20px', textAlign: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: isDragging ? 'var(--brand-primary-bg, #e0f7fe)' : selectedFile ? '#f0fdf4' : '#fafafa',
                  }}
                >
                  <input
                    ref={fileInputRef} type="file" accept=".doc,.docx" style={{ display: 'none' }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
                  />
                  {selectedFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span style={{ fontWeight: 600, color: '#15803d', fontSize: '14px' }}>{selectedFile.name}</span>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setFileError(null) }}
                        style={{ marginLeft: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" style={{ margin: '0 auto 10px' }}>
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                      </svg>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                        Drop file here or <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Browse</span>
                      </p>
                      <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12px' }}>Only .doc and .docx files are supported</p>
                    </>
                  )}
                </div>

                {fileError && (
                  <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {fileError}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Special Instructions</label>
                <textarea className="form-textarea" value={formData.instructions}
                  onChange={(e) => updateField('instructions', e.target.value)}
                  placeholder="Any specific requirements, keywords, tone of voice, etc." />
              </div>
            </>
          )}

          {/* GUEST POST / CASINO — Get Content from Us */}
          {showContentTabs && contentMode === 'get' && (
            <>
              <div className="form-group">
                <label className="form-label">Article Title <span>*</span></label>
                <input type="text" className="form-input" value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter the title for your article" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Target URL <span>*</span></label>
                  <input type="url" className="form-input" value={formData.targetUrl}
                    onChange={(e) => updateField('targetUrl', e.target.value)}
                    placeholder="https://yourwebsite.com/page" />
                  <div className="form-hint">The URL you want to link to</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Anchor Text <span>*</span></label>
                  <input type="text" className="form-input" value={formData.anchorText}
                    onChange={(e) => updateField('anchorText', e.target.value)}
                    placeholder="e.g., best SEO tools" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Content Brief</label>
                <SimpleEditor onChange={(html) => updateField('content', html)} />
                <div className="form-hint">Describe what the article should cover. Our writers will handle the rest.</div>
              </div>
              <div className="form-group">
                <label className="form-label">Special Instructions</label>
                <textarea className="form-textarea" value={formData.instructions}
                  onChange={(e) => updateField('instructions', e.target.value)}
                  placeholder="Keywords to include, tone of voice, word count, etc." />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || !hasEnoughBalance}>
              {isUploading ? 'Uploading...' : isSubmitting ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>

        </div>
      </div>
    </form>
  )
}
