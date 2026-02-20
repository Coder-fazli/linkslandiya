"use client"
import FilterSidebar from './FilterSidebar'
import WebsiteTablePreview from './WebsiteTablePreview'
import { useState } from 'react'
import Link from 'next/link'
import {
    Website,
    getFaviconColor,
    formatTraffic,
    countryFlags,
} from '@/app/lib/types'

type WebsiteTableProps = {
    initialWebsites: Website[]
}

export default function WebsiteTable({ initialWebsites }: WebsiteTableProps) {

  const [filters, setFilters] = useState({
      search: '',
      priceMin: '',
      priceMax: '',
      country: '',
      language: '',
      topic: '',
      da: '',
      dr: '',
      trafficMin: ''
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
   // items per page
  const itemsPerPage = 10
   // Filter for mobile
  const [filtersOpen, setFiltersOpen] = useState(false)
  // Modal Pop up
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Website | null>(null)

  // Filter websites based on user sellections
  const filteredWebsites = initialWebsites.filter(site => {

   // Search
    if (filters.search) {
       if (!site.name.toLocaleLowerCase().includes(filters.search.toLocaleLowerCase())){
            return false
        }
    }
        // Price filter
        if (filters.priceMin !== '' && site.price < Number(filters.priceMin)){
            return false
        }
        if (filters.priceMax !== '' && site.price > Number(filters.priceMax)) {
            return false
        }

        // Contry filter

        if (filters.country && site.country !== filters.country) {
            return false
        }

        // Language filter

        if (filters.language && site.language !== filters.language) {return false

        }
       // Topic filter
        if (filters.topic && site.topic !== filters.topic) {
          return false
        }
        // Da filter
      if (filters.da) {
        const [minStr, maxStr] = filters.da.split("-");

        const min = Number(minStr);
        const max = maxStr ? Number(maxStr) : Number.POSITIVE_INFINITY;

        if (Number.isNaN(min) || Number.isNaN(max)) return false;
        if (site.da < min || site.da > max) return false;
       }
       // Filter traffic
       if (filters.trafficMin !== '') {
        const minTraffic = Number(filters.trafficMin)
        if (Number.isNaN(minTraffic)) return false
        if (site.traffic < minTraffic) return false
       }
       return true
     })


     // Pagination logic

      const totalPages = Math.ceil(filteredWebsites.length / itemsPerPage)
      const startIndex = (currentPage -1) * itemsPerPage
      const paginatedWebsites = filteredWebsites.slice(startIndex, startIndex + itemsPerPage)

      // Reset filters function
      const resetFilters = () => {
        setFilters({
          search: '', priceMin: '', priceMax: '', country: '',
          language: '', topic: '', da: '', dr: '', trafficMin: ''
        })
        setCurrentPage(1)
      }

      // Count active filters
      const activeFilterCount = Object.values(filters).filter(v => v !== '').length

      return (
        <>
        {/* Main Layout with Sidebar */}



          {/* Mobile Filter Toggle */}
          <button
            className="mobile-filter-btn"
            onClick={() => setFiltersOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>

          {/* Main Content */}
          <div className="main-content">
          <div className="page-layout">
  <FilterSidebar
    filters={filters}
    setFilters={setFilters}
    filtersOpen={filtersOpen}
    setFiltersOpen={setFiltersOpen}
    activeFilterCount={activeFilterCount}
    resultsCount={filteredWebsites.length}
    resetFilters={resetFilters}
  />

    <WebsiteTablePreview websites={paginatedWebsites} showActions={true} />
</div>
</div>

        {/* Overlay for mobile */}
        {filtersOpen && (
          <div className="sidebar-overlay" onClick={() => setFiltersOpen(false)}></div>
        )}

        {/* Modal */}
        {modalOpen && selectedSite && (
          <div className="modal-overlay show" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-favicon" style={{ background: `linear-gradient(135deg, ${getFaviconColor(selectedSite.name)} 0%, ${getFaviconColor(selectedSite.name)}dd 100%)` }}>
                    {selectedSite.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="modal-title">{selectedSite.name}</div>
                    <div className="modal-subtitle">Guest Post Opportunity</div>
                  </div>
                </div>

                <div className="modal-stats">
                  <div className="modal-stat">
                    <div className="modal-stat-label">DA (Moz)</div>
                    <div className="modal-stat-value">{selectedSite.da}</div>
                    <div className="modal-stat-bar">
                      <div className="modal-stat-bar-fill" style={{ width: `${selectedSite.da}%` }}></div>
                    </div>
                  </div>
                  <div className="modal-stat">
                    <div className="modal-stat-label">Traffic</div>
                    <div className="modal-stat-value">{formatTraffic(selectedSite.traffic)}</div>
                    <div className="modal-stat-bar">
                      <div className="modal-stat-bar-fill" style={{ width: `${Math.min((selectedSite.traffic / 500000) * 100, 100)}%`, background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' }}></div>
                    </div>
                  </div>
                </div>

                <div className="modal-tags">
                  <span className="modal-tag country">{countryFlags[selectedSite.country]} {selectedSite.country}</span>
                  <span className="modal-tag language">{selectedSite.language}</span>
                  <span className="modal-tag topic">{selectedSite.topic}</span>
                  <span className={`modal-tag ${selectedSite.dofollow ? 'dofollow' : 'nofollow'}`}>
                    {selectedSite.dofollow ? 'Dofollow' : 'Nofollow'}
                  </span>
                </div>

                <div className="modal-price">
                  <div className="modal-price-label">Price</div>
                  <div className="modal-price-value">${selectedSite.price}</div>
                </div>

                <div className="modal-actions">
                  <Link href={`/site/${selectedSite.id}`} className="modal-btn modal-btn-secondary">
                    View Details
                  </Link>
                  <button className="modal-btn modal-btn-primary">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
      )
}
