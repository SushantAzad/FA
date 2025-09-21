import React from 'react';

const PropertySkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-muted" />
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <div className="h-5 bg-muted rounded mb-2 w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="h-3 bg-muted rounded mb-1 w-16" />
            <div className="h-4 bg-muted rounded w-20" />
          </div>
          <div>
            <div className="h-3 bg-muted rounded mb-1 w-20" />
            <div className="h-4 bg-muted rounded w-16" />
          </div>
          <div>
            <div className="h-3 bg-muted rounded mb-1 w-18" />
            <div className="h-4 bg-muted rounded w-20" />
          </div>
          <div>
            <div className="h-3 bg-muted rounded mb-1 w-16" />
            <div className="h-4 bg-muted rounded w-12" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <div className="h-3 bg-muted rounded w-12" />
            <div className="h-3 bg-muted rounded w-8" />
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-1" />
          <div className="h-3 bg-muted rounded w-32" />
        </div>

        {/* Buttons */}
        <div className="flex space-x-2 mb-3">
          <div className="h-8 bg-muted rounded flex-1" />
          <div className="h-8 bg-muted rounded flex-1" />
        </div>

        {/* Footer Info */}
        <div className="flex justify-between pt-3 border-t border-border">
          <div className="h-3 bg-muted rounded w-20" />
          <div className="h-3 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export default PropertySkeleton;