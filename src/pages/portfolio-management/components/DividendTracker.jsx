import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DividendTracker = ({ dividendData, totalDividends, monthlyDividends }) => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const timeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'upcoming', label: 'Upcoming' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })?.format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'upcoming':
        return 'text-accent bg-accent/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'upcoming':
        return 'Calendar';
      default:
        return 'Circle';
    }
  };

  const filteredDividends = dividendData?.filter(dividend => {
    const matchesTime = timeFilter === 'all' || 
      (timeFilter === '3months' && new Date(dividend.date) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) ||
      (timeFilter === '6months' && new Date(dividend.date) >= new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)) ||
      (timeFilter === '1year' && new Date(dividend.date) >= new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
    
    const matchesStatus = statusFilter === 'all' || dividend?.status === statusFilter;
    
    return matchesTime && matchesStatus;
  });

  const nextDividend = dividendData?.find(d => d?.status === 'upcoming');
  const avgMonthlyDividend = monthlyDividends / 12;

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Dividend Tracker</h3>
            <div className="flex items-center space-x-6">
              <div>
                <div className="text-sm text-muted-foreground">Total Earned</div>
                <div className="text-xl font-bold text-success">{formatCurrency(totalDividends)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Monthly Average</div>
                <div className="text-xl font-bold text-foreground">{formatCurrency(avgMonthlyDividend)}</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              options={timeOptions}
              value={timeFilter}
              onChange={setTimeFilter}
              className="w-full sm:w-40"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full sm:w-40"
            />
          </div>
        </div>
      </div>
      {/* Next Dividend Alert */}
      {nextDividend && (
        <div className="p-4 bg-accent/5 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
              <Icon name="Calendar" size={20} className="text-accent" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground">Next Dividend Payment</div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(nextDividend?.amount)} expected on {formatDate(nextDividend?.date)}
              </div>
            </div>
            <Button variant="outline" size="sm" iconName="Bell" iconPosition="left">
              Set Reminder
            </Button>
          </div>
        </div>
      )}
      {/* Dividend History */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredDividends?.length > 0 ? (
            filteredDividends?.map((dividend) => (
              <div key={dividend?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={dividend?.propertyImage} 
                      alt={dividend?.propertyName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{dividend?.propertyName}</div>
                    <div className="text-sm text-muted-foreground">{dividend?.location}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {dividend?.tokens?.toLocaleString()} tokens • {dividend?.yieldRate}% yield
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-foreground mb-1">
                    {formatCurrency(dividend?.amount)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {formatDate(dividend?.date)}
                  </div>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dividend?.status)}`}>
                    <Icon name={getStatusIcon(dividend?.status)} size={12} />
                    <span className="capitalize">{dividend?.status}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Icon name="Coins" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No Dividends Found</h4>
              <p className="text-muted-foreground">
                No dividend payments match your current filters.
              </p>
            </div>
          )}
        </div>

        {filteredDividends?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground mb-1">This Quarter</div>
                <div className="text-lg font-semibold text-foreground">
                  {formatCurrency(filteredDividends?.filter(d => d?.status === 'paid' && new Date(d.date) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))?.reduce((sum, d) => sum + d?.amount, 0)
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Average Yield</div>
                <div className="text-lg font-semibold text-success">
                  {(filteredDividends?.reduce((sum, d) => sum + d?.yieldRate, 0) / filteredDividends?.length || 0)?.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Properties Paying</div>
                <div className="text-lg font-semibold text-foreground">
                  {new Set(filteredDividends.map(d => d.propertyId))?.size}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DividendTracker;