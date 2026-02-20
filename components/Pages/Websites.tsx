

export default function(){
    return(
           <FilterSidebar
    filters={filters}
    setFilters={setFilters}
    filtersOpen={filtersOpen}
    setFiltersOpen={setFiltersOpen}
    activeFilterCount={activeFilterCount}
    resultsCount={filteredWebsites.length}
    resetFilters={resetFilters}
  />
    )
}