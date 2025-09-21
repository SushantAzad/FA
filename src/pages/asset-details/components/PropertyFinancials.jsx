import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PropertyFinancials = ({ property }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const financialData = {
    overview: {
      totalValue: 2500000,
      tokenPrice: 100,
      totalTokens: 25000,
      availableTokens: 8750,
      minimumInvestment: 1000,
      managementFee: 1.5,
      performanceFee: 20
    },
    income: {
      monthlyRent: 18500,
      annualRent: 222000,
      occupancyRate: 95,
      operatingExpenses: 66600,
      netOperatingIncome: 155400,
      capRate: 6.2
    },
    expenses: [
      { category: 'Property Management', amount: 22200, percentage: 10 },
      { category: 'Maintenance & Repairs', amount: 15540, percentage: 7 },
      { category: 'Insurance', amount: 8880, percentage: 4 },
      { category: 'Property Taxes', amount: 13320, percentage: 6 },
      { category: 'Utilities', amount: 4440, percentage: 2 },
      { category: 'Other', amount: 2220, percentage: 1 }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'income', label: 'Income', icon: 'TrendingUp' },
    { id: 'expenses', label: 'Expenses', icon: 'TrendingDown' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex space-x-0">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-smooth duration-150 ${
                activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Total Property Value</div>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(financialData?.overview?.totalValue)}
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Token Price</div>
                <div className="text-2xl font-bold text-foreground">
                  ${financialData?.overview?.tokenPrice}
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Available Tokens</div>
                <div className="text-2xl font-bold text-foreground">
                  {financialData?.overview?.availableTokens?.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  of {financialData?.overview?.totalTokens?.toLocaleString()} total
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-semibold text-foreground mb-3">Investment Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Minimum Investment</span>
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(financialData?.overview?.minimumInvestment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Management Fee</span>
                    <span className="text-sm font-medium text-foreground">
                      {financialData?.overview?.managementFee}% annually
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Performance Fee</span>
                    <span className="text-sm font-medium text-foreground">
                      {financialData?.overview?.performanceFee}% of profits
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-foreground mb-3">Token Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sold</span>
                    <span className="text-foreground">
                      {((financialData?.overview?.totalTokens - financialData?.overview?.availableTokens) / financialData?.overview?.totalTokens * 100)?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ 
                        width: `${(financialData?.overview?.totalTokens - financialData?.overview?.availableTokens) / financialData?.overview?.totalTokens * 100}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(financialData?.overview?.totalTokens - financialData?.overview?.availableTokens)?.toLocaleString()} of {financialData?.overview?.totalTokens?.toLocaleString()} tokens sold
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'income' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-success/10 rounded-lg">
                <div className="text-sm text-success mb-1">Monthly Rent</div>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(financialData?.income?.monthlyRent)}
                </div>
              </div>
              
              <div className="p-4 bg-success/10 rounded-lg">
                <div className="text-sm text-success mb-1">Annual Rent</div>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(financialData?.income?.annualRent)}
                </div>
              </div>
              
              <div className="p-4 bg-success/10 rounded-lg">
                <div className="text-sm text-success mb-1">Occupancy Rate</div>
                <div className="text-2xl font-bold text-foreground">
                  {financialData?.income?.occupancyRate}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-foreground">Income Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gross Annual Rent</span>
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(financialData?.income?.annualRent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Operating Expenses</span>
                    <span className="text-sm font-medium text-error">
                      -{formatCurrency(financialData?.income?.operatingExpenses)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-foreground">Net Operating Income</span>
                      <span className="text-sm font-bold text-success">
                        {formatCurrency(financialData?.income?.netOperatingIncome)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-md font-semibold text-foreground">Key Ratios</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cap Rate</span>
                    <span className="text-sm font-medium text-foreground">
                      {financialData?.income?.capRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Expense Ratio</span>
                    <span className="text-sm font-medium text-foreground">
                      {(financialData?.income?.operatingExpenses / financialData?.income?.annualRent * 100)?.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="p-4 bg-error/10 rounded-lg">
              <div className="text-sm text-error mb-1">Total Annual Expenses</div>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(financialData?.income?.operatingExpenses)}
              </div>
              <div className="text-xs text-muted-foreground">
                {(financialData?.income?.operatingExpenses / financialData?.income?.annualRent * 100)?.toFixed(1)}% of gross rent
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-foreground mb-4">Expense Breakdown</h4>
              <div className="space-y-3">
                {financialData?.expenses?.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-foreground">{expense?.category}</div>
                      <div className="text-xs text-muted-foreground">{expense?.percentage}% of gross rent</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground">
                        {formatCurrency(expense?.amount)}
                      </div>
                      <div className="w-20 bg-muted rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-error h-1.5 rounded-full"
                          style={{ width: `${expense?.percentage * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFinancials;