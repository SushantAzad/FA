import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../../../components/ui/Button';

const PerformanceChart = () => {
  const [timeframe, setTimeframe] = useState('7d');

  const performanceData = {
    '7d': [
      { date: 'Dec 30', value: 12500, returns: 2.1 },
      { date: 'Dec 31', value: 12750, returns: 2.3 },
      { date: 'Jan 01', value: 12900, returns: 2.5 },
      { date: 'Jan 02', value: 12650, returns: 2.2 },
      { date: 'Jan 03', value: 13100, returns: 2.8 },
      { date: 'Jan 04', value: 13350, returns: 3.1 },
      { date: 'Jan 05', value: 13200, returns: 2.9 }
    ],
    '30d': [
      { date: 'Dec 06', value: 11800, returns: 1.5 },
      { date: 'Dec 13', value: 12100, returns: 1.8 },
      { date: 'Dec 20', value: 12300, returns: 2.0 },
      { date: 'Dec 27', value: 12600, returns: 2.2 },
      { date: 'Jan 03', value: 13100, returns: 2.8 },
      { date: 'Jan 05', value: 13200, returns: 2.9 }
    ],
    '90d': [
      { date: 'Oct 06', value: 10500, returns: 0.8 },
      { date: 'Oct 20', value: 10800, returns: 1.2 },
      { date: 'Nov 03', value: 11200, returns: 1.6 },
      { date: 'Nov 17', value: 11600, returns: 1.9 },
      { date: 'Dec 01', value: 11900, returns: 2.1 },
      { date: 'Dec 15', value: 12400, returns: 2.4 },
      { date: 'Jan 05', value: 13200, returns: 2.9 }
    ]
  };

  const timeframeOptions = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' }
  ];

  const currentData = performanceData?.[timeframe];
  const latestValue = currentData?.[currentData?.length - 1];
  const previousValue = currentData?.[currentData?.length - 2];
  const change = ((latestValue?.value - previousValue?.value) / previousValue?.value * 100)?.toFixed(2);
  const isPositive = change >= 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-popover-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">
            Value: ${data?.value?.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Returns: {data?.returns}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Portfolio Performance</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl font-bold text-foreground">
              ${latestValue?.value?.toLocaleString()}
            </span>
            <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {timeframeOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={timeframe === option?.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe(option?.value)}
              className="px-3 py-1 text-xs"
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;