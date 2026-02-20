"use client"

type FilterSidebarProps = {
      filters: {
      search: string
      priceMin: string
      priceMax: string
      country: string
      language: string
      topic: string
      da: string
      dr: string
      trafficMin: string
    }
    setFilters: (filters: any) => void
    filtersOpen: boolean
    setFiltersOpen: (open: boolean) => void
    activeFilterCount: number
    resultsCount: number
    resetFilters: () => void
}

export default function FilterSidebar({
    filters,
    setFilters,
    filtersOpen,
    setFiltersOpen,
    activeFilterCount,
    resultsCount,
    resetFilters
   }: FilterSidebarProps ) 
    
    {
     return (
          <aside className={`filter-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3 className="sidebar-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="filter-count">{activeFilterCount}</span>
                )}
              </h3>
              <button className="sidebar-close" onClick={() => setFiltersOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="sidebar-content">
              {/* Search */}
              <div className="filter-block">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  Search
                </label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Search website..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>

              {/* Price Range */}
              <div className="filter-block">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Price ($)
                </label>
                <div className="price-range">
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                  />
                  <span className="range-separator">-</span>
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                  />
                </div>
              </div>

              {/* Traffic */}
              <div className="filter-block">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                  Min Traffic
                </label>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="e.g. 10000"
                  value={filters.trafficMin}
                  onChange={(e) => setFilters({ ...filters, trafficMin: e.target.value })}
                />
              </div>

              {/* DA Range */}
              <div className="filter-block">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 20V10"></path>
                    <path d="M12 20V4"></path>
                    <path d="M6 20v-6"></path>
                  </svg>
                  DA (Moz)
                </label>
                <select
                  className="filter-select"
                  value={filters.da}
                  onChange={(e) => setFilters({...filters, da: e.target.value})}
                >
                  <option value="">All DA</option>
                  <option value="0-20">0 - 20</option>
                  <option value="20-40">20 - 40</option>
                  <option value="40-60">40 - 60</option>
                  <option value="60-80">60 - 80</option>
                  <option value="80-100">80 - 100</option>
                </select>
              </div>

              {/* Country */}
              <div className="filter-block">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  Country
                </label>
                <select
                  className="filter-select"
                  value={filters.country}
                  onChange={(e) => setFilters({...filters, country: e.target.value})}
                >
                  <option value="">All Countries</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                  <option value="TR">Turkey</option>
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                  <option value="Global">Global</option>
                </select>
              </div>

              {/* Language */}
              <div className="filter-block">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 8l6 6"></path>
                    <path d="M4 14l6-6 2-3"></path>
                    <path d="M2 5h12"></path>
                    <path d="M7 2h1"></path>
                    <path d="M22 22l-5-10-5 10"></path>
                    <path d="M14 18h6"></path>
                  </svg>
                  Language
                </label>
                <select
                  className="filter-select"
                  value={filters.language}
                  onChange={(e) => setFilters({...filters, language: e.target.value})}
                >
                  <option value="">All Languages</option>
                  <option value="English">English</option>
                  <option value="Azerbaijani">Azerbaijan</option>
                  <option value="Kazakh">Kazakhstan</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Italian">Italian</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              {/* Topic */}
              <div className="filter-block">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  Topic
                </label>
                <select
                  className="filter-select"
                  value={filters.topic}
                  onChange={(e) => setFilters({...filters, topic: e.target.value})}
                >
                  <option value="">All Topics</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Finance">Finance</option>
                  <option value="Health">Health</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Travel">Travel</option>
                  <option value="News">News</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="sidebar-footer">
              <button className="btn-reset" onClick={resetFilters}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                Reset All
              </button>
              <div className="results-count">
                <span className="count-number">{resultsCount}</span>
                <span className="count-label">sites found</span>
              </div>
            </div>
          </aside>
        
        )
     }