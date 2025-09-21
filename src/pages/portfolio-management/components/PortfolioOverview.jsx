import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const PortfolioOverview = ({ portfolioData, totalValue, totalReturns, returnPercentage }) => {
  const allocationData = [
    { name: 'Residential', value: 45, color: '#1E40AF' },
    { name: 'Commercial', value: 30, color: '#0EA5E9' },
    { name: 'Industrial', value: 15, color: '#059669' },
    { name: 'Mixed-Use', value: 10, color: '#D97706' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value?.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Portfolio Value Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Value</span>
            <Icon name="DollarSign" size={20} className="text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</div>
          <div className="text-xs text-muted-foreground mt-1">Portfolio Balance</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Returns</span>
            <Icon 
              name={totalReturns >= 0 ? "TrendingUp" : "TrendingDown"} 
              size={20} 
              className={totalReturns >= 0 ? "text-success" : "text-error"} 
            />
          </div>
          <div className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-success' : 'text-error'}`}>
            {formatCurrency(totalReturns)}
          </div>
          <div className={`text-xs mt-1 ${totalReturns >= 0 ? 'text-success' : 'text-error'}`}>
            {formatPercentage(returnPercentage)}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Properties</span>
            <Icon name="Building2" size={20} className="text-accent" />
          </div>
          <div className="text-2xl font-bold text-foreground">{portfolioData?.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Active Holdings</div>
        </div>
      </div>
      {/* Asset Allocation Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Asset Allocation</h3>
          <Icon name="PieChart" size={20} className="text-muted-foreground" />
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {allocationData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Allocation']}
                labelStyle={{ color: 'var(--color-foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {allocationData?.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item?.color }}
              />
              <span className="text-xs text-muted-foreground">{item?.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;