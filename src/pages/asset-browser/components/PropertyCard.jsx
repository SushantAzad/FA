import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PropertyCard = ({ property, onFavorite, onQuickInvest }) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(property?.isFavorited || false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleFavoriteClick = (e) => {
    e?.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.(property?.id, !isFavorited);
  };

  const handleQuickInvest = (e) => {
    e?.stopPropagation();
    onQuickInvest?.(property);
  };

  const handleCardClick = () => {
    navigate('/asset-details', { state: { propertyId: property?.id } });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-success/10 text-success border-success/20';
      case 'limited':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'sold out':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div 
      className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-2 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={property?.image}
          alt={property?.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            isImageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsImageLoading(false)}
        />
        
        {/* Loading skeleton */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
        >
          <Icon 
            name={isFavorited ? 'Heart' : 'Heart'} 
            size={16} 
            className={isFavorited ? 'text-error fill-current' : 'text-muted-foreground'} 
          />
        </button>

        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(property?.status)}`}>
          {property?.status}
        </div>

        {/* Property Type */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded">
          {property?.type}
        </div>
      </div>
      {/* Content Section */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-card-foreground mb-1 line-clamp-1">
            {property?.title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} className="mr-1" />
            <span className="line-clamp-1">{property?.location}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Token Price</div>
            <div className="text-sm font-semibold text-card-foreground">
              ${property?.tokenPrice?.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Expected Return</div>
            <div className="text-sm font-semibold text-success">
              {property?.expectedReturn}%
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Min Investment</div>
            <div className="text-sm font-semibold text-card-foreground">
              ${property?.minInvestment?.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Risk Level</div>
            <div className={`text-sm font-semibold ${getRiskColor(property?.riskLevel)}`}>
              {property?.riskLevel}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Funded</span>
            <span>{property?.fundedPercentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${property?.fundedPercentage}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            ${property?.raisedAmount?.toLocaleString()} of ${property?.targetAmount?.toLocaleString()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            iconName="Eye"
            iconPosition="left"
            onClick={handleCardClick}
          >
            View Details
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            iconName="Plus"
            iconPosition="left"
            onClick={handleQuickInvest}
            disabled={property?.status?.toLowerCase() === 'sold out'}
          >
            Invest
          </Button>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center text-xs text-muted-foreground">
            <Icon name="Users" size={12} className="mr-1" />
            <span>{property?.investors} investors</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Icon name="Clock" size={12} className="mr-1" />
            <span>{property?.timeLeft} left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;