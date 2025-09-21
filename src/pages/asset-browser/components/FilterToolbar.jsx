import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ onFiltersChange, totalResults, isMapView, onToggleMapView }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000000],
    location: '',
    propertyType: '',
    returnRate: [0, 20],
    riskLevel: '',
    minInvestment: [0, 100000],
    timeline: '',
    searchQuery: ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'new-york', label: 'New York, NY' },
    { value: 'los-angeles', label: 'Los Angeles, CA' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'miami', label: 'Miami, FL' },
    { value: 'austin', label: 'Austin, TX' },
    { value: 'seattle', label: 'Seattle, WA' },
    { value: 'denver', label: 'Denver, CO' },
    { value: 'atlanta', label: 'Atlanta, GA' }
  ];

  const propertyTypeOptions = [
    { value: '', label: 'All Property Types' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'retail', label: 'Retail' },
    { value: 'office', label: 'Office' },
    { value: 'mixed-use', label: 'Mixed Use' }
  ];

  const riskLevelOptions = [
    { value: '', label: 'All Risk Levels' },
    { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high', label: 'High Risk' }
  ];

  const timelineOptions = [
    { value: '', label: 'All Timelines' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'return-high', label: 'Highest Returns' },
    { value: 'return-low', label: 'Lowest Returns' },
    { value: 'newest', label: 'Newest First' },
    { value: 'ending-soon', label: 'Ending Soon' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...filters?.priceRange];
    newRange[index] = parseInt(value) || 0;
    handleFilterChange('priceRange', newRange);
  };

  const handleReturnRateChange = (index, value) => {
    const newRange = [...filters?.returnRate];
    newRange[index] = parseInt(value) || 0;
    handleFilterChange('returnRate', newRange);
  };

  const handleMinInvestmentChange = (index, value) => {
    const newRange = [...filters?.minInvestment];
    newRange[index] = parseInt(value) || 0;
    handleFilterChange('minInvestment', newRange);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priceRange: [0, 1000000],
      location: '',
      propertyType: '',
      returnRate: [0, 20],
      riskLevel: '',
      minInvestment: [0, 100000],
      timeline: '',
      searchQuery: ''
    };
    setFilters(clearedFilters);
    setSortBy('popularity');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.location) count++;
    if (filters?.propertyType) count++;
    if (filters?.riskLevel) count++;
    if (filters?.timeline) count++;
    if (filters?.searchQuery) count++;
    if (filters?.priceRange?.[0] > 0 || filters?.priceRange?.[1] < 1000000) count++;
    if (filters?.returnRate?.[0] > 0 || filters?.returnRate?.[1] < 20) count++;
    if (filters?.minInvestment?.[0] > 0 || filters?.minInvestment?.[1] < 100000) count++;
    return count;
  };

  useEffect(() => {
    onFiltersChange?.({ ...filters, sortBy });
  }, [filters, sortBy, onFiltersChange]);

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search properties by name, location, or type..."
            value={filters?.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isMapView ? 'default' : 'outline'}
            size="sm"
            iconName="Map"
            iconPosition="left"
            onClick={onToggleMapView}
          >
            Map View
          </Button>
          <Button
            variant={!isMapView ? 'default' : 'outline'}
            size="sm"
            iconName="Grid3X3"
            iconPosition="left"
            onClick={onToggleMapView}
          >
            Grid View
          </Button>
        </div>
      </div>
      {/* Basic Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Location"
          options={locationOptions}
          value={filters?.location}
          onChange={(value) => handleFilterChange('location', value)}
          searchable
        />
        
        <Select
          label="Property Type"
          options={propertyTypeOptions}
          value={filters?.propertyType}
          onChange={(value) => handleFilterChange('propertyType', value)}
        />
        
        <Select
          label="Risk Level"
          options={riskLevelOptions}
          value={filters?.riskLevel}
          onChange={(value) => handleFilterChange('riskLevel', value)}
        />
        
        <Select
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
        />
      </div>
      {/* Price Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Price Range
          </label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters?.priceRange?.[0]}
              onChange={(e) => handlePriceRangeChange(0, e?.target?.value)}
              className="flex-1"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters?.priceRange?.[1]}
              onChange={(e) => handlePriceRangeChange(1, e?.target?.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Expected Return (%)
          </label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters?.returnRate?.[0]}
              onChange={(e) => handleReturnRateChange(0, e?.target?.value)}
              className="flex-1"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters?.returnRate?.[1]}
              onChange={(e) => handleReturnRateChange(1, e?.target?.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          iconName={showAdvancedFilters ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="left"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          Advanced Filters
        </Button>
        
        <div className="flex items-center space-x-4">
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={clearAllFilters}
            >
              Clear All ({getActiveFilterCount()})
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {totalResults?.toLocaleString()} properties found
          </span>
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Minimum Investment Range
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters?.minInvestment?.[0]}
                  onChange={(e) => handleMinInvestmentChange(0, e?.target?.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters?.minInvestment?.[1]}
                  onChange={(e) => handleMinInvestmentChange(1, e?.target?.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <Select
              label="Investment Timeline"
              options={timelineOptions}
              value={filters?.timeline}
              onChange={(value) => handleFilterChange('timeline', value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;