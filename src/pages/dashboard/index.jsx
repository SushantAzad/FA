import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import NavigationBar from '../../components/ui/NavigationBar';
import WalletConnection from '../../components/ui/WalletConnection';
import UserProfile from '../../components/ui/UserProfile';
import PortfolioSummaryCard from './components/PortfolioSummaryCard';
import AssetAllocationChart from './components/AssetAllocationChart';
import RecentTransactionsList from './components/RecentTransactionsList';
import QuickActionsPanel from './components/QuickActionsPanel';
import PerformanceChart from './components/PerformanceChart';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update timestamp every minute
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const portfolioSummaryData = [
    {
      title: 'Total Portfolio Value',
      value: '$13,245.67',
      change: '+2.9%',
      changeType: 'positive',
      icon: 'DollarSign',
      iconColor: 'var(--color-success)'
    },
    {
      title: 'Total Returns',
      value: '$1,245.67',
      change: '+8.4%',
      changeType: 'positive',
      icon: 'TrendingUp',
      iconColor: 'var(--color-accent)'
    },
    {
      title: 'Active Investments',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: 'Building2',
      iconColor: 'var(--color-primary)'
    },
    {
      title: 'Monthly Dividends',
      value: '$342.50',
      change: '+5.2%',
      changeType: 'positive',
      icon: 'Coins',
      iconColor: 'var(--color-warning)'
    }
  ];

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-32 bg-muted rounded-lg mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)]?.map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-80 bg-muted rounded-lg"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-48 bg-muted rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="container mx-auto px-6 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's your portfolio overview.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
              </div>
              <WalletConnection />
              <UserProfile />
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {portfolioSummaryData?.map((card, index) => (
            <PortfolioSummaryCard
              key={index}
              title={card?.title}
              value={card?.value}
              change={card?.change}
              changeType={card?.changeType}
              icon={card?.icon}
              iconColor={card?.iconColor}
            />
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts and Transactions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Chart */}
            <PerformanceChart />

            {/* Asset Allocation Chart */}
            <AssetAllocationChart />

            {/* Recent Transactions */}
            <RecentTransactionsList />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <QuickActionsPanel />
            
            {/* Market Insights */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
              <h3 className="text-lg font-semibold text-foreground mb-4">Market Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                  <Icon name="TrendingUp" size={20} className="text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Real Estate Market</p>
                    <p className="text-xs text-muted-foreground">Up 3.2% this month</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
                  <Icon name="DollarSign" size={20} className="text-success" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Dividend Yield</p>
                    <p className="text-xs text-muted-foreground">Average 4.8% annually</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-warning/10 rounded-lg">
                  <Icon name="Users" size={20} className="text-warning" />
                  <div>
                    <p className="text-sm font-medium text-foreground">New Investors</p>
                    <p className="text-xs text-muted-foreground">+1,247 this week</p>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" fullWidth className="mt-4">
                View Market Analysis
              </Button>
            </div>

            {/* Quick Links */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/asset-browser"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth duration-150"
                >
                  <Icon name="Search" size={18} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">Browse Assets</span>
                </Link>
                
                <Link
                  to="/portfolio-management"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth duration-150"
                >
                  <Icon name="PieChart" size={18} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">Portfolio Management</span>
                </Link>
                
                <Link
                  to="/transaction-history"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth duration-150"
                >
                  <Icon name="History" size={18} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">Transaction History</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;