import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapView = ({ properties, onPropertySelect, selectedProperty }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // New York default
  const [zoom, setZoom] = useState(10);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);

  // Mock map data - in real implementation, this would use Google Maps API
  const mapProperties = properties?.map((property, index) => ({
    ...property,
    coordinates: {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.0060 + (Math.random() - 0.5) * 0.1
    }
  }));

  const handlePropertyClick = (property) => {
    onPropertySelect?.(property);
    setShowPropertyDetails(true);
    setMapCenter(property?.coordinates);
  };

  const closePropertyDetails = () => {
    setShowPropertyDetails(false);
    onPropertySelect?.(null);
  };

  const zoomIn = () => {
    setZoom(Math.min(zoom + 1, 18));
  };

  const zoomOut = () => {
    setZoom(Math.max(zoom - 1, 1));
  };

  const resetView = () => {
    setMapCenter({ lat: 40.7128, lng: -74.0060 });
    setZoom(10);
  };

  return (
    <div className="relative h-[600px] bg-muted rounded-lg overflow-hidden">
      {/* Map Container */}
      <div className="w-full h-full relative">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Property Locations Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoom}&output=embed`}
          className="border-0"
        />

        {/* Map Overlay with Property Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {mapProperties?.map((property, index) => (
            <div
              key={property?.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${50 + (property?.coordinates?.lng + 74.0060) * 1000}%`,
                top: `${50 - (property?.coordinates?.lat - 40.7128) * 1000}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <button
                onClick={() => handlePropertyClick(property)}
                className={`w-8 h-8 rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:scale-110 ${
                  selectedProperty?.id === property?.id
                    ? 'bg-primary border-primary-foreground'
                    : 'bg-card hover:bg-primary/10'
                }`}
              >
                <Icon 
                  name="MapPin" 
                  size={16} 
                  className={selectedProperty?.id === property?.id ? 'text-white' : 'text-primary'} 
                />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          variant="outline"
          size="icon"
          onClick={zoomIn}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Icon name="Plus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={zoomOut}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Icon name="Minus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetView}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Icon name="Home" size={16} />
        </Button>
      </div>
      {/* Property Count Badge */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
        <div className="flex items-center space-x-2">
          <Icon name="MapPin" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {properties?.length} Properties
          </span>
        </div>
      </div>
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
        <div className="text-xs font-medium text-foreground mb-2">Property Status</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-xs text-muted-foreground">Limited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full" />
            <span className="text-xs text-muted-foreground">Sold Out</span>
          </div>
        </div>
      </div>
      {/* Property Details Popup */}
      {showPropertyDetails && selectedProperty && (
        <div className="absolute bottom-4 right-4 w-80 bg-card border border-border rounded-lg shadow-elevation-3 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground mb-1">
                {selectedProperty?.title}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="MapPin" size={14} className="mr-1" />
                <span>{selectedProperty?.location}</span>
              </div>
            </div>
            <button
              onClick={closePropertyDetails}
              className="p-1 hover:bg-muted rounded transition-colors duration-200"
            >
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-xs text-muted-foreground">Token Price</div>
              <div className="text-sm font-semibold text-card-foreground">
                ${selectedProperty?.tokenPrice?.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Expected Return</div>
              <div className="text-sm font-semibold text-success">
                {selectedProperty?.expectedReturn}%
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            <Button variant="default" size="sm" className="flex-1">
              Invest Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;