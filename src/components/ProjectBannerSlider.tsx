import React, { useState, useRef, useEffect, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, Images, Maximize2, Scan, X } from 'lucide-react';

interface ProjectBannerSliderProps {
  images: string[];
  title?: string;
  aspectRatio?: string; // e.g. 'aspect-[16/10]' or 'h-[320px] sm:h-[460px]'
  showThumbnails?: boolean;
  showCounter?: boolean;
  showFitToggle?: boolean;
  defaultFit?: 'contain' | 'cover';
  className?: string;
  onImageClick?: () => void;
  roundedClass?: string;
  allowZoom?: boolean;
}

export const ProjectBannerSlider: React.FC<ProjectBannerSliderProps> = ({
  images = [],
  title = 'Project Preview',
  aspectRatio = 'aspect-[16/10]',
  showThumbnails = false,
  showCounter = true,
  showFitToggle = true,
  defaultFit = 'contain',
  className = '',
  onImageClick,
  roundedClass = 'rounded-none',
  allowZoom = true
}) => {
  // Filter out any empty strings
  const validImages = images.filter(img => typeof img === 'string' && img.trim().length > 0);
  const total = validImages.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>(defaultFit);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  const toggleFitMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFitMode(prev => (prev === 'contain' ? 'cover' : 'contain'));
  };

  const openLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLightboxOpen(true);
  };

  const closeLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLightboxOpen(false);
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
        className={`${aspectRatio} w-full bg-[#121218] flex items-center justify-center font-f1 font-black text-xl md:text-2xl text-white/15 tracking-widest uppercase select-none ${roundedClass} ${className}`}
      >
        <span>NO PREVIEW</span>
      </div>
    );
  }

  const currentImage = validImages[currentIndex] || validImages[0];

  return (
    <div className={`flex flex-col select-none ${className}`}>
      {/* Main Banner Container */}
      <div
        className={`relative ${aspectRatio} w-full overflow-hidden bg-[#07070b] ${roundedClass} group/slider flex items-center justify-center`}
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
            <div
              key={idx}
              className="w-full h-full flex-shrink-0 relative overflow-hidden flex items-center justify-center bg-[#08080d]"
            >
              {/* Ambient Background Glow when using contain mode (avoids empty black letterbox) */}
              {fitMode === 'contain' && (
                <div
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-110 pointer-events-none transition-all duration-500"
                  style={{ backgroundImage: `url("${img}")` }}
                />
              )}

              {/* Main Photo - Full view without cropping when fitMode is contain */}
              <img
                src={img}
                alt={`${title} - slide ${idx + 1}`}
                className={`w-full h-full select-none transition-all duration-300 relative z-0 ${
                  fitMode === 'contain'
                    ? 'object-contain max-h-full max-w-full drop-shadow-md'
                    : 'object-cover'
                }`}
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Top Floating Controls Bar */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
          {/* Fit Toggle (Contain vs Cover) */}
          {showFitToggle && (
            <button
              type="button"
              onClick={toggleFitMode}
              className="bg-black/75 hover:bg-f1-red text-white border border-white/20 px-2 py-1 rounded text-[10px] font-f1 font-bold flex items-center gap-1 shadow-md backdrop-blur-md transition-all active:scale-95"
              title={fitMode === 'contain' ? 'Ubah ke Tampilan Penuh (Cover)' : 'Ubah ke Tampilan Utuh Tanpa Crop (Fit)'}
            >
              <Scan size={11} className={fitMode === 'contain' ? 'text-f1-red group-hover:text-white' : 'text-white'} />
              <span className="hidden sm:inline">
                {fitMode === 'contain' ? 'FIT UTUH' : 'COVER'}
              </span>
            </button>
          )}

          {/* Lightbox / Zoom Button */}
          {allowZoom && (
            <button
              type="button"
              onClick={openLightbox}
              className="bg-black/75 hover:bg-f1-red text-white border border-white/20 p-1 rounded text-[10px] shadow-md backdrop-blur-md transition-all active:scale-95"
              title="Perbesar / Lihat Foto Asli"
              aria-label="Lihat Layar Penuh"
            >
              <Maximize2 size={12} />
            </button>
          )}

          {/* Photo Counter Badge */}
          {showCounter && total > 1 && (
            <div
              onClick={e => e.stopPropagation()}
              className="bg-black/75 backdrop-blur-md text-white border border-white/20 px-2 py-1 rounded text-[10px] font-f1 font-bold flex items-center gap-1 shadow-md"
            >
              <Images size={11} className="text-f1-red" />
              <span>{currentIndex + 1}/{total}</span>
            </div>
          )}
        </div>

        {/* Multi-image Nav Arrows */}
        {total > 1 && (
          <>
            {/* Left Chevron Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-f1-red text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-85 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:scale-110 active:scale-95 shadow-xl"
              aria-label="Foto Sebelumnya"
              title="Foto Sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Right Chevron Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-f1-red text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-85 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:scale-110 active:scale-95 shadow-xl"
              aria-label="Foto Selanjutnya"
              title="Foto Selanjutnya"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots Indicator (Only if thumbnails are NOT shown, to avoid covering bottom of image) */}
            {!showThumbnails && (
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
            )}
          </>
        )}
      </div>

      {/* Thumbnails Row (Cleanly placed below the banner so it never covers content) */}
      {showThumbnails && total > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 px-0.5 no-scrollbar border-t border-white/5 mt-2">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={e => handleDotClick(e, idx)}
              className={`relative flex-shrink-0 w-20 sm:w-24 h-14 sm:h-16 rounded overflow-hidden border-2 bg-black/40 transition-all ${
                idx === currentIndex
                  ? 'border-f1-red scale-105 shadow-md shadow-f1-red/30 ring-1 ring-f1-red opacity-100'
                  : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
              }`}
              title={`Buka Foto ${idx + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-contain p-0.5"
              />
              <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-f1 font-bold text-white/80 px-1 rounded-xs">
                #{idx + 1}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Fullscreen Zoom Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 text-white hover:text-f1-red p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Tutup Layar Penuh"
          >
            <X size={24} />
          </button>

          {/* Lightbox Image */}
          <div
            className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center select-none"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={title}
              className="max-w-full max-h-[90vh] object-contain rounded drop-shadow-2xl"
            />
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-f1-red text-white rounded-full transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-f1-red text-white rounded-full transition"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
