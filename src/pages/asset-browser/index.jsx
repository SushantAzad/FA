import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import NavigationBar from '../../components/ui/NavigationBar';
import FilterToolbar from './components/FilterToolbar';
import PropertyGrid from './components/PropertyGrid';
import MapView from './components/MapView';
import QuickInvestModal from './components/QuickInvestModal';



const AssetBrowser = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isMapView, setIsMapView] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showQuickInvestModal, setShowQuickInvestModal] = useState(false);
  const [quickInvestProperty, setQuickInvestProperty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Mock properties data
  const mockProperties = [
    {
      id: 1,
      title: "Luxury Downtown Apartment Complex",
      location: "Manhattan, New York, NY",
      type: "Residential",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      tokenPrice: 1000,
      expectedReturn: 8.5,
      minInvestment: 1000,
      riskLevel: "Medium",
      status: "Available",
      fundedPercentage: 65,
      raisedAmount: 1300000,
      targetAmount: 2000000,
      investors: 234,
      timeLeft: "45 days",
      totalTokens: 2000,
      isFavorited: false
    },
    {
      id: 2,
      title: "Modern Office Building",
      location: "Downtown Los Angeles, CA",
      type: "Commercial",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      tokenPrice: 2500,
      expectedReturn: 12.3,
      minInvestment: 2500,
      riskLevel: "High",
      status: "Limited",
      fundedPercentage: 89,
      raisedAmount: 4450000,
      targetAmount: 5000000,
      investors: 156,
      timeLeft: "12 days",
      totalTokens: 2000,
      isFavorited: true
    },
    {
      id: 3,
      title: "Suburban Shopping Center",
      location: "Austin, Texas, TX",
      type: "Retail",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      tokenPrice: 500,
      expectedReturn: 6.8,
      minInvestment: 500,
      riskLevel: "Low",
      status: "Available",
      fundedPercentage: 42,
      raisedAmount: 630000,
      targetAmount: 1500000,
      investors: 89,
      timeLeft: "67 days",
      totalTokens: 3000,
      isFavorited: false
    },
    {
      id: 4,
      title: "Industrial Warehouse Complex",
      location: "Chicago, Illinois, IL",
      type: "Industrial",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      tokenPrice: 1500,
      expectedReturn: 9.2,
      minInvestment: 1500,
      riskLevel: "Medium",
      status: "Available",
      fundedPercentage: 73,
      raisedAmount: 2190000,
      targetAmount: 3000000,
      investors: 167,
      timeLeft: "28 days",
      totalTokens: 2000,
      isFavorited: false
    },
    {
      id: 5,
      title: "Beachfront Resort Property",
      location: "Miami Beach, Florida, FL",
      type: "Mixed Use",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      tokenPrice: 5000,
      expectedReturn: 15.7,
      minInvestment: 5000,
      riskLevel: "High",
      status: "Available",
      fundedPercentage: 34,
      raisedAmount: 1700000,
      targetAmount: 5000000,
      investors: 78,
      timeLeft: "89 days",
      totalTokens: 1000,
      isFavorited: true
    },
    {
      id: 6,
      title: "Tech Campus Office Park",
      location: "Seattle, Washington, WA",
      type: "Office",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
      tokenPrice: 3000,
      expectedReturn: 11.4,
      minInvestment: 3000,
      riskLevel: "Medium",
      status: "Available",
      fundedPercentage: 56,
      raisedAmount: 2240000,
      targetAmount: 4000000,
      investors: 134,
      timeLeft: "52 days",
      totalTokens: 1333,
      isFavorited: false
    },
    {
      id: 7,
      title: "Historic Renovation Project",
      location: "Denver, Colorado, CO",
      type: "Mixed Use",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      tokenPrice: 750,
      expectedReturn: 7.9,
      minInvestment: 750,
      riskLevel: "Medium",
      status: "Sold Out",
      fundedPercentage: 100,
      raisedAmount: 1500000,
      targetAmount: 1500000,
      investors: 298,
      timeLeft: "Completed",
      totalTokens: 2000,
      isFavorited: false
    },
    {
      id: 8,
      title: "Student Housing Complex",
      location: "Atlanta, Georgia, GA",
      type: "Residential",
      image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&h=300&fit=crop",
      tokenPrice: 800,
      expectedReturn: 8.8,
      minInvestment: 800,
      riskLevel: "Low",
      status: "Available",
      fundedPercentage: 78,
      raisedAmount: 1560000,
      targetAmount: 2000000,
      investors: 203,
      timeLeft: "33 days",
      totalTokens: 2500,
      isFavorited: false
    }
  ];

  // Initialize data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setTotalResults(mockProperties?.length);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const handleFiltersChange = (filters) => {
    setLoading(true);
    
    // Simulate filtering delay
    setTimeout(() => {
      let filtered = [...mockProperties];

      // Apply search filter
      if (filters?.searchQuery) {
        const query = filters?.searchQuery?.toLowerCase();
        filtered = filtered?.filter(property =>
          property?.title?.toLowerCase()?.includes(query) ||
          property?.location?.toLowerCase()?.includes(query) ||
          property?.type?.toLowerCase()?.includes(query)
        );
      }

      // Apply location filter
      if (filters?.location) {
        filtered = filtered?.filter(property =>
          property?.location?.toLowerCase()?.includes(filters?.location?.toLowerCase())
        );
      }

      // Apply property type filter
      if (filters?.propertyType) {
        filtered = filtered?.filter(property =>
          property?.type?.toLowerCase() === filters?.propertyType?.toLowerCase()
        );
      }

      // Apply risk level filter
      if (filters?.riskLevel) {
        filtered = filtered?.filter(property =>
          property?.riskLevel?.toLowerCase() === filters?.riskLevel?.toLowerCase()
        );
      }

      // Apply price range filter
      if (filters?.priceRange?.[0] > 0 || filters?.priceRange?.[1] < 1000000) {
        filtered = filtered?.filter(property =>
          property?.tokenPrice >= filters?.priceRange?.[0] &&
          property?.tokenPrice <= filters?.priceRange?.[1]
        );
      }

      // Apply return rate filter
      if (filters?.returnRate?.[0] > 0 || filters?.returnRate?.[1] < 20) {
        filtered = filtered?.filter(property =>
          property?.expectedReturn >= filters?.returnRate?.[0] &&
          property?.expectedReturn <= filters?.returnRate?.[1]
        );
      }

      // Apply minimum investment filter
      if (filters?.minInvestment?.[0] > 0 || filters?.minInvestment?.[1] < 100000) {
        filtered = filtered?.filter(property =>
          property?.minInvestment >= filters?.minInvestment?.[0] &&
          property?.minInvestment <= filters?.minInvestment?.[1]
        );
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'price-low':
          filtered?.sort((a, b) => a?.tokenPrice - b?.tokenPrice);
          break;
        case 'price-high':
          filtered?.sort((a, b) => b?.tokenPrice - a?.tokenPrice);
          break;
        case 'return-high':
          filtered?.sort((a, b) => b?.expectedReturn - a?.expectedReturn);
          break;
        case 'return-low':
          filtered?.sort((a, b) => a?.expectedReturn - b?.expectedReturn);
          break;
        case 'ending-soon':
          filtered?.sort((a, b) => {
            const aTime = parseInt(a?.timeLeft) || 999;
            const bTime = parseInt(b?.timeLeft) || 999;
            return aTime - bTime;
          });
          break;
        case 'newest':
          filtered?.sort((a, b) => b?.id - a?.id);
          break;
        default: // popularity
          filtered?.sort((a, b) => b?.investors - a?.investors);
      }

      setFilteredProperties(filtered);
      setTotalResults(filtered?.length);
      setLoading(false);
    }, 500);
  };

  const handleLoadMore = async () => {
    // Simulate loading more data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, this would fetch more data
    // For now, we'll just simulate that there's no more data
    setHasMore(false);
  };

  const handleFavorite = (propertyId, isFavorited) => {
    setProperties(prev => prev?.map(property =>
      property?.id === propertyId
        ? { ...property, isFavorited }
        : property
    ));
    
    setFilteredProperties(prev => prev?.map(property =>
      property?.id === propertyId
        ? { ...property, isFavorited }
        : property
    ));
  };

  const handleQuickInvest = (property) => {
    setQuickInvestProperty(property);
    setShowQuickInvestModal(true);
  };

  const handleInvestmentConfirm = (investmentData) => {
    console.log('Investment confirmed:', investmentData);
    setShowQuickInvestModal(false);
    setQuickInvestProperty(null);
    // In real implementation, this would process the investment
  };

  const toggleMapView = () => {
    setIsMapView(!isMapView);
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  return (
    <>
      <Helmet>
        <title>Asset Browser - FractionalAsset</title>
        <meta name="description" content="Discover and invest in fractional real estate opportunities. Browse properties, compare returns, and start building your real estate portfolio today." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <NavigationBar />
        
        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Asset Browser
                </h1>
                <p className="text-muted-foreground">
                  Discover and invest in premium real estate opportunities through fractional ownership
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {totalResults}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Properties
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    $2.4B
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Value
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    9.2%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg Return
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="lg:hidden grid grid-cols-3 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">
                  {totalResults}
                </div>
                <div className="text-xs text-muted-foreground">
                  Properties
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-success">
                  $2.4B
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Value
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-accent">
                  9.2%
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg Return
                </div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <FilterToolbar
            onFiltersChange={handleFiltersChange}
            totalResults={totalResults}
            isMapView={isMapView}
            onToggleMapView={toggleMapView}
          />

          {/* Content Area */}
          {isMapView ? (
            <MapView
              properties={filteredProperties}
              onPropertySelect={handlePropertySelect}
              selectedProperty={selectedProperty}
            />
          ) : (
            <PropertyGrid
              properties={filteredProperties}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              onFavorite={handleFavorite}
              onQuickInvest={handleQuickInvest}
              totalResults={totalResults}
            />
          )}

          {/* Quick Invest Modal */}
          <QuickInvestModal
            property={quickInvestProperty}
            isOpen={showQuickInvestModal}
            onClose={() => {
              setShowQuickInvestModal(false);
              setQuickInvestProperty(null);
            }}
            onConfirm={handleInvestmentConfirm}
          />
        </main>
      </div>
    </>
  );
};

export default AssetBrowser;