import { api } from '../../lib/api';
import { demoProperties } from '../../lib/properties';
import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import NavigationBar from "../../components/ui/NavigationBar";
import FilterToolbar from "./components/FilterToolbar";
import PropertyGrid from "./components/PropertyGrid";
import MapView from "./components/MapView";
import QuickInvestModal from "./components/QuickInvestModal";

const AssetBrowser = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [isMapView, setIsMapView] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showQuickInvestModal, setShowQuickInvestModal] = useState(false);
  const [quickInvestProperty, setQuickInvestProperty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Mock properties data

  const [loadError, setLoadError] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // Initialize data
  useEffect(() => {
    let cancelled = false;
    api('/properties').then(data => {
      if (!cancelled) setProperties([...data, ...demoProperties]);
    }).catch(error => {
      if (!cancelled) { setLoadError(error.message); setProperties(demoProperties); }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { applyFilters(activeFilters); }, [properties, activeFilters]);

  const handleFiltersChange = useCallback((filters) => setActiveFilters(filters), []);

  const applyFilters = (filters) => {
      let filtered = [...properties];

      // Apply search filter
      if (filters?.searchQuery) {
        const query = filters?.searchQuery?.toLowerCase();
        filtered = filtered?.filter(
          (property) =>
            property?.title?.toLowerCase()?.includes(query) ||
            property?.location?.toLowerCase()?.includes(query) ||
            property?.type?.toLowerCase()?.includes(query)
        );
      }

      // Apply location filter
      if (filters?.location) {
        filtered = filtered?.filter((property) =>
          property?.location
            ?.toLowerCase()
            ?.includes(filters?.location?.toLowerCase().replaceAll('-', ' '))
        );
      }

      // Apply property type filter
      if (filters?.propertyType) {
        filtered = filtered?.filter(
          (property) =>
            property?.type?.toLowerCase() ===
            filters?.propertyType?.toLowerCase().replaceAll('-', ' ')
        );
      }

      // Apply risk level filter
      if (filters?.riskLevel) {
        filtered = filtered?.filter(
          (property) =>
            property?.riskLevel?.toLowerCase() ===
            filters?.riskLevel?.toLowerCase()
        );
      }

      // Apply price range filter
      if (filters?.priceRange?.[0] > 0 || filters?.priceRange?.[1] < 1000000) {
        filtered = filtered?.filter(
          (property) =>
            property?.tokenPrice >= filters?.priceRange?.[0] &&
            property?.tokenPrice <= filters?.priceRange?.[1]
        );
      }

      // Apply return rate filter
      if (filters?.returnRate?.[0] > 0 || filters?.returnRate?.[1] < 20) {
        filtered = filtered?.filter(
          (property) =>
            property?.expectedReturn >= filters?.returnRate?.[0] &&
            property?.expectedReturn <= filters?.returnRate?.[1]
        );
      }

      // Apply minimum investment filter
      if (
        filters?.minInvestment?.[0] > 0 ||
        filters?.minInvestment?.[1] < 100000
      ) {
        filtered = filtered?.filter(
          (property) =>
            property?.minInvestment >= filters?.minInvestment?.[0] &&
            property?.minInvestment <= filters?.minInvestment?.[1]
        );
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case "price-low":
          filtered?.sort((a, b) => a?.tokenPrice - b?.tokenPrice);
          break;
        case "price-high":
          filtered?.sort((a, b) => b?.tokenPrice - a?.tokenPrice);
          break;
        case "return-high":
          filtered?.sort((a, b) => b?.expectedReturn - a?.expectedReturn);
          break;
        case "return-low":
          filtered?.sort((a, b) => a?.expectedReturn - b?.expectedReturn);
          break;
        case "ending-soon":
          filtered?.sort((a, b) => {
            const aTime = parseInt(a?.timeLeft) || 999;
            const bTime = parseInt(b?.timeLeft) || 999;
            return aTime - bTime;
          });
          break;
        case "newest":
          filtered?.sort((a, b) => (Date.parse(b.createdAt) || Number(b.id) || 0) - (Date.parse(a.createdAt) || Number(a.id) || 0));
          break;
        default: // popularity
          filtered?.sort((a, b) => b?.investors - a?.investors);
      }

      setFilteredProperties(filtered);
      setTotalResults(filtered?.length);
  };

  const handleLoadMore = async () => {
    // Simulate loading more data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In real implementation, this would fetch more data
    // For now, we'll just simulate that there's no more data
    setHasMore(false);
  };

  const handleFavorite = (propertyId, isFavorited) => {
    setProperties((prev) =>
      prev?.map((property) =>
        property?.id === propertyId ? { ...property, isFavorited } : property
      )
    );

    setFilteredProperties((prev) =>
      prev?.map((property) =>
        property?.id === propertyId ? { ...property, isFavorited } : property
      )
    );
  };

  const handleQuickInvest = (property) => {
    setQuickInvestProperty(property);
    setShowQuickInvestModal(true);
  };

  const handleInvestmentConfirm = (investmentData) => {
    setLoadError("Payment processing is not configured. No investment or charge was made.");
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
        <meta
          name="description"
          content="Discover and invest in fractional real estate opportunities. Browse properties, compare returns, and start building your real estate portfolio today."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <NavigationBar />

        <main className="container mx-auto px-4 py-8">
          {loadError && <p role="alert" className="mb-4 text-error">{loadError} Showing demonstration listings only.</p>}
          <p className="mb-4 text-sm text-muted-foreground">Prototype: sample listings and investment screens are demonstrations. New listings await review.</p>
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Asset Browser
                </h1>
                <p className="text-muted-foreground">
                  Discover and invest in premium real estate opportunities
                  through fractional ownership
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
                    ₹{(2.4 * 1000000000 * 83).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Value
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">9.2%</div>
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
                <div className="text-xs text-muted-foreground">Properties</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-success">
                  ₹{(2.4 * 1000000000 * 83).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Value</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-accent">9.2%</div>
                <div className="text-xs text-muted-foreground">Avg Return</div>
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
