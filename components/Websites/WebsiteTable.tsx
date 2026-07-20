"use client"
import FilterBar from './FilterBar'
import WebsiteTablePreview from './WebsiteTablePreview'
import { useState } from 'react'
import { Website } from '@/app/lib/types'

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

  // Load More state — how many results are currently shown
  const INITIAL_VISIBLE = 20
  const LOAD_MORE_STEP = 20
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const [prevFilters, setPrevFilters] = useState(filters)

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


     // Load More — show only the first `visibleCount` results
      const visibleWebsites = filteredWebsites.slice(0, visibleCount)
      const hasMore = visibleCount < filteredWebsites.length

      // Changing filters invalidates how far the user had scrolled — start over.
      // Adjusted during render (React's recommended pattern for this), not in
      // an effect, so there's no extra render pass.
      if (prevFilters !== filters) {
        setPrevFilters(filters)
        setVisibleCount(INITIAL_VISIBLE)
      }

      // Reset filters function
      const resetFilters = () => {
        setFilters({
          search: '', priceMin: '', priceMax: '', country: '',
          language: '', topic: '', da: '', dr: '', trafficMin: ''
        })
      }

      // Count active filters
      const activeFilterCount = Object.values(filters).filter(v => v !== '').length

      return (
        <div className="main-content">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            activeFilterCount={activeFilterCount}
            resultsCount={filteredWebsites.length}
            resetFilters={resetFilters}
          />

          <div className="websites-results-col">
            <WebsiteTablePreview websites={visibleWebsites} showActions={true} />

            {filteredWebsites.length > 0 && (
              <div className="load-more-row">
                <p className="load-more-count">
                  Showing {visibleWebsites.length} of {filteredWebsites.length} websites
                </p>
                {hasMore && (
                  <button
                    type="button"
                    className="load-more-btn"
                    onClick={() => setVisibleCount(c => c + LOAD_MORE_STEP)}
                  >
                    Load More
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )
}
