'use client'

import TipTapViewer from './TipTapViewer'
import { CopyButton } from '@/components/animate-ui/components/buttons/copy'

type Props = {
  title: string
  content: string
  targetUrl: string
  anchorText: string
}

export default function ContentCopyPanel({ title, content, targetUrl, anchorText }: Props) {
  // Strip HTML tags to get plain text for "copy content"
  const plainText = content.replace(/<[^>]*>/g, '').trim()

  const everything = `Title: ${title}\n\nTarget URL: ${targetUrl}\nAnchor Text: ${anchorText}\n\nContent:\n${plainText}`

  return (
    <div>
      {/* Copy buttons row */}
      <div className="copy-btns-row">
        <div className="copy-btn-item">
          <CopyButton content={title} variant="outline" className="copy-btn-styled" />
          <span className="copy-btn-label">Copy Title</span>
        </div>
        <div className="copy-btn-item">
          <CopyButton content={plainText} variant="outline" className="copy-btn-styled" />
          <span className="copy-btn-label">Copy Content</span>
        </div>
        <div className="copy-btn-item">
          <CopyButton content={everything} variant="outline" className="copy-btn-styled" />
          <span className="copy-btn-label">Copy Everything</span>
        </div>
      </div>

      {/* TipTap read-only viewer */}
      <TipTapViewer content={content} />
    </div>
  )
}
