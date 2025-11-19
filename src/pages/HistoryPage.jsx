import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import TransactionList from '../components/history/TransactionList';
import TransactionFilter from '../components/transactions/TransactionFilter';
import Pagination from '../components/history/Pagination';
import { ITEMS_PER_PAGE } from '../utils/constants';

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="page-container history-page">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user.id) {
    return (
      <div className="page-container history-page">
        <p>Error: User ID not found. Please log in again.</p>
      </div>
    );
  }

  const { 
    filteredTransactions, 
    loading, 
    error, 
    filter, 
    setFilter,
    refreshTransactions 
  } = useTransactions(user.id, user.transactions);

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
