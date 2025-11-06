import { useState, useEffect } from 'react';
import { getBalance, updateBalance } from '../services/transactionService';

/**
 * Custom hook for managing user balance
 * @param {string} userId - User ID
 * @returns {object} Balance state and update function
 */
export function useBalance(userId) {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchBalance() {
      try {
        setLoading(true);
        setError(null);
        const currentBalance = await getBalance(userId);
        setBalance(currentBalance);
      } catch (err) {
        // Only set error if it's a real error, not a fallback
        if (err.message && !err.message.includes('Failed to fetch')) {
          setError(err.message || 'Failed to fetch balance');
        }
        console.error('Error fetching balance:', err);
        // Set balance to 0 on error as fallback
        setBalance(0);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, [userId]);

  const refreshBalance = async () => {
    if (!userId) return;
    
    try {
      setError(null);
      const currentBalance = await getBalance(userId);
      setBalance(currentBalance);
      return currentBalance;
    } catch (err) {
      setError(err.message || 'Failed to refresh balance');
      throw err;
    }
  };

  return {
    balance,
    loading,
    error,
    refreshBalance,
    setBalance, // For optimistic updates
  };
}

