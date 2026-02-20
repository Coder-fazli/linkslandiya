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


export default function WebsiteTablePreview({ websites, limit, showBlur = false, showActions = false }: WebsiteTablePreviewProps ) {
  const visible = typeof limit === "number" ? websites.slice(0, limit) : websites;
    return (
          <div className="table-preview-wrapper">
            {showBlur && <div className="blur-bottom"></div>} 
                  
                  <div className="table-container">
              <table className="website-table">
                <thead>
                  <tr>
                    <th>Website</th>
                    <th>Dofollow</th>
                    <th>DA (Moz)</th>
                    <th>Traffic</th>
                    <th>Country</th>
                    <th>Language</th>
                    <th>Topic</th>
                    <th>Price</th>
                    {showActions && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {visible.map(site => (
                    <tr key={site._id}>
                      <td data-label="">
                        <div className="website-cell">
                          <div className="website-favicon" style={{ background: `linear-gradient(135deg, ${getFaviconColor(site.name)} 0%, ${getFaviconColor(site.name)}dd 100%)`, color: 'white' }}>
                            {site.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="website-name">{site.name}</span>
                        </div>
                      </td>
                      <td data-label="Dofollow">
                        <div className={`status-icon ${site.dofollow ? 'success' : 'error'}`}>
                          {site.dofollow ? '✓' : '✗'}
                        </div>
                      </td>
                      <td className="progress-cell" data-label="DA (Moz)">
                        <div className="progress-wrapper">
                          <span className="progress-value">{site.da}</span>
                          <div className="progress-bar">
                            <div className="progress-fill da" style={{ width: `${site.da}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="progress-cell" data-label="Traffic">
                        <div className="progress-wrapper">
                          <span className="progress-value">{formatTraffic(site.traffic)}</span>
                          <div className="progress-bar">
                            <div className="progress-fill traffic" style={{ width: `${Math.min((site.traffic / 500000) * 100, 100)}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Country">
                        <span className="badge badge-country">{countryFlags[site.country]} {site.country}</span>
                      </td>
                      <td data-label="Language">{site.language}</td>
                      <td data-label="Topic">
                        <span className="badge badge-topic">{site.topic}</span>
                      </td>
                      <td className="price-cell" data-label="Price">${site.price}</td>
                      {showActions && (
                        <td data-label="Action">
                          <Link href={`/admin/buyer-orders/new?websiteId=${site._id}`} className="btn-post">
                            Post
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
          

            {/* Pagination */}
           
          </div>

          </div>

 )
  }