import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';


const PerformanceChart = ({ performanceData }) => {
  const [timeRange, setTimeRange] = useState('6M');
  const [chartType, setChartType] = useState('line');

  const timeRanges = [
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: 'All', value: 'ALL' }
  ];

  const getFilteredData = () => {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '1M':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '3M':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6M':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '1Y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        return performanceData;
    }
    
    return performanceData?.filter(item => new Date(item.date) >= startDate);
  };

  const filteredData = getFilteredData();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: timeRange === 'ALL' || timeRange === '1Y' ? 'numeric' : undefined
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-foreground mb-2">
            {formatDate(label)}
          </p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-sm text-muted-foreground">{entry?.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(entry?.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const currentValue = filteredData?.[filteredData?.length - 1]?.value || 0;
  const previousValue = filteredData?.[0]?.value || 0;
  const change = currentValue - previousValue;
  const changePercentage = previousValue > 0 ? (change / previousValue) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Portfolio Performance</h3>
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(currentValue)}
            </div>
            <div className={`flex items-center space-x-1 ${change >= 0 ? 'text-success' : 'text-error'}`}>
              <Icon 
                name={change >= 0 ? "TrendingUp" : "TrendingDown"} 
                size={16} 
              />
              <span className="text-sm font-medium">
                {change >= 0 ? '+' : ''}{formatCurrency(change)} ({changePercentage >= 0 ? '+' : ''}{changePercentage?.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="flex bg-muted rounded-lg p-1">
            {timeRanges?.map((range) => (
              <button
                key={range?.value}
                onClick={() => setTimeRange(range?.value)}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  timeRange === range?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range?.label}
              </button>
            ))}
          </div>
          
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded transition-colors ${
                chartType === 'line' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
              title="Line Chart"
            >
              <Icon name="TrendingUp" size={16} />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-2 rounded transition-colors ${
                chartType === 'area' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
              title="Area Chart"
            >
              <Icon name="BarChart3" size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}K`}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                name="Portfolio Value"
              />
            </LineChart>
          ) : (
            <AreaChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}K`}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="var(--color-primary)" 
                fill="var(--color-primary)"
                fillOpacity={0.1}
                strokeWidth={2}
                name="Portfolio Value"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Best Performance</div>
          <div className="text-lg font-semibold text-success">+24.8%</div>
          <div className="text-xs text-muted-foreground">March 2024</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Average Return</div>
          <div className="text-lg font-semibold text-foreground">+12.4%</div>
          <div className="text-xs text-muted-foreground">Annual</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Volatility</div>
          <div className="text-lg font-semibold text-warning">8.2%</div>
          <div className="text-xs text-muted-foreground">Standard Dev</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;