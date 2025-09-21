import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const HoldingsTable = ({ holdings, onSellTokens, onViewDetails }) => {
  const [sortBy, setSortBy] = useState('value');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');

  const sortOptions = [
    { value: 'name', label: 'Property Name' },
    { value: 'value', label: 'Current Value' },
    { value: 'returns', label: 'Returns' },
    { value: 'tokens', label: 'Token Quantity' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Properties' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' }
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

  const sortedAndFilteredHoldings = holdings?.filter(holding => filterBy === 'all' || holding?.type?.toLowerCase() === filterBy)?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">Holdings</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              options={filterOptions}
              value={filterBy}
              onChange={setFilterBy}
              placeholder="Filter by type"
              className="w-full sm:w-48"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              className="w-full sm:w-48"
            />
          </div>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Property</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('tokens')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Tokens</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('value')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Current Value</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('returns')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Returns</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Dividends</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredHoldings?.map((holding) => (
              <tr key={holding?.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={holding?.image} 
                        alt={holding?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{holding?.name}</div>
                      <div className="text-sm text-muted-foreground">{holding?.location}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-foreground">{holding?.tokens?.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">of {holding?.totalTokens?.toLocaleString()}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-foreground">{formatCurrency(holding?.value)}</div>
                  <div className="text-sm text-muted-foreground">${holding?.pricePerToken}/token</div>
                </td>
                <td className="p-4">
                  <div className={`font-medium ${holding?.returns >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatCurrency(holding?.returnsAmount)}
                  </div>
                  <div className={`text-sm ${holding?.returns >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatPercentage(holding?.returns)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-foreground">{formatCurrency(holding?.dividends)}</div>
                  <div className="text-sm text-muted-foreground">Last: {holding?.lastDividend}</div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(holding?.id)}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onSellTokens(holding?.id)}
                      iconName="Minus"
                      iconPosition="left"
                    >
                      Sell
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden p-4 space-y-4">
        {sortedAndFilteredHoldings?.map((holding) => (
          <div key={holding?.id} className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                <img 
                  src={holding?.image} 
                  alt={holding?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{holding?.name}</div>
                <div className="text-sm text-muted-foreground">{holding?.location}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Tokens</div>
                <div className="font-medium text-foreground">{holding?.tokens?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Value</div>
                <div className="font-medium text-foreground">{formatCurrency(holding?.value)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Returns</div>
                <div className={`font-medium ${holding?.returns >= 0 ? 'text-success' : 'text-error'}`}>
                  {formatPercentage(holding?.returns)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Dividends</div>
                <div className="font-medium text-foreground">{formatCurrency(holding?.dividends)}</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(holding?.id)}
                iconName="Eye"
                iconPosition="left"
                fullWidth
              >
                View Details
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onSellTokens(holding?.id)}
                iconName="Minus"
                iconPosition="left"
                fullWidth
              >
                Sell Tokens
              </Button>
            </div>
          </div>
        ))}
      </div>
      {sortedAndFilteredHoldings?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Building2" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Holdings Found</h3>
          <p className="text-muted-foreground mb-4">
            {filterBy === 'all' 
              ? "You don't have any property investments yet." 
              : `No ${filterBy} properties found in your portfolio.`
            }
          </p>
          <Button variant="default" iconName="Plus" iconPosition="left">
            Browse Properties
          </Button>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;