'use client'

import TipTapViewer from './TipTapViewer'
import { CopyButton } from '@/components/animate-ui/components/buttons/copy'
import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

type Props = {
  title: string
  content: string
  targetUrl: string
  anchorText: string
}

// Custom button that copies HTML with formatting preserved (pastes into WordPress etc.)
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
      // Fallback for browsers that don't support ClipboardItem
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

export default function ContentCopyPanel({ title, content, targetUrl, anchorText }: Props) {
  return (
    <div>
      {/* Article Title row with copy button inline */}
      <div className="form-group">
        <div className="form-label-row">
          <label className="form-label">Article Title</label>
          <CopyButton content={title} variant="outline" size="xs" className="copy-btn-styled" />
        </div>
        <input type="text" className="form-input" value={title} readOnly />
      </div>

      {/* Target URL + Anchor Text */}
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Target URL</label>
          <input type="text" className="form-input" value={targetUrl} readOnly />
        </div>
        <div className="form-group">
          <label className="form-label">Anchor Text</label>
          <input type="text" className="form-input" value={anchorText} readOnly />
        </div>
      </div>

      {/* Article Content with copy button inline */}
      <div className="form-group">
        <div className="form-label-row">
          <label className="form-label">Article Content</label>
          <HtmlCopyButton html={content} />
        </div>
        <TipTapViewer content={content || '<p>No content provided.</p>'} />
      </div>
    </div>
  )
}
