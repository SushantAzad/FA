import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionModal = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success/10 text-success border-success/20', icon: 'CheckCircle' },
      pending: { color: 'bg-warning/10 text-warning border-warning/20', icon: 'Clock' },
      failed: { color: 'bg-error/10 text-error border-error/20', icon: 'XCircle' },
      cancelled: { color: 'bg-muted text-muted-foreground border-border', icon: 'Minus' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${config?.color}`}>
        <Icon name={config?.icon} size={14} />
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

  const handleDownloadReceipt = () => {
    // Mock receipt download
    console.log('Downloading receipt for transaction:', transaction?.id);
  };

  const handleRetryTransaction = () => {
    // Mock retry functionality
    console.log('Retrying transaction:', transaction?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getTransactionTypeColor(transaction?.type)?.replace('text-', 'bg-')}/10`}>
              <Icon 
                name={getTransactionTypeIcon(transaction?.type)} 
                size={20} 
                className={getTransactionTypeColor(transaction?.type)}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Transaction Details</h2>
              <p className="text-sm text-muted-foreground">ID: {transaction?.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(transaction?.status)}
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Icon name="X" size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Transaction Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Property</label>
                <div className="mt-1">
                  <div className="text-lg font-semibold text-foreground">{transaction?.property}</div>
                  <div className="text-sm text-muted-foreground">{transaction?.propertyAddress}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Transaction Type</label>
                <div className="mt-1 flex items-center space-x-2">
                  <Icon 
                    name={getTransactionTypeIcon(transaction?.type)} 
                    size={16} 
                    className={getTransactionTypeColor(transaction?.type)}
                  />
                  <span className="text-lg font-semibold capitalize text-foreground">{transaction?.type}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                <div className="mt-1">
                  <div className="text-lg font-semibold text-foreground">
                    {new Date(transaction.date)?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(transaction.date)?.toLocaleTimeString('en-US')}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <div className="mt-1">
                  <div className={`text-2xl font-bold ${getTransactionTypeColor(transaction?.type)}`}>
                    {formatAmount(transaction?.amount, transaction?.type)}
                  </div>
                  {transaction?.tokens && (
                    <div className="text-sm text-muted-foreground">
                      {transaction?.tokens} tokens @ ${(transaction?.amount / transaction?.tokens)?.toFixed(2)}/token
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Fees</label>
                <div className="mt-1">
                  <div className="text-lg font-semibold text-foreground">
                    ${transaction?.fees?.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Network fee: ${(transaction?.fees * 0.7)?.toFixed(2)} • Platform fee: ${(transaction?.fees * 0.3)?.toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Net Amount</label>
                <div className="mt-1">
                  <div className="text-lg font-semibold text-foreground">
                    ${(Math.abs(transaction?.amount) + transaction?.fees)?.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Information */}
          {transaction?.blockchainHash && (
            <div className="border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Blockchain Information</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction Hash</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-foreground">
                      {transaction?.blockchainHash?.slice(0, 10)}...{transaction?.blockchainHash?.slice(-8)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Copy"
                      onClick={() => navigator.clipboard?.writeText(transaction?.blockchainHash)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Block Number</span>
                  <span className="text-sm font-mono text-foreground">{transaction?.blockNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confirmations</span>
                  <span className="text-sm font-semibold text-success">{transaction?.confirmations}</span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Wallet Address</span>
                <div className="text-sm font-mono text-foreground mt-1">
                  {transaction?.walletAddress || '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4'}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <div className="text-sm text-foreground mt-1">
                  {transaction?.paymentMethod || 'MetaMask Wallet'}
                </div>
              </div>
              {transaction?.notes && (
                <div className="md:col-span-2">
                  <span className="text-sm text-muted-foreground">Notes</span>
                  <div className="text-sm text-foreground mt-1">{transaction?.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2">
            {transaction?.status === 'failed' && (
              <Button
                variant="outline"
                onClick={handleRetryTransaction}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Retry Transaction
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              iconName="Download"
              iconPosition="left"
            >
              Download Receipt
            </Button>
            {transaction?.blockchainHash && (
              <Button
                variant="outline"
                onClick={() => window.open(`https://polygonscan.com/tx/${transaction?.blockchainHash}`, '_blank')}
                iconName="ExternalLink"
                iconPosition="left"
              >
                View on Blockchain
              </Button>
            )}
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;