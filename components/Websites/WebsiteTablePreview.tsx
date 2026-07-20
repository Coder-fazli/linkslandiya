'use client'

import './WebsitesPreview.css'
import { useState } from 'react'
import {
    Website,
    formatTraffic,
    countryFlags,
    cleanDomain,
} from '@/app/lib/types'
import WebsiteFavicon from './WebsiteFavicon'
import { ShineButton } from '@/components/ui/ShineButton'

type WebsiteTablePreviewProps = {
  websites: Website[];
  limit?: number;
  showBlur?: boolean;
  showActions?: boolean;
}

type TooltipState = { x: number; y: number; text: string } | null

export default function WebsiteTablePreview({ websites, limit, showBlur = false, showActions = false }: WebsiteTablePreviewProps) {
  const visible = typeof limit === "number" ? websites.slice(0, limit) : websites;
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [previewSite, setPreviewSite] = useState<Website | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState>(null)

  function toggleExpand(id: string) {
    setExpandedId(prev => prev === id ? null : id)
  }

  function showTip(e: React.MouseEvent, text: string) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltip({ x: rect.left + rect.width / 2, y: rect.bottom + 8, text })
  }

  function hideTip() {
    setTooltip(null)
  }

  return (
    <>
    <div className="table-preview-wrapper">
      {showBlur && <div className="blur-bottom"></div>}

      {/* Fixed tooltip — escapes overflow clipping */}
      {tooltip && (
        <div
          className="col-tooltip-fixed"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="col-tooltip-fixed-arrow" />
          {tooltip.text}
        </div>
      )}

      <div className="table-scroll-inner">
        {/* Header */}
        <div className={`sites-grid-header ${showActions ? 'with-actions' : ''}`}>
          {/* Website */}
          <div className="col-tooltip-wrapper" onMouseEnter={e => showTip(e, "The domain name of the target website for a guest post or link insertion. The list of websites available for Guest posting or niche edits.")} onMouseLeave={hideTip}>
            Website
            <span className="col-tooltip-icon">?</span>
          </div>

          {/* MOZ DA */}
          <div className="col-center" style={{ flexDirection: 'column', gap: '2px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/moz.svg" alt="Moz" className="col-brand-icon" />
            <div className="col-tooltip-wrapper" onMouseEnter={e => showTip(e, "A search engine ranking score by Moz that predicts how well a website is likely to rank on SERPs. The score ranges from 1 to 100, with higher scores indicating a better ability to rank.")} onMouseLeave={hideTip}>
              <span>DA</span>
              <span className="col-tooltip-icon">?</span>
            </div>
          </div>

          {/* Ahrefs DR */}
          <div className="col-center" style={{ flexDirection: 'column', gap: '2px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/ahrefs.svg" alt="Ahrefs" className="col-brand-icon" />
            <div className="col-tooltip-wrapper" onMouseEnter={e => showTip(e, "Ahrefs Domain Rating — measures the strength of a website's backlink profile on a scale from 1 to 100.")} onMouseLeave={hideTip}>
              <span>DR</span>
              <span className="col-tooltip-icon">?</span>
            </div>
          </div>

          {/* Traffic */}
          <div className="col-center" style={{ flexDirection: 'column', gap: '2px' }}>
            <span className="col-brand-badge traffic-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/></svg>
            </span>
            <div className="col-tooltip-wrapper" onMouseEnter={e => showTip(e, "An estimate of the website's organic traffic for the previous month, based on data from the Ahrefs tool.")} onMouseLeave={hideTip}>
              <span>Traffic</span>
              <span className="col-tooltip-icon">?</span>
            </div>
          </div>

          <div className="col-center">Country</div>
          <div className="col-center">Topic</div>

          {/* Guest Post */}
          <div className="col-tooltip-wrapper" onMouseEnter={e => showTip(e, "The fee for publishing an article on the specified website, excluding content creation.")} onMouseLeave={hideTip}>
            Guest Post
            <span className="col-tooltip-icon">?</span>
          </div>

          {/* Link Insertion */}
          <div className="col-tooltip-wrapper" onMouseEnter={e => showTip(e, "The fee for inserting a backlink to an existing article on the specified website. Content is not required.")} onMouseLeave={hideTip}>
            Link Insertion
            <span className="col-tooltip-icon">?</span>
          </div>

          {showActions && <div className="col-center">Action</div>}
          <div></div>
        </div>

        {/* Rows */}
        <div className="sites-list">
          {visible.map(site => {
            const id = site._id!
            const isExpanded = expandedId === id

            return (
              <div key={id} className="site-row-wrapper">

                {/* Main card row */}
                <div className={`site-card ${showActions ? 'with-actions' : ''}`}>

                  {/* Website */}
                  <a href={`/site/${id}`} target="_blank" rel="noopener noreferrer" className="site-name-cell">
                    <WebsiteFavicon url={site.url} name={site.name} />
                    <span className="site-name">{cleanDomain(site.url, site.name)}</span>
                  </a>

                  {/* DA */}
                  <div className="site-metric-cell">
                    <span className="metric-value">{site.da}</span>
                    <div className="metric-bar"><div className="metric-fill da-fill" style={{ width: `${site.da}%` }}></div></div>
                  </div>

                  {/* DR */}
                  <div className="site-metric-cell">
                    <span className="metric-value">{site.dr}</span>
                    <div className="metric-bar"><div className="metric-fill dr-fill" style={{ width: `${site.dr}%` }}></div></div>
                  </div>

                  {/* Traffic */}
                  <div className="site-metric-cell">
                    <span className="metric-value">{formatTraffic(site.traffic)}</span>
                    <div className="metric-bar"><div className="metric-fill traffic-fill" style={{ width: `${Math.min((site.traffic / 500000) * 100, 100)}%` }}></div></div>
                  </div>

                  {/* Country */}
                  <div>
                    <span className="badge-country">{countryFlags[site.country]} {site.country}</span>
                  </div>

                  {/* Topic */}
                  <div>
                    <span className="badge-topic">{site.topic}</span>
                  </div>

                  {/* Guest Post price */}
                  <div>
                    <span className="price-badge">${site.price}</span>
                  </div>

                  {/* Link Insertion price */}
                  <div>
                    {site.linkInsertionPrice != null
                      ? <span className="price-badge">${site.linkInsertionPrice}</span>
                      : <span className="price-badge-na">—</span>
                    }
                  </div>

                  {/* Actions */}
                  {showActions && (
                    <div className="col-center" style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" onClick={() => setPreviewSite(site)} className="btn-eye" title="Preview website">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <ShineButton
                        label="Post"
                        href={`/admin/buyer-orders/new?websiteId=${id}`}
                        size="sm"
                      />
                    </div>
                  )}

                  {/* Chevron expand */}
                  <div className="col-center">
                    <button
                      className={`btn-expand ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleExpand(id)}
                      title="More info"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>

                </div>

                {/* Expanded panel */}
                {isExpanded && (
                  <div className="site-expand-panel">
                    {site.screenshotUrl && (
                      <div className="expand-screenshot">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={site.screenshotUrl} alt={`${site.name} homepage preview`} />
                      </div>
                    )}
                    <div className="expand-info-row">
                      <div className="expand-info-item">
                        <span className="expand-info-label">Language</span>
                        <span className="expand-info-value">{site.language || '—'}</span>
                      </div>
                      <div className="expand-info-item">
                        <span className="expand-info-label">Dofollow</span>
                        <span className={`expand-dofollow ${site.dofollow ? 'yes' : 'no'}`}>
                          {site.dofollow ? '✓ Dofollow' : '✗ Nofollow'}
                        </span>
                      </div>
                    </div>
                    <div className="expand-actions-row">
                      <a href={site.url} target="_blank" rel="noopener noreferrer" className="expand-btn-action view-sample">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        View Sample
                      </a>
                      <button className="expand-btn-action block-list">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                        Add to Block List
                      </button>
                      <button className="expand-btn-action report">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        Report Website
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )
          })}
        </div>
      </div>
    </div>

    {/* Preview modal — opened from the eye icon */}
    {previewSite && (
      <div className="modal-overlay show" onClick={() => setPreviewSite(null)}>
        <div className="modal preview-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setPreviewSite(null)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
          <div className="modal-content">
            {previewSite.screenshotUrl && (
              <div className="preview-modal-visual">
                <div className="modal-screenshot">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewSite.screenshotUrl} alt={`${previewSite.name} homepage preview`} />
                </div>
              </div>
            )}

            <div className="preview-modal-info">
              <div className="modal-header">
                <WebsiteFavicon url={previewSite.url} name={previewSite.name} className="modal-favicon" size={50} />
                <div>
                  <div className="modal-title">{cleanDomain(previewSite.url, previewSite.name)}</div>
                  <div className="modal-subtitle">{previewSite.desc || "Guest Post Opportunity"}</div>
                </div>
              </div>

              <div className="modal-stats modal-stats-3">
                <div className="modal-stat">
                  <div className="modal-stat-label">
                    DA
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/moz.svg" alt="Moz" style={{ height: "9px", width: "auto" }} />
                  </div>
                  <div className="modal-stat-value">{previewSite.da}</div>
                  <div className="modal-stat-bar">
                    <div className="modal-stat-bar-fill" style={{ width: `${previewSite.da}%` }}></div>
                  </div>
                </div>
                <div className="modal-stat">
                  <div className="modal-stat-label">
                    DR
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/ahrefs.svg" alt="Ahrefs" style={{ height: "9px", width: "auto" }} />
                  </div>
                  <div className="modal-stat-value">{previewSite.dr}</div>
                  <div className="modal-stat-bar">
                    <div className="modal-stat-bar-fill" style={{ width: `${previewSite.dr}%`, background: "linear-gradient(90deg, #ff6b35 0%, #ffa07a 100%)" }}></div>
                  </div>
                </div>
                <div className="modal-stat">
                  <div className="modal-stat-label">Traffic</div>
                  <div className="modal-stat-value">{formatTraffic(previewSite.traffic)}</div>
                  <div className="modal-stat-bar">
                    <div className="modal-stat-bar-fill" style={{ width: `${Math.min((previewSite.traffic / 500000) * 100, 100)}%`, background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' }}></div>
                  </div>
                </div>
              </div>

              <div className="modal-tags">
                <span className="modal-tag country">{countryFlags[previewSite.country]} {previewSite.country}</span>
                <span className="modal-tag language">{previewSite.language}</span>
                <span className="modal-tag topic">{previewSite.topic}</span>
                <span className={`modal-tag ${previewSite.dofollow ? 'dofollow' : 'nofollow'}`}>
                  {previewSite.dofollow ? 'Dofollow' : 'Nofollow'}
                </span>
              </div>

              <div className="modal-price">
                <div className="modal-price-label">Price</div>
                <div className="modal-price-value">${previewSite.price}</div>
              </div>

              <div className="modal-actions">
                <a href={previewSite.url} target="_blank" rel="noopener noreferrer" className="modal-btn modal-btn-secondary">
                  View Website
                </a>
                <ShineButton
                  label="Post Article"
                  href={`/admin/buyer-orders/new?websiteId=${previewSite._id}`}
                  className="modal-btn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
