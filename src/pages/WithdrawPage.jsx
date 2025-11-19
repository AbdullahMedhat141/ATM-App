import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WithdrawForm from '../components/transactions/WithdrawForm';
import { useAuth } from '../hooks/useAuth';

export default function WithdrawPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="page-container withdraw-page">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user.id) {
    return (
      <div className="page-container withdraw-page">
        <p>Error: User ID not found. Please log in again.</p>
      </div>
    );
  }

  const balance = user.balance ?? 0;

  const handleSuccess = async (amount) => {
  };

  return (
    <div className="page-container withdraw-page">
      <h1>Withdraw Money</h1>
      <WithdrawForm 
        userId={user.id}
        balance={balance}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
