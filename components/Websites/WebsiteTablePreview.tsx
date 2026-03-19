import './WebsitesPreview.css'
import Link from 'next/link'
import {
    Website,
    getFaviconColor,
    formatTraffic,
    countryFlags,
} from '@/app/lib/types'

type WebsiteTablePreviewProps = {
  websites: Website[];
  limit?: number;
  showBlur?: boolean;
  showActions?: boolean;
}

export default function WebsiteTablePreview({ websites, limit, showBlur = false, showActions = false }: WebsiteTablePreviewProps) {
  const visible = typeof limit === "number" ? websites.slice(0, limit) : websites;

  return (
    <div className="table-preview-wrapper">
      {showBlur && <div className="blur-bottom"></div>}

      <div className={`sites-grid-header ${showActions ? 'with-actions' : ''}`}>
        <div>Website</div>
        <div className="col-center">Dofollow</div>
        <div>DA (Moz)</div>
        <div>Traffic</div>
        <div>Country</div>
        <div>Language</div>
        <div>Topic</div>
        <div className="col-center">Price</div>
        {showActions && <div className="col-center">Action</div>}
      </div>

      <div className="sites-list">
        {visible.map(site => (
          <div key={site._id} className={`site-card ${showActions ? 'with-actions' : ''}`}>

            {/* Website */}
            <div className="site-name-cell">
              <div className="site-favicon" style={{ background: `linear-gradient(135deg, ${getFaviconColor(site.name)} 0%, ${getFaviconColor(site.name)}dd 100%)` }}>
                {site.name.charAt(0).toUpperCase()}
              </div>
              <span className="site-name">{site.name}</span>
            </div>

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
              <div className="metric-bar">
                <div className="metric-fill da-fill" style={{ width: `${site.da}%` }}></div>
              </div>
            </div>

            {/* Traffic */}
            <div className="site-metric-cell">
              <span className="metric-value">{formatTraffic(site.traffic)}</span>
              <div className="metric-bar">
                <div className="metric-fill traffic-fill" style={{ width: `${Math.min((site.traffic / 500000) * 100, 100)}%` }}></div>
              </div>
            </div>

            {/* Country */}
            <div>
              <span className="badge-country">{countryFlags[site.country]} {site.country}</span>
            </div>

            {/* Language */}
            <div className="site-language">{site.language}</div>

            {/* Topic */}
            <div>
              <span className="badge-topic">{site.topic}</span>
            </div>

            {/* Price */}
            <div className="col-center">
              <span className="price-badge">${site.price}</span>
            </div>

            {/* Action */}
            {showActions && (
              <div className="col-center">
                <Link href={`/admin/buyer-orders/new?websiteId=${site._id}`} className="btn-post">
                  Post
                </Link>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}
