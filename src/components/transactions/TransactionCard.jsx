import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Card from '../common/Card';

/**
 * Transaction card component for displaying a single transaction
 */
export default function TransactionCard({ transaction }) {
  const isDeposit = transaction.type === 'Deposit';
  const isWithdraw = transaction.type === 'Withdraw';
  const isTransfer = transaction.type === 'Transfer';

  return (
    <Card className={`transaction-card transaction-${transaction.type.toLowerCase()}`}>
      <div className="transaction-header">
        <div className="transaction-type">
          <span className={`transaction-icon ${isDeposit ? 'icon-deposit' : isWithdraw ? 'icon-withdraw' : 'icon-transfer'}`}>
            {isDeposit ? '💰' : isWithdraw ? '🏧' : '💸'}
          </span>
          <span className="transaction-type-label">{transaction.type}</span>
        </div>
        <div className={`transaction-amount ${isDeposit ? 'amount-positive' : 'amount-negative'}`}>
          {isDeposit ? '+' : '-'}
          {formatCurrency(Math.abs(transaction.amount), transaction.currency || 'ILS')}
        </div>
      </div>
      
      <div className="transaction-body">
        <div className="transaction-date">
          {formatDate(transaction.date)}
        </div>
        {transaction.target_user && (
          <div className="transaction-target">
            To: {transaction.target_user}
          </div>
        )}
      </div>
    </Card>
  );
}

