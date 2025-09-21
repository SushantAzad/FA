import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import NavigationBar from '../../components/ui/NavigationBar';
import WalletConnection from '../../components/ui/WalletConnection';
import UserProfile from '../../components/ui/UserProfile';
import PortfolioOverview from './components/PortfolioOverview';
import HoldingsTable from './components/HoldingsTable';
import PerformanceChart from './components/PerformanceChart';
import DividendTracker from './components/DividendTracker';
import RebalanceModal from './components/RebalanceModal';
import SellTokensModal from './components/SellTokensModal';

const PortfolioManagement = () => {
  const navigate = useNavigate();
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock portfolio data
  const portfolioData = [
    {
      id: 1,
      name: "Luxury Downtown Apartments",
      location: "Manhattan, NY",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      type: "residential",
      tokens: 250,
      totalTokens: 10000,
      pricePerToken: 125.50,
      value: 31375,
      purchaseValue: 28000,
      returns: 12.05,
      returnsAmount: 3375,
      dividends: 1250,
      lastDividend: "Dec 2024",
      yieldRate: 8.2
    },
    {
      id: 2,
      name: "Tech Hub Office Complex",
      location: "Austin, TX",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      type: "commercial",
      tokens: 180,
      totalTokens: 8000,
      pricePerToken: 89.75,
      value: 16155,
      purchaseValue: 15500,
      returns: 4.23,
      returnsAmount: 655,
      dividends: 890,
      lastDividend: "Nov 2024",
      yieldRate: 6.8
    },
    {
      id: 3,
      name: "Suburban Family Homes",
      location: "Phoenix, AZ",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      type: "residential",
      tokens: 320,
      totalTokens: 12000,
      pricePerToken: 67.25,
      value: 21520,
      purchaseValue: 19800,
      returns: 8.69,
      returnsAmount: 1720,
      dividends: 1580,
      lastDividend: "Dec 2024",
      yieldRate: 9.1
    },
    {
      id: 4,
      name: "Industrial Warehouse District",
      location: "Denver, CO",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      type: "industrial",
      tokens: 150,
      totalTokens: 6000,
      pricePerToken: 112.80,
      value: 16920,
      purchaseValue: 17500,
      returns: -3.31,
      returnsAmount: -580,
      dividends: 720,
      lastDividend: "Oct 2024",
      yieldRate: 5.2
    }
  ];

  // Mock performance data
  const performanceData = [
    { date: '2024-01-01', value: 65000 },
    { date: '2024-02-01', value: 67200 },
    { date: '2024-03-01', value: 71500 },
    { date: '2024-04-01', value: 69800 },
    { date: '2024-05-01', value: 73200 },
    { date: '2024-06-01', value: 76500 },
    { date: '2024-07-01', value: 78900 },
    { date: '2024-08-01', value: 81200 },
    { date: '2024-09-01', value: 83500 },
    { date: '2024-10-01', value: 82100 },
    { date: '2024-11-01', value: 84800 },
    { date: '2024-12-01', value: 85970 }
  ];

  // Mock dividend data
  const dividendData = [
    {
      id: 1,
      propertyId: 1,
      propertyName: "Luxury Downtown Apartments",
      propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      location: "Manhattan, NY",
      amount: 425.50,
      date: "2024-12-15",
      status: "paid",
      tokens: 250,
      yieldRate: 8.2
    },
    {
      id: 2,
      propertyId: 3,
      propertyName: "Suburban Family Homes",
      propertyImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      location: "Phoenix, AZ",
      amount: 380.75,
      date: "2024-12-10",
      status: "paid",
      tokens: 320,
      yieldRate: 9.1
    },
    {
      id: 3,
      propertyId: 2,
      propertyName: "Tech Hub Office Complex",
      propertyImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      location: "Austin, TX",
      amount: 295.20,
      date: "2024-11-28",
      status: "paid",
      tokens: 180,
      yieldRate: 6.8
    },
    {
      id: 4,
      propertyId: 1,
      propertyName: "Luxury Downtown Apartments",
      propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      location: "Manhattan, NY",
      amount: 445.80,
      date: "2025-01-15",
      status: "upcoming",
      tokens: 250,
      yieldRate: 8.2
    },
    {
      id: 5,
      propertyId: 4,
      propertyName: "Industrial Warehouse District",
      propertyImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      location: "Denver, CO",
      amount: 185.40,
      date: "2024-10-20",
      status: "paid",
      tokens: 150,
      yieldRate: 5.2
    }
  ];

  const totalValue = portfolioData?.reduce((sum, holding) => sum + holding?.value, 0);
  const totalPurchaseValue = portfolioData?.reduce((sum, holding) => sum + holding?.purchaseValue, 0);
  const totalReturns = totalValue - totalPurchaseValue;
  const returnPercentage = (totalReturns / totalPurchaseValue) * 100;
  const totalDividends = portfolioData?.reduce((sum, holding) => sum + holding?.dividends, 0);
  const monthlyDividends = totalDividends;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'holdings', label: 'Holdings', icon: 'Building2' },
    { id: 'performance', label: 'Performance', icon: 'TrendingUp' },
    { id: 'dividends', label: 'Dividends', icon: 'Coins' }
  ];

  const handleSellTokens = (holdingId) => {
    const holding = portfolioData?.find(h => h?.id === holdingId);
    setSelectedHolding(holding);
    setShowSellModal(true);
  };

  const handleViewDetails = (holdingId) => {
    navigate('/asset-details', { state: { assetId: holdingId } });
  };

  const handleRebalance = (rebalanceData) => {
    console.log('Rebalancing portfolio:', rebalanceData);
    // Handle rebalancing logic
  };

  const handleSellComplete = (sellData) => {
    console.log('Tokens sold:', sellData);
    // Handle sell completion logic
  };

  useEffect(() => {
    document.title = 'Portfolio Management - FractionalAsset';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Portfolio Management</h1>
              <p className="text-muted-foreground">
                Track your investments, analyze performance, and optimize your real estate portfolio
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <WalletConnection />
              <Button
                variant="default"
                onClick={() => setShowRebalanceModal(true)}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Rebalance
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/asset-browser')}
                iconName="Plus"
                iconPosition="left"
              >
                Add Investment
              </Button>
              <UserProfile />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Portfolio Overview - Always visible */}
        <PortfolioOverview
          portfolioData={portfolioData}
          totalValue={totalValue}
          totalReturns={totalReturns}
          returnPercentage={returnPercentage}
        />

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <PerformanceChart performanceData={performanceData} />
              <DividendTracker
                dividendData={dividendData?.slice(0, 3)}
                totalDividends={totalDividends}
                monthlyDividends={monthlyDividends}
              />
            </div>
          )}

          {activeTab === 'holdings' && (
            <HoldingsTable
              holdings={portfolioData}
              onSellTokens={handleSellTokens}
              onViewDetails={handleViewDetails}
            />
          )}

          {activeTab === 'performance' && (
            <PerformanceChart performanceData={performanceData} />
          )}

          {activeTab === 'dividends' && (
            <DividendTracker
              dividendData={dividendData}
              totalDividends={totalDividends}
              monthlyDividends={monthlyDividends}
            />
          )}
        </div>

        {/* Quick Actions - Mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <div className="flex flex-col space-y-3">
            <Button
              variant="default"
              size="icon"
              onClick={() => setShowRebalanceModal(true)}
              className="w-14 h-14 rounded-full shadow-elevation-3"
            >
              <Icon name="RefreshCw" size={24} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/asset-browser')}
              className="w-14 h-14 rounded-full shadow-elevation-3 bg-card"
            >
              <Icon name="Plus" size={24} />
            </Button>
          </div>
        </div>
      </div>
      {/* Modals */}
      <RebalanceModal
        isOpen={showRebalanceModal}
        onClose={() => setShowRebalanceModal(false)}
        holdings={portfolioData}
        onRebalance={handleRebalance}
      />
      <SellTokensModal
        isOpen={showSellModal}
        onClose={() => setShowSellModal(false)}
        holding={selectedHolding}
        onSellTokens={handleSellComplete}
      />
    </div>
  );
};

export default PortfolioManagement;