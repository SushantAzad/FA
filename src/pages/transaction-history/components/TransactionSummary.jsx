import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionSummary = ({ summaryData, onExport }) => {
  const summaryCards = [
    {
      title: 'Total Transactions',
      value: summaryData?.totalTransactions?.toLocaleString(),
      icon: 'FileText',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Total Volume',
      value: `$${summaryData?.totalVolume?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: 'DollarSign',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Total Fees',
      value: `$${summaryData?.totalFees?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: 'Minus',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Net Profit/Loss',
      value: `${summaryData?.netProfitLoss >= 0 ? '+' : ''}$${summaryData?.netProfitLoss?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: summaryData?.netProfitLoss >= 0 ? 'TrendingUp' : 'TrendingDown',
      color: summaryData?.netProfitLoss >= 0 ? 'text-success' : 'text-error',
      bgColor: summaryData?.netProfitLoss >= 0 ? 'bg-success/10' : 'bg-error/10'
    }
  ];

  const transactionBreakdown = [
    { type: 'Purchases', count: summaryData?.breakdown?.purchases, amount: summaryData?.breakdown?.purchaseAmount, color: 'text-success' },
    { type: 'Sales', count: summaryData?.breakdown?.sales, amount: summaryData?.breakdown?.saleAmount, color: 'text-error' },
    { type: 'Dividends', count: summaryData?.breakdown?.dividends, amount: summaryData?.breakdown?.dividendAmount, color: 'text-accent' },
    { type: 'Fees', count: summaryData?.breakdown?.fees, amount: summaryData?.breakdown?.feeAmount, color: 'text-warning' }
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards?.map((card, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{card?.title}</p>
                <p className={`text-2xl font-bold ${card?.color}`}>{card?.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card?.bgColor}`}>
                <Icon name={card?.icon} size={24} className={card?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Detailed Summary Panel */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Transaction Analysis</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('pdf')}
              iconName="FileText"
              iconPosition="left"
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('csv')}
              iconName="Download"
              iconPosition="left"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Transaction Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Transaction Breakdown</h4>
            <div className="space-y-3">
              {transactionBreakdown?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item?.color?.replace('text-', 'bg-')}`} />
                    <span className="text-sm font-medium text-foreground">{item?.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">{item?.count}</div>
                    <div className={`text-xs ${item?.color}`}>
                      ${Math.abs(item?.amount)?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Average Transaction</span>
                <span className="text-sm font-semibold text-foreground">
                  ${summaryData?.averageTransaction?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-semibold text-success">
                  {summaryData?.successRate?.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Properties</span>
                <span className="text-sm font-semibold text-foreground">
                  {summaryData?.totalProperties}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Active Investments</span>
                <span className="text-sm font-semibold text-accent">
                  {summaryData?.activeInvestments}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-4">Recent Activity (Last 30 Days)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">
                {summaryData?.recentActivity?.transactions}
              </div>
              <div className="text-xs text-muted-foreground">Transactions</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-success mb-1">
                ${summaryData?.recentActivity?.volume?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Volume</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className={`text-2xl font-bold mb-1 ${summaryData?.recentActivity?.profitLoss >= 0 ? 'text-success' : 'text-error'}`}>
                {summaryData?.recentActivity?.profitLoss >= 0 ? '+' : ''}${summaryData?.recentActivity?.profitLoss?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">P&L</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;