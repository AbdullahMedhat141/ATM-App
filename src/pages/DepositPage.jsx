import { useState, useEffect } from 'react';
import DepositForm from '../components/transactions/DepositForm';
import { useBalance } from '../hooks/useBalance';

/**
 * Deposit Page
 */
export default function DepositPage() {
  // Get userId from localStorage (set by login)
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem('userId');
    return stored || null;
  });

  const { balance, refreshBalance } = useBalance(userId);

  const handleSuccess = async (amount) => {
    // Refresh balance after successful deposit
    await refreshBalance();
  };

  // For testing: If no userId, use a test ID (remove this when login is ready)
  const testUserId = '2'; // Using user ID 2 from mock data as example
  const actualUserId = userId || testUserId;
  
  if (!userId) {
    console.warn('No userId found. Using test userId:', testUserId);
    localStorage.setItem('userId', testUserId);
  }

  return (
    <div className="page-container deposit-page">
      <h1>Deposit Money</h1>
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
      <DepositForm 
        userId={actualUserId} 
        onSuccess={handleSuccess}
      />
    </div>
  );
}
