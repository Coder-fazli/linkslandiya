type PaginationProps = {
    currentPage: number
    totalPages: number
    setCurrentPage: (page: number) => void
}


export default function Pagination({
  currentPage, totalPages, setCurrentPage }: PaginationProps) {
    
    return(
         <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &#8249; Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next &#8250;
              </button>
            </div>
    )
} 