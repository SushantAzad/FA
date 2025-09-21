import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionFilters = ({ onFiltersChange, resultsCount }) => {
  const [filters, setFilters] = useState({
    dateRange: 'all',
    customStartDate: '',
    customEndDate: '',
    transactionType: 'all',
    property: 'all',
    status: 'all',
    amountMin: '',
    amountMax: '',
    searchTerm: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const transactionTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'buy', label: 'Purchase' },
    { value: 'sell', label: 'Sale' },
    { value: 'dividend', label: 'Dividend' },
    { value: 'fee', label: 'Fee' },
    { value: 'transfer', label: 'Transfer' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const propertyOptions = [
    { value: 'all', label: 'All Properties' },
    { value: 'manhattan-tower', label: 'Manhattan Tower' },
    { value: 'brooklyn-heights', label: 'Brooklyn Heights' },
    { value: 'queens-plaza', label: 'Queens Plaza' },
    { value: 'bronx-residential', label: 'Bronx Residential' },
    { value: 'staten-commercial', label: 'Staten Commercial' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      dateRange: 'all',
      customStartDate: '',
      customEndDate: '',
      transactionType: 'all',
      property: 'all',
      status: 'all',
      amountMin: '',
      amountMax: '',
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value !== '' && value !== 'all'
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Filter Transactions</h3>
          {resultsCount !== undefined && (
            <span className="text-sm text-muted-foreground">
              {resultsCount?.toLocaleString()} results
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showAdvanced ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          type="search"
          placeholder="Search transactions..."
          value={filters?.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e?.target?.value)}
          className="w-full"
        />

        <Select
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          placeholder="Select date range"
        />

        <Select
          options={transactionTypeOptions}
          value={filters?.transactionType}
          onChange={(value) => handleFilterChange('transactionType', value)}
          placeholder="Transaction type"
        />

        <Select
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Status"
        />
      </div>
      {/* Custom Date Range */}
      {filters?.dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            type="date"
            label="Start Date"
            value={filters?.customStartDate}
            onChange={(e) => handleFilterChange('customStartDate', e?.target?.value)}
          />
          <Input
            type="date"
            label="End Date"
            value={filters?.customEndDate}
            onChange={(e) => handleFilterChange('customEndDate', e?.target?.value)}
          />
        </div>
      )}
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Property"
              options={propertyOptions}
              value={filters?.property}
              onChange={(value) => handleFilterChange('property', value)}
              placeholder="Select property"
            />

            <Input
              type="number"
              label="Min Amount ($)"
              placeholder="0.00"
              value={filters?.amountMin}
              onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
            />

            <Input
              type="number"
              label="Max Amount ($)"
              placeholder="10,000.00"
              value={filters?.amountMax}
              onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
            />
          </div>
        </div>
      )}
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(filters)?.map(([key, value]) => {
            if (value && value !== 'all') {
              return (
                <span
                  key={key}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => handleFilterChange(key, key?.includes('Date') ? '' : 'all')}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;