import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ConfirmationDialog from '../components/popups/ConfirmationDialog';
import { clearTransactions, updateBalance } from '../services/transactionService';
import './SettingsPage.css';

export default function SettingsPage() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!user) {
    return (
      <div className="page-container settings-page">
        <p>Loading...</p>
      </div>
    );
  }

  const handleResetAccount = async () => {
    setShowConfirmReset(false);
    setIsResetting(true);
    
    try {
      // Clear transactions and reset balance to 0
      await clearTransactions(user.id);
      await updateBalance(user.id, 0);
      
      showToast('Account reset successfully', 'success', 3000);
      
      // Navigate back to dashboard after a brief delay
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    } catch (error) {
      showToast(`Failed to reset account: ${error.message}`, 'error', 4000);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="page-container settings-page">
      <h1>Settings</h1>
      
      <Card className="settings-card">
        <h2>Theme</h2>
        <div className="settings-section">
          <p>Current theme: <strong>{isDark ? '🌙 Dark' : '☀️ Light'}</strong></p>
          <Button onClick={toggleTheme} className="settings-button">
            {isDark ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
          </Button>
        </div>
      </Card>

      <Card className="settings-card">
        <h2>Account Management</h2>
        <div className="settings-section">
          <p>⚠️ Reset your account data (balance and transaction history)</p>
          <Button 
            onClick={() => setShowConfirmReset(true)}
            className="settings-button danger"
            disabled={isResetting}
          >
            {isResetting ? 'Resetting...' : '🔄 Reset Account'}
          </Button>
        </div>
      </Card>

      {showConfirmReset && (
        <ConfirmationDialog
          title="Reset Account?"
          message="This will clear all transactions and set your balance to zero. This action cannot be undone."
          onConfirm={handleResetAccount}
          onCancel={() => setShowConfirmReset(false)}
          confirmText="Reset"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
