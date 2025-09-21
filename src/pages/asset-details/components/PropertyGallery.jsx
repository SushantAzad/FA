import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PropertyGallery = ({ images, propertyName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images?.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images?.length) % images?.length);
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-elevation-2">
      {/* Main Image Display */}
      <div className="relative h-96 bg-muted">
        <Image
          src={images?.[currentImageIndex]?.url}
          alt={`${propertyName} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-smooth duration-150"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-smooth duration-150"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={() => setShowFullscreen(true)}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-smooth duration-150"
        >
          <Icon name="Maximize" size={18} />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
          {currentImageIndex + 1} / {images?.length}
        </div>
      </div>
      {/* Thumbnail Strip */}
      {images?.length > 1 && (
        <div className="p-4 bg-card">
          <div className="flex space-x-2 overflow-x-auto">
            {images?.map((image, index) => (
              <button
                key={index}
                onClick={() => selectImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-smooth duration-150 ${
                  index === currentImageIndex
                    ? 'border-primary' :'border-border hover:border-primary/50'
                }`}
              >
                <Image
                  src={image?.url}
                  alt={`${propertyName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-500 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full p-4">
            <Image
              src={images?.[currentImageIndex]?.url}
              alt={`${propertyName} - Fullscreen`}
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-smooth duration-150"
            >
              <Icon name="X" size={24} />
            </button>

            {images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-smooth duration-150"
                >
                  <Icon name="ChevronLeft" size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-smooth duration-150"
                >
                  <Icon name="ChevronRight" size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;