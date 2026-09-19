import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const { data, setActiveProjectModal, isAdminUnlocked } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const projects = data.projects;

  const counts = {
    all: projects.length,
    web: projects.filter(p => p.category === 'web').length,
    photo: projects.filter(p => p.category === 'photo').length,
    other: projects.filter(p => p.category === 'other').length
  };

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

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
  }, [checkScroll, filtered]);

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

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="portfolio" className="py-12 sm:py-20 bg-f1-black border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 border-b-2 border-f1-red pb-3 sm:pb-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-f1 font-bold tracking-[0.25em] text-f1-gray uppercase mb-2">
              <span className="w-2 h-2 bg-f1-red"></span>
              <span>SELECTED WORK // 02</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-f1 font-black italic tracking-tight text-white uppercase">
              FEATURED <span>PROJECTS</span>
            </h2>
          </div>

          {/* Filter Tabs & Quick Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1 sm:gap-1.5 bg-f1-surface p-1 rounded border border-white/10 text-[11px] sm:text-xs">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`font-f1 font-bold tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded transition ${
                  activeCategory === 'all' ? 'bg-f1-red text-white' : 'text-f1-gray hover:text-white'
                }`}
              >
                ALL ({counts.all})
              </button>
              <button
                onClick={() => handleCategoryChange('web')}
                className={`font-f1 font-bold tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded transition ${
                  activeCategory === 'web' ? 'bg-f1-red text-white' : 'text-f1-gray hover:text-white'
                }`}
              >
                WEB DEV ({counts.web})
              </button>
              <button
                onClick={() => handleCategoryChange('photo')}
                className={`font-f1 font-bold tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded transition ${
                  activeCategory === 'photo' ? 'bg-f1-red text-white' : 'text-f1-gray hover:text-white'
                }`}
              >
                FOTO ({counts.photo})
              </button>
              <button
                onClick={() => handleCategoryChange('other')}
                className={`font-f1 font-bold tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded transition ${
                  activeCategory === 'other' ? 'bg-f1-red text-white' : 'text-f1-gray hover:text-white'
                }`}
              >
                LAINNYA ({counts.other})
              </button>
            </div>

            {/* Navigation Arrows in Header */}
            <div className="flex items-center gap-1 bg-f1-surface p-1 rounded border border-white/10">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className={`p-1.5 rounded transition ${
                  canScrollLeft
                    ? 'text-white hover:bg-f1-red hover:text-white active:scale-95'
                    : 'text-white/20 cursor-not-allowed'
                }`}
                title="Geser Kiri"
                aria-label="Previous items"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[10px] font-f1 font-bold text-f1-gray px-1 tracking-wider uppercase hidden sm:inline">
                SLIDE
              </span>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className={`p-1.5 rounded transition ${
                  canScrollRight
                    ? 'text-white hover:bg-f1-red hover:text-white active:scale-95'
                    : 'text-white/20 cursor-not-allowed'
                }`}
                title="Geser Kanan"
                aria-label="Next items"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {isAdminUnlocked && (
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/admin');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white/5 hover:bg-f1-red border border-white/10 hover:border-f1-red text-white font-f1 font-bold text-xs tracking-wider px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                title="Buka Control Room Admin untuk Tambah/Kelola Proyek"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">ADD PROYEK</span>
              </a>
            )}
          </div>
        </div>

        {/* Project Cards Carousel Container */}
        <div className="relative group/carousel">
          {/* Floating Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-f1-black/90 hover:bg-f1-red text-white border border-white/20 hover:border-f1-red rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Geser ke kiri"
              title="Geser ke kiri"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Floating Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-f1-black/90 hover:bg-f1-red text-white border border-white/20 hover:border-f1-red rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Geser ke kanan"
              title="Geser ke kanan"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Project Cards Slider Track */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-3 px-1"
          >
            {filtered.map((project) => (
              <article
                key={project.id}
                onClick={() => setActiveProjectModal(project)}
                className="w-[85vw] sm:w-[350px] md:w-[380px] shrink-0 snap-start bg-f1-panel border border-white/10 hover:border-f1-red rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer shadow-xl flex flex-col"
              >
                {/* Card Image Banner */}
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#161622] relative">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-f1 font-black text-2xl text-white/10 tracking-widest uppercase">
                      NO PREVIEW
                    </div>
                  )}
                  {/* Year & Category Pill Overlay */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-black/70 backdrop-blur-sm text-f1-red text-[10px] font-f1 font-black tracking-widest px-2 py-0.5 rounded-sm uppercase border border-white/10">
                      {project.category}
                    </span>
                    <span className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-f1 font-bold px-2 py-0.5 rounded-sm border border-white/10">
                      {project.year}
                    </span>
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-f1 font-black text-white group-hover:text-f1-red transition leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs text-f1-gray font-sans line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1 max-w-[70%]">
                      {project.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-f1 font-bold text-f1-lightGray bg-white/5 border border-white/10 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-[10px] font-f1 font-bold text-f1-gray px-1 py-0.5">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* View Details Link */}
                    <span className="text-xs font-f1 font-bold text-white group-hover:text-f1-red flex items-center gap-1 transition">
                      <Eye size={13} />
                      <span>VIEW</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>


        {filtered.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/20 rounded-md">
            <p className="text-sm font-f1 font-bold text-f1-gray tracking-widest uppercase">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
