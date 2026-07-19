"use client"

type Filters = {
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

type FilterBarProps = {
    filters: Filters
    setFilters: (filters: Filters) => void
    activeFilterCount: number
    resultsCount: number
    resetFilters: () => void
}

export default function FilterBar({
    filters,
    setFilters,
    activeFilterCount,
    resultsCount,
    resetFilters,
}: FilterBarProps) {
    return (
        <div className="filter-bar">
            <div className="filter-bar-top">
                <div className="filter-bar-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search website..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                <div className="filter-bar-summary">
                    <span className="filter-bar-count">{resultsCount} sites found</span>
                    {activeFilterCount > 0 && (
                        <button type="button" className="filter-bar-reset" onClick={resetFilters}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                <path d="M3 3v5h5"></path>
                            </svg>
                            Reset ({activeFilterCount})
                        </button>
                    )}
                </div>
            </div>

            <div className="filter-bar-fields">
                <div className="filter-bar-field">
                    <label>Country</label>
                    <select value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })}>
                        <option value="">All Countries</option>
                        <option value="RU">Russia</option>
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

                <div className="filter-bar-field">
                    <label>Language</label>
                    <select value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })}>
                        <option value="">All Languages</option>
                        <option value="English">English</option>
                        <option value="Russian">Russian</option>
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

                <div className="filter-bar-field">
                    <label>Topic</label>
                    <select value={filters.topic} onChange={(e) => setFilters({ ...filters, topic: e.target.value })}>
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

                <div className="filter-bar-field">
                    <label>DA (Moz)</label>
                    <select value={filters.da} onChange={(e) => setFilters({ ...filters, da: e.target.value })}>
                        <option value="">All DA</option>
                        <option value="0-20">0 - 20</option>
                        <option value="20-40">20 - 40</option>
                        <option value="40-60">40 - 60</option>
                        <option value="60-80">60 - 80</option>
                        <option value="80-100">80 - 100</option>
                    </select>
                </div>

                <div className="filter-bar-field filter-bar-field-price">
                    <label>Price ($)</label>
                    <div className="filter-bar-range">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.priceMin}
                            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                        />
                        <span>–</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.priceMax}
                            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                        />
                    </div>
                </div>

                <div className="filter-bar-field">
                    <label>Min Traffic</label>
                    <input
                        type="number"
                        placeholder="e.g. 10000"
                        value={filters.trafficMin}
                        onChange={(e) => setFilters({ ...filters, trafficMin: e.target.value })}
                    />
                </div>
            </div>
        </div>
    )
}
