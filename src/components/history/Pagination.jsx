/**
 * Pagination component
 */
export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage,
  totalItems 
}) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {startItem}-{endItem} of {totalItems} transactions
      </div>
      
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <div className="pagination-pages">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          className="pagination-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

