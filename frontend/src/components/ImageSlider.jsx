// src/components/ImageSlider.jsx
import React, { useState } from 'react';

const ImageSlider = ({ screenshots = [], defaultImage, alt }) => {
  // Use first 5-6 screenshots from RAWG
  const images = screenshots.length > 0 
    ? screenshots.slice(0, 5) 
    : [{ id: -1, image: defaultImage }];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div 
      className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-zinc-800 select-none"
      onMouseLeave={() => setCurrentIndex(0)} // Reset to cover image when mouse leaves
    >
      {/* Current Screenshot */}
      <img
        src={images[currentIndex]?.image || defaultImage}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover transition-opacity duration-150"
      />

      {/* Invisible Hover Zones across the image */}
      {images.length > 1 && (
        <div className="absolute inset-0 flex z-10">
          {images.map((_, index) => (
            <div
              key={index}
              onMouseEnter={() => setCurrentIndex(index)}
              className="flex-1 h-full cursor-pointer"
            />
          ))}
        </div>
      )}

      {/* Segmented Dash Indicators (visible on card hover) */}
      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 px-4 flex gap-1.5 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-0.75 flex-1 rounded-full transition-all duration-150 ${
                index === currentIndex 
                  ? 'bg-white shadow-sm' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
