import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withdrawMoney } from '../../services/transactionService';
import { isValidAmount, isValidWithdrawal } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import Toast from '../common/Toast';

/**
 * Withdraw form component
 */
export default function WithdrawForm({ userId, balance, onSuccess, onError }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate amount
    if (!amount || amount.trim() === '') {
      setError('Please enter an amount');
      return;
    }

    if (!isValidAmount(amount)) {
      setError('Please enter a valid positive amount (max 2 decimal places)');
      return;
    }

    const withdrawAmount = parseFloat(amount);

    // Check if sufficient balance
    if (!isValidWithdrawal(withdrawAmount, balance)) {
      setError('Insufficient balance. Please enter a lower amount.');
      return;
    }

    try {
      setLoading(true);
      await withdrawMoney(userId, withdrawAmount);
      
      // Show success toast
      setToast({
        show: true,
        message: `Successfully withdrew ${withdrawAmount.toFixed(2)} ILS`,
        type: 'success',
      });

      // Reset form
      setAmount('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(withdrawAmount);
      }

      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 3000);
    } catch (err) {
      const errorMessage = err.message || 'Failed to withdraw money. Please try again.';
      setError(errorMessage);
      
      setToast({
        show: true,
        message: errorMessage,
        type: 'error',
      });

      if (onError) {
        onError(err);
      }

      setTimeout(() => {
        setToast({ show: false, message: '', type: 'error' });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="withdraw-form-card">
        <h2>Withdraw Money</h2>
        <div className="balance-display">
          <p>Available Balance: <strong>{balance.toFixed(2)} ILS</strong></p>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            type="number"
            label="Amount"
            placeholder="Enter amount to withdraw"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            error={error}
            step="0.01"
            min="0.01"
            max={balance}
            required
          />
          
          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Withdraw'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
      
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />
    </>
  );
}

