import React from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ComparableProperties = ({ currentProperty }) => {
  const comparableProperties = [
    {
      id: "comp-1",
      name: "Metropolitan Heights",
      address: "456 Park Avenue, New York, NY",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      tokenPrice: 95,
      expectedReturn: 8.2,
      dividendYield: 3.8,
      totalValue: 2200000,
      squareFootage: 2800,
      bedrooms: 3,
      bathrooms: 2,
      yearBuilt: 2018,
      similarity: 92,
    },
    {
      id: "comp-2",
      name: "Urban Oasis",
      address: "789 Broadway, New York, NY",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      tokenPrice: 110,
      expectedReturn: 7.8,
      dividendYield: 4.2,
      totalValue: 2800000,
      squareFootage: 3200,
      bedrooms: 4,
      bathrooms: 3,
      yearBuilt: 2020,
      similarity: 88,
    },
    {
      id: "comp-3",
      name: "Central Plaza",
      address: "321 Fifth Avenue, New York, NY",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
      tokenPrice: 85,
      expectedReturn: 8.8,
      dividendYield: 3.5,
      totalValue: 1900000,
      squareFootage: 2400,
      bedrooms: 2,
      bathrooms: 2,
      yearBuilt: 2016,
      similarity: 85,
    },
  ];

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  const getComparisonColor = (
    currentValue,
    compValue,
    higherIsBetter = true
  ) => {
    if (currentValue === compValue) return "text-muted-foreground";

    const isHigher = currentValue > compValue;
    if (higherIsBetter) {
      return isHigher ? "text-success" : "text-error";
    } else {
      return isHigher ? "text-error" : "text-success";
    }
  };

  const getComparisonIcon = (
    currentValue,
    compValue,
    higherIsBetter = true
  ) => {
    if (currentValue === compValue) return "Minus";

    const isHigher = currentValue > compValue;
    if (higherIsBetter) {
      return isHigher ? "TrendingUp" : "TrendingDown";
    } else {
      return isHigher ? "TrendingDown" : "TrendingUp";
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Comparable Properties
        </h3>
        <Button
          variant="outline"
          size="sm"
          iconName="Filter"
          iconPosition="left"
          onClick={() => console.log("Filter comparables")}
        >
          Filter
        </Button>
      </div>
      <div className="space-y-6">
        {comparableProperties?.map((property) => (
          <div
            key={property?.id}
            className="border border-border rounded-lg overflow-hidden"
          >
            {/* Property Header */}
            <div className="flex items-center justify-between p-4 bg-muted/30">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={property?.image}
                    alt={property?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-md font-semibold text-foreground">
                    {property?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {property?.address}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Icon name="Target" size={12} className="text-primary" />
                      <span className="text-xs text-primary font-medium">
                        {property?.similarity}% match
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="ExternalLink"
                onClick={() => console.log(`View ${property?.name}`)}
              >
                View
              </Button>
            </div>

            {/* Comparison Grid */}
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Token Price */}
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Token Price
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    ₹
                    {property?.tokenPrice?.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div
                    className={`flex items-center justify-center space-x-1 text-xs ${getComparisonColor(
                      currentProperty?.tokenPrice,
                      property?.tokenPrice,
                      false
                    )}`}
                  >
                    <Icon
                      name={getComparisonIcon(
                        currentProperty?.tokenPrice,
                        property?.tokenPrice,
                        false
                      )}
                      size={12}
                    />
                    <span>
                      {currentProperty?.tokenPrice > property?.tokenPrice
                        ? "Higher"
                        : currentProperty?.tokenPrice < property?.tokenPrice
                        ? "Lower"
                        : "Same"}
                    </span>
                  </div>
                </div>

                {/* Expected Return */}
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Expected Return
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {property?.expectedReturn}%
                  </div>
                  <div
                    className={`flex items-center justify-center space-x-1 text-xs ${getComparisonColor(
                      currentProperty?.expectedReturn,
                      property?.expectedReturn,
                      true
                    )}`}
                  >
                    <Icon
                      name={getComparisonIcon(
                        currentProperty?.expectedReturn,
                        property?.expectedReturn,
                        true
                      )}
                      size={12}
                    />
                    <span>
                      {currentProperty?.expectedReturn >
                      property?.expectedReturn
                        ? "Higher"
                        : currentProperty?.expectedReturn <
                          property?.expectedReturn
                        ? "Lower"
                        : "Same"}
                    </span>
                  </div>
                </div>

                {/* Dividend Yield */}
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Dividend Yield
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {property?.dividendYield}%
                  </div>
                  <div
                    className={`flex items-center justify-center space-x-1 text-xs ${getComparisonColor(
                      currentProperty?.dividendYield,
                      property?.dividendYield,
                      true
                    )}`}
                  >
                    <Icon
                      name={getComparisonIcon(
                        currentProperty?.dividendYield,
                        property?.dividendYield,
                        true
                      )}
                      size={12}
                    />
                    <span>
                      {currentProperty?.dividendYield > property?.dividendYield
                        ? "Higher"
                        : currentProperty?.dividendYield <
                          property?.dividendYield
                        ? "Lower"
                        : "Same"}
                    </span>
                  </div>
                </div>

                {/* Total Value */}
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Total Value
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatCurrency(property?.totalValue)}
                  </div>
                  <div
                    className={`flex items-center justify-center space-x-1 text-xs ${getComparisonColor(
                      currentProperty?.totalValue,
                      property?.totalValue,
                      true
                    )}`}
                  >
                    <Icon
                      name={getComparisonIcon(
                        currentProperty?.totalValue,
                        property?.totalValue,
                        true
                      )}
                      size={12}
                    />
                    <span>
                      {currentProperty?.totalValue > property?.totalValue
                        ? "Higher"
                        : currentProperty?.totalValue < property?.totalValue
                        ? "Lower"
                        : "Same"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon
                      name="Ruler"
                      size={14}
                      className="text-muted-foreground"
                    />
                    <span className="text-muted-foreground">
                      {property?.squareFootage?.toLocaleString()} sq ft
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon
                      name="Bed"
                      size={14}
                      className="text-muted-foreground"
                    />
                    <span className="text-muted-foreground">
                      {property?.bedrooms} bed
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon
                      name="Bath"
                      size={14}
                      className="text-muted-foreground"
                    />
                    <span className="text-muted-foreground">
                      {property?.bathrooms} bath
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon
                      name="Calendar"
                      size={14}
                      className="text-muted-foreground"
                    />
                    <span className="text-muted-foreground">
                      Built {property?.yearBuilt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Market Analysis Summary */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="BarChart3" size={16} className="text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Market Analysis
            </h4>
            <p className="text-sm text-muted-foreground">
              Based on comparable properties, {currentProperty?.name} is
              competitively priced with above-average expected returns. The
              token price is{" "}
              {currentProperty?.tokenPrice > 95
                ? "slightly higher than"
                : "competitive with"}{" "}
              similar properties in the area, while offering{" "}
              {currentProperty?.expectedReturn > 8.0
                ? "superior"
                : "competitive"}{" "}
              return potential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparableProperties;
