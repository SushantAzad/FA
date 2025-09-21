import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import PropertySkeleton from './PropertySkeleton';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PropertyGrid = ({ 
  properties, 
  loading, 
  hasMore, 
  onLoadMore, 
  onFavorite, 
  onQuickInvest,
  totalResults 
}) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await onLoadMore?.();
    setLoadingMore(false);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer?.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer?.unobserve(sentinel);
      }
    };
  }, [hasMore, loading, loadingMore]);

  if (loading && properties?.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 })?.map((_, index) => (
          <PropertySkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!loading && properties?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Properties Found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn't find any properties matching your current filters. Try adjusting your search criteria or clearing some filters.
        </p>
        <Button variant="outline" iconName="RotateCcw" iconPosition="left">
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          Showing {properties?.length} of {totalResults?.toLocaleString()} properties
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Filter" size={16} />
          <span>Filtered results</span>
        </div>
      </div>
      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties?.map((property, index) => (
          <PropertyCard
            key={`${property?.id}-${index}`}
            property={property}
            onFavorite={onFavorite}
            onQuickInvest={onQuickInvest}
          />
        ))}
        
        {/* Loading more skeletons */}
        {loadingMore && 
          Array.from({ length: 4 })?.map((_, index) => (
            <PropertySkeleton key={`loading-${index}`} />
          ))
        }
      </div>
      {/* Load More / Infinite Scroll Sentinel */}
      {hasMore && (
        <div id="scroll-sentinel" className="flex justify-center mt-8">
          {loadingMore ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Loading more properties...</span>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={handleLoadMore}
              iconName="Plus"
              iconPosition="left"
            >
              Load More Properties
            </Button>
          )}
        </div>
      )}
      {/* End of Results */}
      {!hasMore && properties?.length > 0 && (
        <div className="text-center mt-8 py-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            You've reached the end of the results
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;