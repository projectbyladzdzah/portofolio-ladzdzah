import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Trophy, ArrowUpRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export const AwardsSection: React.FC = () => {
  const { data, setActiveAwardModal } = usePortfolio();
  const { awards } = data;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, awards]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section id="podiums" className="py-12 sm:py-20 bg-f1-black border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 border-b-2 border-f1-red pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-f1 font-bold tracking-[0.25em] text-f1-gray uppercase mb-2">
              <span className="w-2 h-2 bg-f1-red"></span>
              <span>VERIFIED CREDENTIALS & LICENSES // 04</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-f1 font-black italic tracking-tight text-white uppercase">
              CERTIFICATES
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] sm:text-xs font-f1 font-bold text-[#d4af37] tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles size={13} />
              <span className="hidden md:inline">CLICK CARD TO VIEW VERIFIED CERTIFICATE</span>
              <span className="md:hidden">VERIFIED CERTIFICATE</span>
            </span>

            {/* Navigation Arrows in Header */}
            <div className="flex items-center gap-1 bg-f1-surface p-1 rounded border border-[#d4af37]/30">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className={`p-1.5 rounded transition ${
                  canScrollLeft
                    ? 'text-[#d4af37] hover:bg-[#d4af37] hover:text-black active:scale-95'
                    : 'text-white/20 cursor-not-allowed'
                }`}
                title="Previous"
                aria-label="Previous certificates"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[10px] font-f1 font-bold text-[#d4af37] px-1 tracking-wider uppercase hidden sm:inline">
                CERTIFICATES
              </span>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className={`p-1.5 rounded transition ${
                  canScrollRight
                    ? 'text-[#d4af37] hover:bg-[#d4af37] hover:text-black active:scale-95'
                    : 'text-white/20 cursor-not-allowed'
                }`}
                title="Next"
                aria-label="Next certificates"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Podium Cards Carousel Container */}
        <div className="relative group/awards-carousel">
          {/* Floating Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-f1-black/90 hover:bg-[#d4af37] text-white hover:text-black border border-[#d4af37]/40 hover:border-[#d4af37] rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Previous"
              title="Previous"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Floating Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-f1-black/90 hover:bg-[#d4af37] text-white hover:text-black border border-[#d4af37]/40 hover:border-[#d4af37] rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Next"
              title="Next"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Podium Cards Slider Track */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-3 px-1"
          >
            {awards.map((award, idx) => (
              <div
                key={award.id}
                onClick={() => setActiveAwardModal(award)}
                className="w-[85vw] sm:w-[350px] md:w-[380px] shrink-0 snap-start bg-f1-panel border border-white/10 hover:border-[#d4af37] p-4 sm:p-6 rounded-sm relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer shadow-lg hover:shadow-[#d4af37]/10 flex flex-col justify-between"
              >
                {/* Background Trophy Glow */}
                <div className="absolute -right-6 -bottom-6 text-white/[0.03] group-hover:text-[#d4af37]/[0.08] transition duration-500 pointer-events-none">
                  <Trophy size={140} />
                </div>

                {/* Position & Year Badge */}
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-f1 font-black tracking-widest px-3 py-1 rounded-sm">
                    {award.position || '1ST PLACE GOLD'}
                  </span>
                  <span className="text-f1-red font-f1 font-black italic text-lg">
                    {award.year}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2 relative z-10 flex-1">
                  <h3 className="text-xl font-f1 font-black text-white leading-tight group-hover:text-[#d4af37] transition">
                    {award.title}
                  </h3>
                  <p className="text-xs text-f1-gray font-sans leading-relaxed line-clamp-3">
                    {award.description || award.subtitle}
                  </p>
                </div>

                {/* Click Call to Action */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
                  <span className="text-xs font-f1 font-bold text-[#d4af37] group-hover:text-white transition flex items-center gap-1">
                    <span>VIEW CERTIFICATE & DETAILS</span>
                    <ArrowUpRight size={13} />
                  </span>
                  <span className="text-[10px] text-f1-gray font-mono">
                    #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

