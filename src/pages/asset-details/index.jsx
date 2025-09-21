import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavigationBar from "../../components/ui/NavigationBar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import PropertyGallery from "./components/PropertyGallery";
import PropertySpecs from "./components/PropertySpecs";
import InvestmentMetrics from "./components/InvestmentMetrics";
import PropertyFinancials from "./components/PropertyFinancials";
import LegalDocuments from "./components/LegalDocuments";
import InvestmentPanel from "./components/InvestmentPanel";
import PropertyLocation from "./components/PropertyLocation";
import ComparableProperties from "./components/ComparableProperties";

const AssetDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock property data - in real app, this would come from API based on ID
  const mockProperty = {
    id: searchParams?.get("id") || "prop-1",
    name: "Luxury Downtown Residence",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    fullAddress: "123 Main Street, New York, NY 10001",
    neighborhood: "Financial District",
    type: "Residential Apartment",
    squareFootage: 2850,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 2019,
    tokenPrice: 100,
    expectedReturn: 8.5,
    dividendYield: 4.0,
    totalValue: 2500000,
    totalTokens: 25000,
    availableTokens: 8750,
    minimumInvestment: 1000,
    coordinates: { lat: 40.7589, lng: -73.9851 },
    images: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        caption: "Living Room",
      },
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        caption: "Kitchen",
      },
      {
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
        caption: "Bedroom",
      },
      {
        url: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
        caption: "Bathroom",
      },
      {
        url: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop",
        caption: "Building Exterior",
      },
    ],
    amenities: [
      "Concierge Service",
      "Fitness Center",
      "Rooftop Terrace",
      "In-unit Laundry",
      "Parking Garage",
      "Pet Friendly",
      "Doorman",
      "Pool",
    ],
    description: `Experience luxury living in this stunning 3-bedroom, 2-bathroom residence located in the heart of Manhattan's Financial District. This modern apartment features floor-to-ceiling windows, premium finishes, and breathtaking city views.\n\nThe open-concept living space seamlessly blends the living, dining, and kitchen areas, creating an ideal environment for both relaxation and entertainment. The gourmet kitchen boasts high-end stainless steel appliances, quartz countertops, and custom cabinetry.\n\nBuilding amenities include 24/7 concierge service, state-of-the-art fitness center, rooftop terrace with panoramic city views, and a residents' lounge. The prime location offers easy access to world-class dining, shopping, and transportation.`,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "Home" },
    { id: "financials", label: "Financials", icon: "BarChart3" },
    { id: "location", label: "Location", icon: "MapPin" },
    { id: "documents", label: "Documents", icon: "FileText" },
    { id: "comparables", label: "Comparables", icon: "TrendingUp" },
  ];

  useEffect(() => {
    // Simulate loading property data
    const loadProperty = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProperty(mockProperty);
      setLoading(false);
    };

    loadProperty();
  }, [searchParams]);

  const handleInvestment = (investmentData) => {
    console.log("Investment data:", investmentData);
    // In real app, this would process the investment
    navigate("/transaction-history");
  };

  const handleBackToAssets = () => {
    navigate("/asset-browser");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Icon
              name="AlertCircle"
              size={48}
              className="text-error mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Property Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              The requested property could not be found.
            </p>
            <Button onClick={handleBackToAssets}>Back to Assets</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <button
            onClick={handleBackToAssets}
            className="hover:text-foreground transition-smooth duration-150"
          >
            Assets
          </button>
          <Icon name="ChevronRight" size={16} />
          <span className="text-foreground">{property?.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div className="bg-card rounded-lg p-6 shadow-elevation-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {property?.name}
                  </h1>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Icon name="MapPin" size={16} />
                    <span className="text-sm">{property?.fullAddress}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-full">
                    <Icon name="Shield" size={12} />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-full">
                    <Icon name="Zap" size={12} />
                    <span className="text-xs font-medium">Trending</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-muted-foreground">
                {property?.description
                  ?.split("\n\n")
                  ?.map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>

            {/* Property Gallery */}
            <PropertyGallery
              images={property?.images}
              propertyName={property?.name}
            />

            {/* Tab Navigation */}
            <div className="bg-card rounded-lg shadow-elevation-2">
              <div className="border-b border-border">
                <div className="flex overflow-x-auto">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-smooth duration-150 whitespace-nowrap ${
                        activeTab === tab?.id
                          ? "border-primary text-primary bg-primary/5"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span>{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <PropertySpecs property={property} />
                    <InvestmentMetrics property={property} />
                  </div>
                )}

                {activeTab === "financials" && (
                  <PropertyFinancials property={property} />
                )}

                {activeTab === "location" && (
                  <PropertyLocation property={property} />
                )}

                {activeTab === "documents" && (
                  <LegalDocuments property={property} />
                )}

                {activeTab === "comparables" && (
                  <ComparableProperties currentProperty={property} />
                )}
              </div>
            </div>
          </div>

          {/* Investment Panel */}
          <div className="lg:col-span-1">
            <InvestmentPanel property={property} onInvest={handleInvestment} />
          </div>
        </div>
      </div>
      {/* Mobile Investment Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-elevation-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Token Price</div>
            <div className="text-lg font-bold text-foreground">
              ${property?.tokenPrice}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Heart"
              onClick={() => console.log("Add to watchlist")}
            />
            <Button
              variant="default"
              size="sm"
              iconName="ShoppingCart"
              iconPosition="left"
              onClick={() => setActiveTab("overview")}
            >
              Invest Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;
