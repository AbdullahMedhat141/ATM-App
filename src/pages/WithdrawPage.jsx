import { useState } from 'react';
import WithdrawForm from '../components/transactions/WithdrawForm';
import { useBalance } from '../hooks/useBalance';

/**
 * Withdraw Page
 */
export default function WithdrawPage() {
  // Get userId from localStorage (set by login)
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem('userId');
    return stored || null;
  });

  const { balance, refreshBalance } = useBalance(userId);

  const handleSuccess = async (amount) => {
    // Refresh balance after successful withdrawal
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
    <div className="page-container withdraw-page">
      <h1>Withdraw Money</h1>
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
      <WithdrawForm 
        userId={actualUserId}
        balance={balance}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
