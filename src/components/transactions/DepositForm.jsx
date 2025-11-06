import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { depositMoney } from '../../services/transactionService';
import { isValidAmount } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import Toast from '../common/Toast';

/**
 * Deposit form component
 */
export default function DepositForm({ userId, onSuccess, onError }) {
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

    const depositAmount = parseFloat(amount);

    try {
      setLoading(true);
      await depositMoney(userId, depositAmount);
      
      // Show success toast
      setToast({
        show: true,
        message: `Successfully deposited ${depositAmount.toFixed(2)} ILS`,
        type: 'success',
      });

      // Reset form
      setAmount('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(depositAmount);
      }

      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 3000);
    } catch (err) {
      const errorMessage = err.message || 'Failed to deposit money. Please try again.';
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
      <Card className="deposit-form-card">
        <h2>Deposit Money</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="number"
            label="Amount"
            placeholder="Enter amount to deposit"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            error={error}
            step="0.01"
            min="0.01"
            required
          />
          
          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Deposit'}
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

