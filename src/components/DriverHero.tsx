import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Gauge, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const DriverHero: React.FC = () => {
  const { data, setActiveAwardModal } = usePortfolio();
  const { hero } = data;

  // Resolve desktop banners array (fallback safely to hero.banner or default asset)
  const banners: string[] = (hero.banners && hero.banners.length > 0)
    ? hero.banners
    : [hero.banner || 'assets/driver-f1-banner.webp'];

  // Resolve mobile banners array (fallback to dedicated mobile asset, or desktop banner)
  const mobileBanners: string[] = (hero.mobileBanners && hero.mobileBanners.length > 0)
    ? hero.mobileBanners
    : [hero.mobileBanner || 'assets/driver-f1-banner-mobile.png'];

  // Mobile Banner Slider State
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isMobilePaused, setIsMobilePaused] = useState(false);
  const [mobileTouchStartX, setMobileTouchStartX] = useState<number | null>(null);
  const [mobileTouchDeltaX, setMobileTouchDeltaX] = useState(0);
  const [isMobileDragging, setIsMobileDragging] = useState(false);
  const [mobileDragStartX, setMobileDragStartX] = useState(0);
  const [mobileDragDeltaX, setMobileDragDeltaX] = useState(0);

  // Desktop Banner Slider State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const minSwipeDistance = 40;

  // Keep mobileIndex within bounds if mobileBanners list changes
  useEffect(() => {
    if (mobileIndex >= mobileBanners.length) {
      setMobileIndex(0);
    }
  }, [mobileBanners.length, mobileIndex]);

  const prevMobileSlide = useCallback(() => {
    setMobileIndex((prev) => (prev === 0 ? mobileBanners.length - 1 : prev - 1));
  }, [mobileBanners.length]);

  const nextMobileSlide = useCallback(() => {
    setMobileIndex((prev) => (prev === mobileBanners.length - 1 ? 0 : prev + 1));
  }, [mobileBanners.length]);

  const goToMobileSlide = (idx: number) => {
    setMobileIndex(idx);
  };

  // Mobile Autoplay (5.5 seconds per slide, pauses on touch/drag)
  useEffect(() => {
    if (mobileBanners.length <= 1 || isMobilePaused || isMobileDragging || mobileTouchStartX !== null) return;
    const timer = setInterval(() => {
      nextMobileSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [mobileBanners.length, isMobilePaused, isMobileDragging, mobileTouchStartX, nextMobileSlide]);

  // Mobile Touch Swipe Handlers
  const handleMobileTouchStart = (e: React.TouchEvent) => {
    if (mobileBanners.length <= 1) return;
    setMobileTouchStartX(e.targetTouches[0].clientX);
    setMobileTouchDeltaX(0);
  };

  const handleMobileTouchMove = (e: React.TouchEvent) => {
    if (mobileTouchStartX === null || mobileBanners.length <= 1) return;
    const currentX = e.targetTouches[0].clientX;
    setMobileTouchDeltaX(currentX - mobileTouchStartX);
  };

  const handleMobileTouchEnd = () => {
    if (mobileTouchStartX === null) return;
    if (mobileTouchDeltaX < -minSwipeDistance) {
      nextMobileSlide();
    } else if (mobileTouchDeltaX > minSwipeDistance) {
      prevMobileSlide();
    }
    setMobileTouchStartX(null);
    setMobileTouchDeltaX(0);
  };

  // Mobile Mouse Handlers (for DevTools mobile device emulation)
  const handleMobileMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || mobileBanners.length <= 1) return;
    setIsMobileDragging(true);
    setMobileDragStartX(e.clientX);
    setMobileDragDeltaX(0);
  };

  const handleMobileMouseMove = (e: React.MouseEvent) => {
    if (!isMobileDragging) return;
    setMobileDragDeltaX(e.clientX - mobileDragStartX);
  };

  const handleMobileMouseUp = () => {
    if (!isMobileDragging) return;
    if (mobileDragDeltaX < -minSwipeDistance) {
      nextMobileSlide();
    } else if (mobileDragDeltaX > minSwipeDistance) {
      prevMobileSlide();
    }
    setIsMobileDragging(false);
    setMobileDragDeltaX(0);
  };

  const handleMobileMouseLeave = () => {
    if (isMobileDragging) {
      if (mobileDragDeltaX < -minSwipeDistance) {
        nextMobileSlide();
      } else if (mobileDragDeltaX > minSwipeDistance) {
        prevMobileSlide();
      }
      setIsMobileDragging(false);
      setMobileDragDeltaX(0);
    }
    setIsMobilePaused(false);
  };

  // Keep desktop index within bounds if banners list changes
  useEffect(() => {
    if (currentIndex >= banners.length) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Desktop Autoplay (5.5 seconds per slide, pauses on hover/drag)
  useEffect(() => {
    if (banners.length <= 1 || isPaused || isDragging) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [banners.length, isPaused, isDragging, nextSlide]);

  // Touch Swipe Handlers (Tablet)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.targetTouches[0].clientX;
    setTouchDeltaX(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    if (touchDeltaX < -minSwipeDistance) {
      nextSlide();
    } else if (touchDeltaX > minSwipeDistance) {
      prevSlide();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  // Mouse Drag Handlers (Desktop click & swipe)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || banners.length <= 1) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragDeltaX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragDeltaX(e.clientX - dragStartX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragDeltaX < -minSwipeDistance) {
      nextSlide();
    } else if (dragDeltaX > minSwipeDistance) {
      prevSlide();
    }
    setIsDragging(false);
    setDragDeltaX(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      if (dragDeltaX < -minSwipeDistance) {
        nextSlide();
      } else if (dragDeltaX > minSwipeDistance) {
        prevSlide();
      }
      setIsDragging(false);
      setDragDeltaX(0);
    }
    setIsPaused(false);
  };

  return (
    <section id="hero" className="bg-[#0b0b0e] text-white">
      {/* ============================================================ */}
      {/* 1. MOBILE ONLY: DEDICATED MOBILE HERO BANNER (SWIPEABLE)     */}
      {/* Displays custom mobile banners with touch swipe & slide      */}
      {/* ============================================================ */}
      <div 
        className="sm:hidden w-full relative overflow-hidden bg-[#50020f] select-none border-b border-white/10"
        onTouchStart={handleMobileTouchStart}
        onTouchMove={handleMobileTouchMove}
        onTouchEnd={handleMobileTouchEnd}
        onMouseDown={handleMobileMouseDown}
        onMouseMove={handleMobileMouseMove}
        onMouseUp={handleMobileMouseUp}
        onMouseLeave={handleMobileMouseLeave}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="relative w-full overflow-hidden">
          {/* Mobile Slides Track */}
          <div
            className={`flex w-full ${isMobileDragging || mobileTouchStartX !== null ? '' : 'transition-transform duration-500 ease-out'}`}
            style={{
              transform: `translateX(calc(-${mobileIndex * 100}% + ${isMobileDragging ? mobileDragDeltaX : mobileTouchDeltaX}px))`,
              cursor: mobileBanners.length > 1 ? (isMobileDragging ? 'grabbing' : 'grab') : 'default'
            }}
          >
            {mobileBanners.map((mUrl, mIdx) => (
              <div key={mIdx} className="w-full shrink-0 relative">
                <img
                  src={mUrl}
                  alt={`${hero.firstName} ${hero.lastName} - Mobile Banner ${mIdx + 1}`}
                  fetchPriority={mIdx === 0 ? 'high' : 'auto'}
                  loading={mIdx === 0 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    if (!e.currentTarget.src.includes('driver-f1-banner.webp')) {
                      e.currentTarget.src = 'assets/driver-f1-banner.webp';
                    }
                  }}
                  className="w-full h-auto object-cover select-none pointer-events-none block"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Navigation Controls (Visible when > 1 banner) */}
          {mobileBanners.length > 1 && (
            <>
              {/* Prev Touch Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevMobileSlide();
                }}
                aria-label="Previous Mobile Banner"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center transition backdrop-blur-md border border-white/20 active:scale-90 shadow-lg"
              >
                <ChevronLeft className="w-4 h-4 -ml-0.5" />
              </button>

              {/* Next Touch Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextMobileSlide();
                }}
                aria-label="Next Mobile Banner"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center transition backdrop-blur-md border border-white/20 active:scale-90 shadow-lg"
              >
                <ChevronRight className="w-4 h-4 -mr-0.5" />
              </button>

              {/* Mobile Slide Dots & Counter Pill */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-md shadow-lg pointer-events-auto">
                <span className="text-[9px] font-f1 font-black text-white/90 tracking-wider uppercase">
                  {mobileIndex + 1}/{mobileBanners.length}
                </span>
                <div className="flex items-center gap-1 ml-0.5">
                  {mobileBanners.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToMobileSlide(dotIdx);
                      }}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        dotIdx === mobileIndex ? 'w-3.5 bg-f1-red' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Mobile Overlay Action Buttons */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 z-10 pointer-events-auto">
            <a
              href="#portfolio"
              className="flex-1 bg-f1-red hover:bg-f1-darkRed text-white text-center py-2 px-3 rounded-full text-xs font-f1 font-bold tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <span>EXPLORE PORTFOLIO</span>
              <ArrowUpRight size={13} />
            </a>
            <a
              href="#contact"
              className="bg-black/75 hover:bg-black text-white text-center py-2 px-4 rounded-full text-xs font-f1 font-bold tracking-wider border border-white/25 transition backdrop-blur-md active:scale-95"
            >
              CONTACT
            </a>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. DESKTOP / TABLET ONLY: WIDESCREEN BANNER SLIDER          */}
      {/* ============================================================ */}
      <div 
        ref={containerRef}
        className="hidden sm:block w-full relative overflow-hidden bg-[#50020f] select-none group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Full-bleed Edge-to-Edge Container with exact 4K master aspect ratio (4058x1550) */}
        <div className="relative w-full aspect-[4058/1550] overflow-hidden">
          {/* Slides Track */}
          <div 
            className={`flex w-full h-full ${isDragging ? '' : 'transition-transform duration-500 ease-out'}`}
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? dragDeltaX : touchDeltaX}px))`,
              cursor: banners.length > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
          >
            {banners.map((imgUrl, idx) => (
              <div 
                key={idx} 
                className="w-full h-full shrink-0 relative flex items-center justify-center overflow-hidden"
              >
                <img
                  src={imgUrl}
                  alt={`${hero.firstName} ${hero.lastName} - Banner ${idx + 1}`}
                  fetchPriority={idx === 0 ? 'high' : 'auto'}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="sync"
                  onError={(e) => {
                    // Fallback to local default webp if custom URL fails to load
                    if (!e.currentTarget.src.includes('driver-f1-banner.webp')) {
                      e.currentTarget.src = 'assets/driver-f1-banner.webp';
                    }
                  }}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Desktop Overlay Action Buttons (Ferrari style on desktop) */}
          <div className="hidden sm:flex absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-6 sm:left-8 md:left-12 lg:left-16 items-center gap-3 z-10 pointer-events-auto">
            <a
              href="#portfolio"
              className="bg-black/60 hover:bg-white text-white hover:text-black border-2 border-white rounded-full px-5 sm:px-7 py-1.5 sm:py-2 text-xs sm:text-sm font-f1 font-bold tracking-wider transition-all duration-300 shadow-xl flex items-center gap-2 backdrop-blur-sm"
            >
              <span>Explore Portfolio</span>
              <ArrowUpRight size={14} />
            </a>
            <a
              href="#contact"
              className="bg-black/60 hover:bg-f1-red text-white border border-white/30 rounded-full px-5 py-2 text-xs font-f1 font-bold tracking-wider transition backdrop-blur-sm"
            >
              Get In Touch
            </a>
          </div>

          {/* Navigation Controls (Visible when more than 1 banner) */}
          {banners.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous Banner"
                className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-f1-red text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 hover:scale-110 shadow-2xl opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 -ml-0.5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Next Banner"
                className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-f1-red text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 hover:scale-110 shadow-2xl opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 -mr-0.5" />
              </button>

              {/* F1 Sector / Slide Dots Indicators */}
              <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-6 md:right-10 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/70 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-xl pointer-events-auto">
                <span className="text-[9px] sm:text-[10px] font-f1 font-black text-white/90 tracking-widest mr-1 uppercase">
                  {currentIndex + 1}/{banners.length}
                </span>
                {banners.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(dotIdx);
                    }}
                    aria-label={`Lihat banner ${dotIdx + 1}`}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      currentIndex === dotIdx
                        ? 'w-5 sm:w-7 bg-f1-red shadow-md shadow-f1-red/50'
                        : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. DESKTOP DRIVER PROFILE BAR (NAME, NUMBER, ROLE, AVATAR)   */}
      {/* Hidden on mobile because Mobile Hero already displays this    */}
      {/* ============================================================ */}
      <div className="hidden sm:block bg-[#121219] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 sm:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            {/* Left: Driver Avatar + Big Bold Name & Team */}
            <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
              {/* Driver Portrait Avatar */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-sm overflow-hidden border-2 border-f1-red shadow-lg bg-black/60">
                  <img
                    src={hero.photo || 'assets/driver-portrait.png'}
                    alt={`${hero.firstName} ${hero.lastName}`}
                    onError={(e) => {
                      if (!e.currentTarget.src.includes('driver-portrait.png')) {
                        e.currentTarget.src = 'assets/driver-portrait.png';
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Mini Driver Number Tag */}
                <span className="absolute -bottom-1.5 -right-1.5 bg-f1-red text-white text-[10px] font-f1 font-black px-1.5 py-0.5 rounded-sm shadow border border-black leading-none">
                  #{hero.number}
                </span>
              </div>

              {/* Driver Titles & Name */}
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-f1 font-bold tracking-wider text-f1-gray uppercase">
                  <span className="inline-flex items-center gap-1 text-white bg-white/10 px-2 py-0.5 rounded-sm">
                    <span>{hero.flagEmoji}</span>
                    <span>{hero.country}</span>
                  </span>
                  <span className="text-f1-red font-black">•</span>
                  <span className="text-f1-red tracking-widest">{hero.role}</span>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-f1 font-black italic tracking-tight text-white uppercase leading-normal py-0.5 pr-4 break-words">
                  <span className="text-white/80">{hero.firstName}</span>{' '}
                  <span className="text-white">{hero.lastName}</span>
                </h1>

                <p className="text-xs sm:text-sm font-f1 font-bold text-f1-gray tracking-wider uppercase">
                  {hero.team}
                </p>
              </div>
            </div>

            {/* Right: Driver Quote & Short Bio Pill */}
            {(hero.quote || hero.bioSummary) && (
              <div className="hidden xl:block max-w-sm shrink-0 bg-white/[0.03] border border-white/10 p-3 rounded-sm ml-4">
                <p className="text-xs text-f1-lightGray font-sans italic leading-relaxed">
                  "{hero.quote || hero.bioSummary}"
                </p>
                <span className="text-[10px] font-f1 font-bold text-f1-gray tracking-widest uppercase block mt-1 text-right">
                  — ENGINEER STATEMENT // MISSION BRIEFING
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PROFESSIONAL METRICS & STATISTICS SECTION */}
      {/* ============================================================ */}
      <div id="statistics" className="max-w-7xl mx-auto px-4 md:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
        {/* Big Bold Section Title: STATISTICS */}
        <div className="border-b border-white/15 pb-3 sm:pb-4 flex justify-between items-end">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-f1 font-black italic tracking-tighter text-white uppercase">
            STATISTICS
          </h2>
          <span className="text-[10px] sm:text-xs font-f1 font-bold text-f1-red tracking-widest uppercase hidden sm:block">
            PROFESSIONAL QUALIFICATIONS & METRICS // ID #{hero.number}
          </span>
        </div>

        {/* The Signature 2x4 Career Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {hero.stats.map((stat, idx) => {
            const isAwardStat = stat.label.includes('AWARD') || stat.label.includes('CERTIFICATE');
            return (
              <div
                key={idx}
                onClick={() => {
                  if (isAwardStat && data.awards && data.awards.length > 0) {
                    setActiveAwardModal(data.awards[0]);
                  }
                }}
                className={`bg-[#15151e] border p-3 sm:p-5 rounded-sm transition group shadow-lg ${
                  isAwardStat
                    ? 'border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#181826] cursor-pointer ring-1 ring-[#d4af37]/20 hover:ring-[#d4af37]/60'
                    : 'border-white/10 hover:border-f1-red'
                }`}
              >
                <div className="flex items-center justify-between mb-1 sm:mb-1.5 gap-1">
                  <span className="text-[9px] sm:text-[11px] font-f1 font-bold tracking-wider sm:tracking-widest text-f1-gray block uppercase group-hover:text-white transition truncate">
                    {stat.label}
                  </span>
                  {isAwardStat && (
                    <span className="text-[8px] sm:text-[9px] font-f1 font-black text-[#d4af37] tracking-wider uppercase flex items-center gap-0.5 sm:gap-1 bg-[#d4af37]/15 px-1 sm:px-1.5 py-0.5 rounded border border-[#d4af37]/30 shrink-0">
                      <span>BUKA</span>
                      <ArrowUpRight size={10} />
                    </span>
                  )}
                </div>
                <strong
                  title={String(stat.value)}
                  className={`text-sm sm:text-xl lg:text-2xl font-f1 font-black tracking-wide block truncate transition ${
                    isAwardStat
                      ? 'text-[#d4af37] group-hover:text-white'
                      : 'text-white group-hover:text-f1-red'
                  }`}
                >
                  {stat.value}
                </strong>
              </div>
            );
          })}
        </div>

        {/* Core Competencies Bar Strip */}
        {hero.telemetryBars && hero.telemetryBars.length > 0 && (
          <div className="bg-[#15151e] border border-white/10 p-3.5 sm:p-5 rounded-sm space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-f1 font-bold text-f1-gray tracking-wider uppercase">
              <span className="flex items-center gap-1.5 text-white">
                <Gauge size={14} className="text-f1-red" />
                CORE TECHNICAL COMPETENCIES ({hero.telemetryBars.length})
              </span>
              <span className="text-[#00ff66] text-[10px] sm:text-xs">● 100% READY FOR DEPLOYMENT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
              {hero.telemetryBars.map((bar, idx) => (
                <div key={idx} className="space-y-1.5 bg-black/40 p-2.5 sm:p-3 rounded border border-white/5 hover:border-white/20 transition">
                  <div className="flex justify-between items-center text-xs font-f1 font-bold text-f1-lightGray tracking-wider gap-2">
                    <span className="truncate">{bar.label}</span>
                    <span className="text-white font-mono shrink-0">{bar.percent}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-f1-red to-f1-yellow transition-all duration-1000"
                      style={{ width: `${bar.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
