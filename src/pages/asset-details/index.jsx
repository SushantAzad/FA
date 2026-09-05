import { api } from '../../lib/api';
import { demoProperties, propertyDetails } from '../../lib/properties';
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
  const [investmentError, setInvestmentError] = useState('');
  const [activeTab, setActiveTab] = useState("overview");
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "overview", label: "Overview", icon: "Home" },
    { id: "financials", label: "Financials", icon: "BarChart3" },
    { id: "location", label: "Location", icon: "MapPin" },
    { id: "documents", label: "Documents", icon: "FileText" },
    { id: "comparables", label: "Comparables", icon: "TrendingUp" },
  ];

  useEffect(() => {
    let cancelled = false;
    const id = searchParams.get('id');
    setLoading(true);
    setProperty(null);
    const demo = demoProperties.find(p => String(p.id) === id);
    const request = demo ? Promise.resolve(demo) : api('/properties/' + encodeURIComponent(id || ''));
    request.then(p => { if (!cancelled) setProperty(propertyDetails(p)); })
      .catch(() => { if (!cancelled) setProperty(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [searchParams]);

  const handleInvestment = (investmentData) => {
    console.log("Investment data:", investmentData);
    // In real app, this would process the investment
    setInvestmentError("Payment processing is not configured. No investment or charge was made.");
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
        {investmentError && <p role="alert" className="mb-4 text-error">{investmentError}</p>}
        <p className="mb-4 text-sm text-muted-foreground">Prototype: financial projections, documents and nearby amenities are sample data, not verified property information.</p>
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
                    <span className="text-xs font-medium">{property.status}</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-full">
                    <Icon name="Zap" size={12} />
                    <span className="text-xs font-medium">Prototype</span>
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
