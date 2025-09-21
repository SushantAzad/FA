import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactionsList = () => {
  const [filter, setFilter] = useState('all');

  const transactions = [
    {
      id: 1,
      type: 'buy',
      asset: 'Luxury Apartments NYC',
      amount: '$2,500.00',
      tokens: '125 LAPT',
      date: '2025-01-06',
      time: '14:30',
      status: 'completed',
      txHash: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4'
    },
    {
      id: 2,
      type: 'sell',
      asset: 'Commercial Plaza Miami',
      amount: '$1,800.00',
      tokens: '90 CPMT',
      date: '2025-01-05',
      time: '09:15',
      status: 'completed',
      txHash: '0x8f3e2a1b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f'
    },
    {
      id: 3,
      type: 'dividend',
      asset: 'Industrial Warehouse TX',
      amount: '$150.00',
      tokens: '75 IWTX',
      date: '2025-01-04',
      time: '16:45',
      status: 'completed',
      txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
    },
    {
      id: 4,
      type: 'buy',
      asset: 'Retail Center CA',
      amount: '$3,200.00',
      tokens: '160 RCCA',
      date: '2025-01-03',
      time: '11:20',
      status: 'pending',
      txHash: '0x9f8e7d6c5b4a3928374650192837465019283746'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'buy', label: 'Purchases' },
    { value: 'sell', label: 'Sales' },
    { value: 'dividend', label: 'Dividends' }
  ];

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions?.filter(tx => tx?.type === filter);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'buy':
        return 'ArrowUpRight';
      case 'sell':
        return 'ArrowDownLeft';
      case 'dividend':
        return 'DollarSign';
      default:
        return 'Activity';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'buy':
        return 'text-success';
      case 'sell':
        return 'text-error';
      case 'dividend':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-success/10 text-success`;
      case 'pending':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'failed':
        return `${baseClasses} bg-error/10 text-error`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const formatTransactionType = (type) => {
    switch (type) {
      case 'buy':
        return 'Purchase';
      case 'sell':
        return 'Sale';
      case 'dividend':
        return 'Dividend';
      default:
        return type;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="px-3 py-1 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {filterOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" iconName="ExternalLink">
            View All
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {filteredTransactions?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions found for the selected filter.</p>
          </div>
        ) : (
          filteredTransactions?.map((transaction) => (
            <div key={transaction?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth duration-150">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-background ${getTransactionColor(transaction?.type)}`}>
                  <Icon name={getTransactionIcon(transaction?.type)} size={20} />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-foreground">{formatTransactionType(transaction?.type)}</p>
                    <span className={getStatusBadge(transaction?.status)}>
                      {transaction?.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{transaction?.asset}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {transaction?.date} at {transaction?.time}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-foreground">{transaction?.amount}</p>
                <p className="text-sm text-muted-foreground">{transaction?.tokens}</p>
                <button
                  onClick={() => window.open(`https://polygonscan.com/tx/${transaction?.txHash}`, '_blank')}
                  className="text-xs text-accent hover:underline mt-1"
                >
                  View on Explorer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactionsList;