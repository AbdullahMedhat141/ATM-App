import { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import TransactionList from '../components/history/TransactionList';
import TransactionFilter from '../components/transactions/TransactionFilter';
import Pagination from '../components/history/Pagination';
import { ITEMS_PER_PAGE } from '../utils/constants';

/**
 * History Page with pagination and filtering
 */
export default function HistoryPage() {
  // Get userId from localStorage (set by login)
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem('userId');
    return stored || null;
  });

  const [currentPage, setCurrentPage] = useState(1);
  
  // For testing: If no userId, use a test ID (remove this when login is ready)
  const testUserId = userId || '2'; // Using user ID 2 from mock data as example
  
  if (!userId) {
    console.warn('No userId found. Using test userId:', testUserId);
    localStorage.setItem('userId', testUserId);
  }
  
  const actualUserId = userId || testUserId;
  
  const { 
    filteredTransactions, 
    loading, 
    error, 
    filter, 
    setFilter,
    refreshTransactions 
  } = useTransactions(actualUserId);

  // Paginate filtered transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  return (
    <div className="page-container history-page">
      <h1>Transaction History</h1>
      {!userId && (
        <div style={{ 
          background: '#fff3cd', 
          padding: '1rem', 
          borderRadius: '6px', 
          marginBottom: '1rem',
          border: '1px solid #ffc107'
        }}>
          <p style={{ margin: 0, color: '#856404' }}>
            ⚠️ Testing mode: Using test userId ({testUserId}). Login system not yet implemented.
          </p>
        </div>
      )}
      
      <TransactionFilter 
        filter={filter} 
        onFilterChange={handleFilterChange}
      />

      <div className="transactions-section">
        <TransactionList 
          transactions={paginatedTransactions}
          loading={loading}
          error={error}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredTransactions.length}
      />
    </div>
  );
}
