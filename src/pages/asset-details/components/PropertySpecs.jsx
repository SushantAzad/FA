import React from 'react';
import Icon from '../../../components/AppIcon';

const PropertySpecs = ({ property }) => {
  const specifications = [
    {
      icon: 'Home',
      label: 'Property Type',
      value: property?.type
    },
    {
      icon: 'Ruler',
      label: 'Square Footage',
      value: `${property?.squareFootage?.toLocaleString()} sq ft`
    },
    {
      icon: 'Bed',
      label: 'Bedrooms',
      value: property?.bedrooms
    },
    {
      icon: 'Bath',
      label: 'Bathrooms',
      value: property?.bathrooms
    },
    {
      icon: 'Calendar',
      label: 'Year Built',
      value: property?.yearBuilt
    },
    {
      icon: 'MapPin',
      label: 'Location',
      value: property?.location
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-2">
      <h3 className="text-lg font-semibold text-foreground mb-4">Property Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specifications?.map((spec, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
              <Icon name={spec?.icon} size={18} className="text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{spec?.label}</div>
              <div className="text-sm font-medium text-foreground">{spec?.value}</div>
            </div>
          </div>
        ))}
      </div>
      {property?.amenities && property?.amenities?.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-foreground mb-3">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {property?.amenities?.map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySpecs;