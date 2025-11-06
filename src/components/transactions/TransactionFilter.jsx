import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

/**
 * Transaction filter component
 */
export default function TransactionFilter({ filter, onFilterChange }) {
  const [localFilter, setLocalFilter] = useState(filter);

  const handleTypeChange = (type) => {
    const newFilter = { ...localFilter, type };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleDateChange = (field, value) => {
    const newFilter = { ...localFilter, [field]: value || null };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleReset = () => {
    const resetFilter = {
      type: 'all',
      startDate: null,
      endDate: null,
    };
    setLocalFilter(resetFilter);
    onFilterChange(resetFilter);
  };

  return (
    <Card className="transaction-filter-card">
      <h3>Filter Transactions</h3>
      
      <div className="filter-section">
        <label className="filter-label">Transaction Type</label>
        <div className="filter-buttons">
          <Button
            variant={localFilter.type === 'all' ? 'primary' : 'secondary'}
            onClick={() => handleTypeChange('all')}
          >
            All
          </Button>
          <Button
            variant={localFilter.type === 'Deposit' ? 'primary' : 'secondary'}
            onClick={() => handleTypeChange('Deposit')}
          >
            Deposit
          </Button>
          <Button
            variant={localFilter.type === 'Withdraw' ? 'primary' : 'secondary'}
            onClick={() => handleTypeChange('Withdraw')}
          >
            Withdraw
          </Button>
          <Button
            variant={localFilter.type === 'Transfer' ? 'primary' : 'secondary'}
            onClick={() => handleTypeChange('Transfer')}
          >
            Transfer
          </Button>
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Date Range</label>
        <div className="date-filters">
          <Input
            type="date"
            label="Start Date"
            value={localFilter.startDate || ''}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
          />
          <Input
            type="date"
            label="End Date"
            value={localFilter.endDate || ''}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-actions">
        <Button variant="secondary" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>
    </Card>
  );
}

