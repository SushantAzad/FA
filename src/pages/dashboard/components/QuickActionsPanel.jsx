import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const QuickActionsPanel = () => {
  const [calculatorAmount, setCalculatorAmount] = useState("");
  const [calculatorResult, setCalculatorResult] = useState(null);

  const navigate = useNavigate();

  const handleBuyTokens = () => {
    navigate("/asset-browser");
  };

  const handleSellTokens = () => {
    navigate("/portfolio-management"); // Or a sell modal/route if you have one
  };

  const handleViewPortfolio = () => {
    navigate("/portfolio-management");
  };

  const handleBrowseAssets = () => {
    navigate("/asset-browser");
  };

  const trendingAssets = [
    {
      id: 1,
      name: "Manhattan Office Tower",
      symbol: "MOT",
      price: 25.5 * 83, // in INR
      change: "+5.2%",
      changeType: "positive",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Beverly Hills Retail",
      symbol: "BHR",
      price: 18.75 * 83, // in INR
      change: "+3.8%",
      changeType: "positive",
      image:
        "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Austin Tech Campus",
      symbol: "ATC",
      price: 32.1 * 83, // in INR
      change: "-1.2%",
      changeType: "negative",
      image:
        "https://images.pixabay.com/photo/2017/07/09/03/19/home-2486092_1280.jpg?w=400&h=300&fit=crop",
    },
  ];

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTokens = () => {
    if (!calculatorAmount || isNaN(calculatorAmount)) {
      setCalculatorResult(null);
      return;
    }

    const amount = parseFloat(calculatorAmount);
    const tokenPrice = 20; // Mock token price
    const tokens = (amount / tokenPrice)?.toFixed(2);

    setCalculatorResult({
      tokens,
      estimatedValue: amount,
      fees: (amount * 0.025)?.toFixed(2), // 2.5% fee
    });
  };

  const getChangeColor = (type) => {
    return type === "positive" ? "text-success" : "text-error";
  };

  const handleTrendingAssetClick = (asset) => {
    // Navigate to asset details page, passing asset id as query param
    navigate(`/asset-details?id=${asset.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="default"
            size="lg"
            iconName="Plus"
            iconPosition="left"
            fullWidth
            onClick={handleBuyTokens}
          >
            Buy Tokens
          </Button>
          <Button
            variant="outline"
            size="lg"
            iconName="Minus"
            iconPosition="left"
            fullWidth
            onClick={handleSellTokens}
          >
            Sell Tokens
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="ghost"
              size="sm"
              iconName="PieChart"
              iconPosition="left"
              fullWidth
              onClick={handleViewPortfolio}
            >
              View Portfolio
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Search"
              iconPosition="left"
              fullWidth
              onClick={handleBrowseAssets}
            >
              Browse Assets
            </Button>
          </div>
        </div>
      </div>
      {/* Token Calculator */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Token Calculator
        </h3>
        <div className="space-y-4">
          <Input
            label="Investment Amount (INR)"
            type="number"
            placeholder="Enter amount in rupees"
            value={calculatorAmount}
            onChange={(e) => {
              setCalculatorAmount(e?.target?.value);
              if (e?.target?.value) {
                calculateTokens();
              } else {
                setCalculatorResult(null);
              }
            }}
          />

          {calculatorResult && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Tokens Received:
                </span>
                <span className="text-sm font-medium text-foreground">
                  {calculatorResult?.tokens}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Platform Fee:
                </span>
                <span className="text-sm font-medium text-foreground">
                  {formatINR(calculatorResult?.fees)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-sm font-medium text-foreground">
                  Total Cost:
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formatINR(
                    parseFloat(calculatorResult?.estimatedValue) +
                      parseFloat(calculatorResult?.fees)
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Trending Assets */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Trending Assets
          </h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="ArrowRight"
            onClick={() => navigate("/asset-browser")}
          >
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {trendingAssets?.map((asset) => (
            <div
              key={asset?.id}
              className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth duration-150 cursor-pointer"
              onClick={() => handleTrendingAssetClick(asset)}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                <img
                  src={asset?.image}
                  alt={asset?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/assets/images/no_image.png";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {asset?.name}
                </p>
                <p className="text-xs text-muted-foreground">{asset?.symbol}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {formatINR(asset?.price)}
                </p>
                <p
                  className={`text-xs font-medium ${getChangeColor(
                    asset?.changeType
                  )}`}
                >
                  {asset?.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;
