 import Link from 'next/link'
 import { getWebsiteById, getAllWebsites } from '@/app/lib/websites'
 import { getFaviconColor, formatTraffic, countryFlags } from '@/app/lib/types'
 import Hero from '@/components/ui/hero'
 import { Marquee } from '@/components/ui/marquee'
 
  export default async function SitePage({ params }: { params: Promise<{ id: string}> }) {
   
   const { id } = await params

   // Get the website data using the Id from url
   const site = await getWebsiteById((id))
   const allWebsites = await getAllWebsites()

if (!site) {
  return (
    <main className="main">
      <Hero />
          <div className="container">
            <h1>Site not found</h1>
            <Link href="/">Go back home</Link>
          </div>
     </main>
  )
}

return (
  <main className="main">
      <div className="container">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/">All Sites</Link>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
          <span>{site.name}</span>
        </div>
        
          {/* Site Layout */}
  <div className="site-layout">

    {/* Main Content */}
    <div className="site-main">
      <div className="site-card">

        {/* Site Header */}
        <div className="site-header">
          <div className="site-header-left">
            <div
              className="site-favicon"
              style={{
                background: `linear-gradient(135deg, ${getFaviconColor(site.name)} 0%, ${getFaviconColor(site.name)}dd 100%)`,
                color: 'white'
              }}
            >
              {site.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="site-title">{site.name}</h1>   
              <p className="site-subtitle">Guest Post Opportunity</p>
            </div>
          </div>
          <div className="site-price">${site.price}</div>   
        </div>

               {/* Site Stats Grid */}
  <div className="site-stats-grid">
    <div className="site-stat-item">
      <div className="site-stat-label">Site ID</div>
      <div className="site-stat-value">LNK-{String(site.id).padStart(3, '0')}</div>
    </div>
    <div className="site-stat-item">
      <div className="site-stat-label">Website</div>
      <div className="site-stat-value">
        <a href="#" className="site-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>{site.name}</span>
        </a>
      </div>
    </div>
    <div className="site-stat-item">
      <div className="site-stat-label">Country</div>
      <div className="site-stat-value">{countryFlags[site.country]} {site.country}</div>
    </div>
    <div className="site-stat-item">
      <div className="site-stat-label">Dofollow</div>
      <div className="site-stat-value">
        <span className={`status-badge ${site.dofollow ? 'success' : 'error'}`}>
          {site.dofollow ? 'Yes' : 'No'}
        </span>
      </div>
    </div>
    <div className="site-stat-item">
      <div className="site-stat-label">Language</div>
      <div className="site-stat-value">{site.language}</div>
    </div>
    <div className="site-stat-item">
      <div className="site-stat-label">Topic</div>
      <div className="site-stat-value">{site.topic}</div>
    </div>
  </div>
    
     {/* Site Metrics */}

  <div className="site-metrics">
    <div className="site-metric">
      <div className="site-metric-header">
        <span className="site-metric-label">DA (Moz)</span>        
        <span className="site-metric-value">{site.da}</span>       
      </div>
      <div className="site-metric-bar">
        <div className="site-metric-fill da" style={{ width: `${site.da}%` }}></div>
      </div>
    </div>
    <div className="site-metric">
      <div className="site-metric-header">
        <span className="site-metric-label">Traffic</span>
        <span className="site-metric-value">{formatTraffic(site.traffic)}</span>
      </div>
      <div className="site-metric-bar">
        <div className="site-metric-fill traffic" style={{ width: `${Math.min((site.traffic / 500000) * 100, 100)}%` }}></div>        
      </div>
    </div>
  </div>

    {/* Site Actions */}
  <div className="site-actions">
    <Link href="/" className="site-btn site-btn-outline">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m15 18-6-6 6-6"></path>
      </svg>
      Back
    </Link>
    <button className="site-btn site-btn-secondary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      Favorite
    </button>
    <button className="site-btn site-btn-primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      Add to Cart
    </button>
        </div>
      </div>
    </div>
     {/* Sidebar */}
          <aside className="site-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Best Sellers</h3>
              <div className="sidebar-list">
                {/* Show top 5 websites by price */}
                {allWebsites
                  .sort((a, b) => b.price - a.price)
                  .slice(0, 5)
                  .map((item, index) => (
                    <Link href={`/site/${item.id}`} key={item.id} className="sidebar-item">
                      <div className="sidebar-rank">{index + 1}</div>
                      <div className="sidebar-info">
                        <div className="sidebar-name">{item.name}</div>
                      </div>
                      <div className="sidebar-price">${item.price}</div>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
  </div>
         
       </div>
    </main>
)

  }