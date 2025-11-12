import { useMemo } from 'react';
import { useBalance } from '../../hooks/useBalance';
import { formatCurrency } from '../../utils/formatCurrency';

/**
 * Balance card component for displaying account balance
 */
export default function BalanceCard({ userId }) {
  const { balance, loading, error } = useBalance(userId);

  const balanceClass = balance > 0 ? 'balance-positive' : 'balance-zero';

  if (loading) {
    return (
      <div className="balance-card loading">
        <p>Loading balance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="balance-card error">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`balance-card ${balanceClass}`}>
      <div className="balance-label">Account Balance</div>
      <div className="balance-amount">{formatCurrency(balance, 'ILS')}</div>
      <div className="balance-status">
        {balance > 0 ? '🟢 Positive balance' : '🔴 Zero balance'}
      </div>
    </div>
  );
}

import React from "react";
import { useAuth } from "../../hooks/useAuth";
import "./BalanceCard.css";

export default function BalanceCard() {
  const { user } = useAuth();

  if (!user) return null;

  const balance = user.balance ?? 0;
  const balanceClass = balance > 0 ? "balance-positive" : "balance-zero";

  return (
    <div className="balance-card">
      <h2>Current Balance</h2>
      <p className={`balance-amount ${balanceClass}`}>
        {balance.toLocaleString()} ILS
      </p>
    </div>
  );
}
