import React from 'react';
import Icon from '../../../components/AppIcon';

const PropertyLocation = ({ property }) => {
  const locationDetails = {
    address: property?.fullAddress || `${property?.address}, ${property?.city}, ${property?.state} ${property?.zipCode}`,
    neighborhood: property?.neighborhood || "Downtown District",
    walkScore: property?.walkScore || 85,
    transitScore: property?.transitScore || 72,
    bikeScore: property?.bikeScore || 68,
    coordinates: property?.coordinates || { lat: 40.7128, lng: -74.0060 }
  };

  const nearbyAmenities = [
    { name: "Central Park", distance: "0.3 miles", type: "park", icon: "Trees" },
    { name: "Metro Station", distance: "0.1 miles", type: "transit", icon: "Train" },
    { name: "Whole Foods", distance: "0.2 miles", type: "grocery", icon: "ShoppingBag" },
    { name: "Starbucks", distance: "0.1 miles", type: "cafe", icon: "Coffee" },
    { name: "Chase Bank", distance: "0.2 miles", type: "bank", icon: "Building2" },
    { name: "CVS Pharmacy", distance: "0.3 miles", type: "pharmacy", icon: "Plus" }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Fair";
  };

  return (
    <div className="space-y-6">
      {/* Location Overview */}
      <div className="bg-card rounded-lg p-6 shadow-elevation-2">
        <h3 className="text-lg font-semibold text-foreground mb-4">Location</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={20} className="text-primary mt-1" />
            <div>
              <div className="text-sm font-medium text-foreground">{locationDetails?.address}</div>
              <div className="text-sm text-muted-foreground">{locationDetails?.neighborhood}</div>
            </div>
          </div>

          {/* Walkability Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Icon name="Footprints" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Walk Score</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(locationDetails?.walkScore)}`}>
                {locationDetails?.walkScore}
              </div>
              <div className="text-xs text-muted-foreground">
                {getScoreLabel(locationDetails?.walkScore)}
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Icon name="Train" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Transit Score</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(locationDetails?.transitScore)}`}>
                {locationDetails?.transitScore}
              </div>
              <div className="text-xs text-muted-foreground">
                {getScoreLabel(locationDetails?.transitScore)}
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Icon name="Bike" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Bike Score</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(locationDetails?.bikeScore)}`}>
                {locationDetails?.bikeScore}
              </div>
              <div className="text-xs text-muted-foreground">
                {getScoreLabel(locationDetails?.bikeScore)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Map */}
      <div className="bg-card rounded-lg overflow-hidden shadow-elevation-2">
        <div className="h-64 bg-muted relative">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title={property?.name}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${locationDetails?.coordinates?.lat},${locationDetails?.coordinates?.lng}&z=14&output=embed`}
            className="border-0"
          />
        </div>
      </div>
      {/* Nearby Amenities */}
      <div className="bg-card rounded-lg p-6 shadow-elevation-2">
        <h3 className="text-lg font-semibold text-foreground mb-4">Nearby Amenities</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {nearbyAmenities?.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                <Icon name={amenity?.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{amenity?.name}</div>
                <div className="text-xs text-muted-foreground">{amenity?.distance}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Neighborhood Insights */}
      <div className="bg-card rounded-lg p-6 shadow-elevation-2">
        <h3 className="text-lg font-semibold text-foreground mb-4">Neighborhood Insights</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="text-sm font-medium text-foreground">Market Trends</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Property values in {locationDetails?.neighborhood} have increased by 8.2% over the past year, 
              outperforming the city average of 6.1%. The area shows strong rental demand with low vacancy rates.
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Demographics</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Young professionals and families make up the majority of residents. Median household income 
              is 15% above city average, with high education levels and stable employment.
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Building" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">Development</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Several new commercial and residential developments are planned for the area, including 
              a new shopping center and improved public transportation connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyLocation;