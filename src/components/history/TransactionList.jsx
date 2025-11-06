import TransactionCard from '../transactions/TransactionCard';

/**
 * Transaction list component
 */
export default function TransactionList({ transactions, loading, error }) {
  if (loading) {
    return (
      <div className="transaction-list-loading">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-list-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-list-empty">
        <p>No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}

