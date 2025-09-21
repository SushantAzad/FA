import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionTable = ({ transactions, onTransactionClick, onSort, sortConfig }) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success/10 text-success border-success/20', icon: 'CheckCircle' },
      pending: { color: 'bg-warning/10 text-warning border-warning/20', icon: 'Clock' },
      failed: { color: 'bg-error/10 text-error border-error/20', icon: 'XCircle' },
      cancelled: { color: 'bg-muted text-muted-foreground border-border', icon: 'Minus' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const getTransactionTypeIcon = (type) => {
    const typeIcons = {
      buy: 'TrendingUp',
      sell: 'TrendingDown',
      dividend: 'DollarSign',
      fee: 'Minus',
      transfer: 'ArrowRightLeft'
    };
    return typeIcons?.[type] || 'Circle';
  };

  const getTransactionTypeColor = (type) => {
    const typeColors = {
      buy: 'text-success',
      sell: 'text-error',
      dividend: 'text-accent',
      fee: 'text-warning',
      transfer: 'text-muted-foreground'
    };
    return typeColors?.[type] || 'text-muted-foreground';
  };

  const formatAmount = (amount, type) => {
    const prefix = type === 'sell' || type === 'dividend' ? '+' : type === 'buy' || type === 'fee' ? '-' : '';
    return `${prefix}$${Math.abs(amount)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleSort = (column) => {
    onSort(column);
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleSelectTransaction = (transactionId) => {
    setSelectedTransactions(prev => 
      prev?.includes(transactionId)
        ? prev?.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions?.length === transactions?.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions?.map(t => t?.id));
    }
  };

  const columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'property', label: 'Property', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'fees', label: 'Fees', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header with Bulk Actions */}
      {selectedTransactions?.length > 0 && (
        <div className="bg-primary/5 border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedTransactions?.length} transaction{selectedTransactions?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="Download">
                Export Selected
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTransactions([])}>
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedTransactions?.length === transactions?.length && transactions?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              {columns?.map((column) => (
                <th key={column?.key} className="px-6 py-4 text-left">
                  {column?.sortable ? (
                    <button
                      onClick={() => handleSort(column?.key)}
                      className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <span>{column?.label}</span>
                      <Icon name={getSortIcon(column?.key)} size={14} />
                    </button>
                  ) : (
                    <span className="text-sm font-medium text-foreground">{column?.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions?.map((transaction) => (
              <tr key={transaction?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedTransactions?.includes(transaction?.id)}
                    onChange={() => handleSelectTransaction(transaction?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    {new Date(transaction.date)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(transaction.date)?.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-foreground">{transaction?.property}</div>
                  <div className="text-xs text-muted-foreground">{transaction?.propertyAddress}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getTransactionTypeIcon(transaction?.type)} 
                      size={16} 
                      className={getTransactionTypeColor(transaction?.type)}
                    />
                    <span className="text-sm font-medium capitalize">{transaction?.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm font-semibold ${getTransactionTypeColor(transaction?.type)}`}>
                    {formatAmount(transaction?.amount, transaction?.type)}
                  </div>
                  {transaction?.tokens && (
                    <div className="text-xs text-muted-foreground">
                      {transaction?.tokens} tokens
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    ${transaction?.fees?.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(transaction?.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTransactionClick(transaction)}
                      iconName="Eye"
                    >
                      View
                    </Button>
                    {transaction?.blockchainHash && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="ExternalLink"
                        onClick={() => window.open(`https://polygonscan.com/tx/${transaction?.blockchainHash}`, '_blank')}
                      >
                        Blockchain
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {transactions?.map((transaction) => (
          <div key={transaction?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedTransactions?.includes(transaction?.id)}
                  onChange={() => handleSelectTransaction(transaction?.id)}
                  className="rounded border-border"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{transaction?.property}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(transaction.date)?.toLocaleDateString('en-US')}
                  </div>
                </div>
              </div>
              {getStatusBadge(transaction?.status)}
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getTransactionTypeIcon(transaction?.type)} 
                  size={16} 
                  className={getTransactionTypeColor(transaction?.type)}
                />
                <span className="text-sm capitalize">{transaction?.type}</span>
              </div>
              <div className={`text-sm font-semibold ${getTransactionTypeColor(transaction?.type)}`}>
                {formatAmount(transaction?.amount, transaction?.type)}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>Fees: ${transaction?.fees?.toFixed(2)}</span>
              {transaction?.tokens && <span>{transaction?.tokens} tokens</span>}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTransactionClick(transaction)}
                iconName="Eye"
                fullWidth
              >
                View Details
              </Button>
              {transaction?.blockchainHash && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ExternalLink"
                  onClick={() => window.open(`https://polygonscan.com/tx/${transaction?.blockchainHash}`, '_blank')}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {transactions?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;