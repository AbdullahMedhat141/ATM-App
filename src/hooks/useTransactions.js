import { useState, useEffect, useMemo } from 'react';
import { getTransactions } from '../services/transactionService';

/**
 * Custom hook for managing transactions
 * @param {string} userId - User ID
 * @returns {object} Transactions state and utility functions
 */
export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    type: 'all', // 'all', 'Deposit', 'Withdraw', 'Transfer'
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchTransactions() {
      try {
        setLoading(true);
        setError(null);
        const fetchedTransactions = await getTransactions(userId);
        // Sort by date (newest first)
        const sorted = fetchedTransactions.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setTransactions(sorted);
      } catch (err) {
        // Only set error if it's a real error, not a fallback
        if (err.message && !err.message.includes('Failed to fetch')) {
          setError(err.message || 'Failed to fetch transactions');
        }
        console.error('Error fetching transactions:', err);
        // Set empty array on error as fallback
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [userId]);

  // Filter transactions based on current filter
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by type
    if (filter.type !== 'all') {
      filtered = filtered.filter(t => t.type === filter.type);
    }

    // Filter by date range
    if (filter.startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filter.startDate));
    }

    if (filter.endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filter.endDate));
    }

    return filtered;
  }, [transactions, filter]);

  const refreshTransactions = async () => {
    if (!userId) return;
    
    try {
      setError(null);
      const fetchedTransactions = await getTransactions(userId);
      const sorted = fetchedTransactions.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setTransactions(sorted);
      return sorted;
    } catch (err) {
      setError(err.message || 'Failed to refresh transactions');
      throw err;
    }
  };

  return {
    transactions,
    filteredTransactions,
    loading,
    error,
    filter,
    setFilter,
    refreshTransactions,
    setTransactions, // For optimistic updates
  };
}

