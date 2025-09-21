import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const InvestmentMetrics = ({ property }) => {
  const performanceData = [
    { month: 'Jan', value: 100, dividend: 0.8 },
    { month: 'Feb', value: 102, dividend: 0.8 },
    { month: 'Mar', value: 105, dividend: 0.9 },
    { month: 'Apr', value: 108, dividend: 0.9 },
    { month: 'May', value: 112, dividend: 1.0 },
    { month: 'Jun', value: 115, dividend: 1.0 }
  ];

  const dividendHistory = [
    { quarter: 'Q1 2024', amount: 2.4, yield: 2.8 },
    { quarter: 'Q4 2023', amount: 2.2, yield: 2.6 },
    { quarter: 'Q3 2023', amount: 2.1, yield: 2.5 },
    { quarter: 'Q2 2023', amount: 2.0, yield: 2.4 }
  ];

  const metrics = [
    {
      icon: 'DollarSign',
      label: 'Token Price',
      value: `$${property?.tokenPrice}`,
      change: '+2.4%',
      positive: true
    },
    {
      icon: 'TrendingUp',
      label: 'Expected Annual Return',
      value: `${property?.expectedReturn}%`,
      change: 'Projected',
      neutral: true
    },
    {
      icon: 'Percent',
      label: 'Dividend Yield',
      value: `${property?.dividendYield}%`,
      change: 'Quarterly',
      neutral: true
    },
    {
      icon: 'BarChart3',
      label: '6M Performance',
      value: '+15.2%',
      change: 'vs Market',
      positive: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="bg-card rounded-lg p-6 shadow-elevation-2">
        <h3 className="text-lg font-semibold text-foreground mb-4">Investment Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics?.map((metric, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={metric?.icon} size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">{metric?.label}</span>
              </div>
              <div className="text-xl font-semibold text-foreground">{metric?.value}</div>
              <div className={`text-xs ${
                metric?.positive ? 'text-success' : metric?.negative ?'text-error': 'text-muted-foreground'
              }`}>
                {metric?.change}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Performance Chart */}
      <div className="bg-card rounded-lg p-6 shadow-elevation-2">
        <h3 className="text-lg font-semibold text-foreground mb-4">6-Month Performance</h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Dividend History */}
      <div className="bg-card rounded-lg p-6 shadow-elevation-2">
        <h3 className="text-lg font-semibold text-foreground mb-4">Dividend History</h3>
        
        <div className="space-y-3">
          {dividendHistory?.map((dividend, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-foreground">{dividend?.quarter}</div>
                <div className="text-xs text-muted-foreground">Yield: {dividend?.yield}%</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-success">${dividend?.amount}</div>
                <div className="text-xs text-muted-foreground">per token</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentMetrics;