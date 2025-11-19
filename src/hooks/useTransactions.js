import { useEffect, useState, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState({
    type: "all",
    startDate: null,
    endDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applyFilter = useCallback((list, filter) => {
    let result = [...list];

    if (filter.type !== "all") {
      result = result.filter(
        (t) => t.type.toLowerCase() === filter.type.toLowerCase()
      );
    }

    if (filter.startDate) {
      const start = new Date(filter.startDate);
      result = result.filter((t) => new Date(t.date) >= start);
    }

    if (filter.endDate) {
      const end = new Date(filter.endDate);
      result = result.filter((t) => new Date(t.date) <= end);
    }

    setFilteredTransactions(result);
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/users?id=${userId}`);
      if (!res.ok) throw new Error("Failed to load user data");

      const user = await res.json();
      const list = user[0].transactions;

      const sorted = list.sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(sorted);
      applyFilter(sorted, filter);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [userId, filter, applyFilter]);

  useEffect(() => {
    applyFilter(transactions, filter);
  }, [filter, transactions, applyFilter]);

  useEffect(() => {
    if (userId) fetchTransactions();
  }, [userId, fetchTransactions]);
  return {
    transactions,
    filteredTransactions,
    filter,
    setFilter,
    loading,
    error,
    refreshTransactions: fetchTransactions,
  };
}
