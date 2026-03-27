'use client'

import './WebsitesPreview.css'
import Link from 'next/link'
import { useState } from 'react'
import {
    Website,
    formatTraffic,
    countryFlags,
    cleanDomain,
} from '@/app/lib/types'
import WebsiteFavicon from './WebsiteFavicon'

type WebsiteTablePreviewProps = {
  websites: Website[];
  limit?: number;
  showBlur?: boolean;
  showActions?: boolean;
}

export default function WebsiteTablePreview({ websites, limit, showBlur = false, showActions = false }: WebsiteTablePreviewProps) {
  const visible = typeof limit === "number" ? websites.slice(0, limit) : websites;
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function toggleExpand(id: string) {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div className="table-preview-wrapper">
      {showBlur && <div className="blur-bottom"></div>}

      <div className="table-scroll-inner">
        {/* Header */}
        <div className={`sites-grid-header ${showActions ? 'with-actions' : ''}`}>
          <div>Website</div>
          <div className="col-center">Dofollow</div>
          <div><span className="col-brand-badge moz-badge">MOZ</span>DA</div>
          <div><span className="col-brand-badge ahrefs-badge">AHR</span>DR</div>
          <div>
            <span className="col-brand-badge traffic-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/></svg>
            </span>
            Traffic
          </div>
          <div>Country</div>
          <div>Topic</div>
          <div className="col-center">Price</div>
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

                  {/* Dofollow */}
                  <div className="col-center">
                    <div className={`dofollow-icon ${site.dofollow ? 'dofollow-yes' : 'dofollow-no'}`}>
                      {site.dofollow ? (
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </div>
                  </div>

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

                  {/* Price */}
                  <div className="col-center">
                    <span className="price-badge">${site.price}</span>
                  </div>

                  {/* Actions */}
                  {showActions && (
                    <div className="col-center" style={{ display: 'flex', gap: '8px' }}>
                      <a href={`/site/${id}`} target="_blank" rel="noopener noreferrer" className="btn-eye" title="View website">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </a>
                      <Link href={`/admin/buyer-orders/new?websiteId=${id}`} className="btn-post">
                        Post
                      </Link>
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
                    <div className="expand-info-row">
                      <div className="expand-info-item">
                        <span className="expand-info-label">Language</span>
                        <span className="expand-info-value">{site.language || '—'}</span>
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
  )
}
