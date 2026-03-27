'use client'

import TipTapViewer from './TipTapViewer'
import { CopyButton } from '@/components/animate-ui/components/buttons/copy'
import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

type Props = {
  orderType?: 'guest_post' | 'link_insertion' | 'casino'
  // Guest post / casino fields
  title: string
  content: string
  targetUrl: string
  anchorText: string
  // Link insertion fields
  existingPostUrl?: string
  landingPageUrl?: string
  // If buyer uploaded a file, hide the content editor
  hasAttachment?: boolean
}

function HtmlCopyButton({ html }: { html: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      const plainText = html.replace(/<[^>]*>/g, '').trim()
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
        })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      const plain = html.replace(/<[^>]*>/g, '').trim()
      await navigator.clipboard.writeText(plain)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <button onClick={handleCopy} className="copy-btn-styled-html" title="Copy Content">
      {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      {copied ? 'Copied!' : 'Copy Content'}
    </button>
  )
}

export default function ContentCopyPanel({ orderType = 'guest_post', title, content, targetUrl, anchorText, existingPostUrl, landingPageUrl, hasAttachment }: Props) {

  // ── Link Insertion layout ─────────────────────────────────
  if (orderType === 'link_insertion') {
    return (
      <div>
        {/* Order type badge */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ padding: '3px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, background: '#e0f2fe', color: '#0369a1' }}>
            Link Insertion
          </span>
        </div>

        <div className="form-group">
          <div className="form-label-row">
            <label className="form-label">Existing Post URL</label>
            <CopyButton content={existingPostUrl || ''} variant="outline" size="xs" className="copy-btn-styled" />
          </div>
          <input type="text" className="form-input" value={existingPostUrl || '—'} readOnly />
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Find this post on your website and insert the link inside it
          </p>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Anchor Text</label>
              <CopyButton content={anchorText} variant="outline" size="xs" className="copy-btn-styled" />
            </div>
            <input type="text" className="form-input" value={anchorText || '—'} readOnly />
          </div>
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Landing Page URL (link to this)</label>
              <CopyButton content={landingPageUrl || ''} variant="outline" size="xs" className="copy-btn-styled" />
            </div>
            <input type="text" className="form-input" value={landingPageUrl || '—'} readOnly />
          </div>
        </div>

        {/* Quick guide */}
        <div style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>What to do:</strong> Open the post at the URL above, find a natural place in the text, wrap the anchor text <strong>"{anchorText}"</strong> as a hyperlink pointing to <strong>{landingPageUrl || 'the landing page URL'}</strong>.
        </div>
      </div>
    )
  }

  // ── Guest Post / Casino layout ────────────────────────────
  return (
    <div>
      {orderType === 'casino' && (
        <div style={{ marginBottom: '16px' }}>
          <span style={{ padding: '3px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, background: '#fef3c7', color: '#92400e' }}>
            Casino
          </span>
        </div>
      )}

      <div className="form-group">
        <div className="form-label-row">
          <label className="form-label">Article Title</label>
          <CopyButton content={title} variant="outline" size="xs" className="copy-btn-styled" />
        </div>
        <input type="text" className="form-input" value={title} readOnly />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <div className="form-label-row">
            <label className="form-label">Target URL</label>
            <CopyButton content={targetUrl} variant="outline" size="xs" className="copy-btn-styled" />
          </div>
          <input type="text" className="form-input" value={targetUrl || '—'} readOnly />
        </div>
        <div className="form-group">
          <div className="form-label-row">
            <label className="form-label">Anchor Text</label>
            <CopyButton content={anchorText} variant="outline" size="xs" className="copy-btn-styled" />
          </div>
          <input type="text" className="form-input" value={anchorText || '—'} readOnly />
        </div>
      </div>

      {!hasAttachment && (
        <div className="form-group">
          <div className="form-label-row">
            <label className="form-label">Article Content</label>
            <HtmlCopyButton html={content} />
          </div>
          <TipTapViewer content={content || '<p>No content provided.</p>'} />
        </div>
      )}
    </div>
  )
}
