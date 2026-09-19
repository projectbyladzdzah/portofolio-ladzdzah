import React, { useState, useRef, useEffect, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface ProjectBannerSliderProps {
  images: string[];
  title?: string;
  aspectRatio?: string; // e.g. 'aspect-[16/10]' or 'aspect-video'
  showThumbnails?: boolean;
  showCounter?: boolean;
  className?: string;
  onImageClick?: () => void;
  roundedClass?: string;
}

export const ProjectBannerSlider: React.FC<ProjectBannerSliderProps> = ({
  images = [],
  title = 'Project Preview',
  aspectRatio = 'aspect-[16/10]',
  showThumbnails = false,
  showCounter = true,
  className = '',
  onImageClick,
  roundedClass = 'rounded-none'
}) => {
  // Filter out any empty strings
  const validImages = images.filter(img => typeof img === 'string' && img.trim().length > 0);
  const total = validImages.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch swipe handling
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);

  // Reset index if image list changes or shrinks
  useEffect(() => {
    if (currentIndex >= total && total > 0) {
      setCurrentIndex(0);
    }
  }, [total, currentIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === total - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const delta = touchDeltaXRef.current;
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;

    // Minimum swipe threshold 40px
    if (Math.abs(delta) > 40 && total > 1) {
      e.stopPropagation();
      if (delta < 0) {
        // Swiped left -> next
        setCurrentIndex(prev => (prev === total - 1 ? 0 : prev + 1));
      } else {
        // Swiped right -> prev
        setCurrentIndex(prev => (prev === 0 ? total - 1 : prev - 1));
      }
    }
  };

  if (total === 0) {
    return (
      <div
        className={`${aspectRatio} w-full bg-[#161622] flex items-center justify-center font-f1 font-black text-xl md:text-2xl text-white/10 tracking-widest uppercase select-none ${roundedClass} ${className}`}
      >
        <span>NO PREVIEW</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col select-none ${className}`}>
      {/* Banner Container */}
      <div
        className={`relative ${aspectRatio} w-full overflow-hidden bg-[#0d0d14] ${roundedClass} group/slider`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onImageClick}
      >
        {/* Slides Track */}
        <div
          className="w-full h-full flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {validImages.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
              <img
                src={img}
                alt={`${title} - slide ${idx + 1}`}
                className="w-full h-full object-cover select-none"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Multi-image indicators & controls */}
        {total > 1 && (
          <>
            {/* Left Chevron Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/65 hover:bg-f1-red text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:scale-110 active:scale-95"
              aria-label="Foto Sebelumnya"
              title="Foto Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Right Chevron Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/65 hover:bg-f1-red text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:scale-110 active:scale-95"
              aria-label="Foto Selanjutnya"
              title="Foto Selanjutnya"
            >
              <ChevronRight size={16} />
            </button>

            {/* Photo Counter Badge (Top Right) */}
            {showCounter && (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute top-2.5 right-2.5 z-10 bg-black/75 backdrop-blur-md text-white border border-white/20 px-2 py-0.5 rounded text-[10px] font-f1 font-bold flex items-center gap-1 shadow-md"
              >
                <Images size={11} className="text-f1-red" />
                <span>{currentIndex + 1}/{total}</span>
              </div>
            )}

            {/* Dots Indicator (Bottom Center) */}
            <div
              onClick={e => e.stopPropagation()}
              className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10"
            >
              {validImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={e => handleDotClick(e, idx)}
                  aria-label={`Ke foto ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? 'w-4 h-1.5 bg-f1-red'
                      : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Row (optional, for modal) */}
      {showThumbnails && total > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={e => handleDotClick(e, idx)}
              className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? 'border-f1-red scale-105 shadow-md shadow-f1-red/30 ring-1 ring-f1-red'
                  : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {idx === currentIndex && (
                <div className="absolute inset-0 bg-f1-red/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
