import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Play, MapPin } from 'lucide-react';
import { StoryViewerModal } from './StoryViewerModal';
import { BiographyGalleryItem } from '../types/portfolio';

export const BiographySection: React.FC = () => {
  const { data } = usePortfolio();
  const { biography, hero, contact } = data;

  // Instagram Story modal state
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  // Resolve gallery items (respect empty gallery if user deleted all photos)
  const defaultGalleryItems: BiographyGalleryItem[] = [
    {
      id: 'story_1',
      image: hero.banner || 'assets/driver-f1-banner.webp',
      title: 'IT Operations & Traffic Management Control',
      caption: 'On-site infrastructure maintenance, real-time ATCS & CCTV networking, and mission-critical systems reliability at TMC Surakarta.',
      location: 'Surakarta, Central Java',
      timestamp: 'TMC Operations • 2026'
    },
    {
      id: 'story_2',
      image: hero.photo || 'assets/driver-portrait.png',
      title: 'Software Engineer & System Specialist',
      caption: 'Professional portrait representing academic excellence in Software Engineering, database architecture, and on-site field readiness.',
      location: hero.team || 'Telkom University',
      timestamp: 'Professional Profile'
    },
    {
      id: 'story_3',
      image: 'assets/profile.jpg',
      title: 'Discipline, Endurance & Championship Focus',
      caption: 'Disciplined athletic training and competitive grit from regional & international martial arts tournaments translated into persistent engineering focus.',
      location: 'Central Java Championship',
      timestamp: 'Honors • 1st Place Gold'
    }
  ];

  const galleryItems: BiographyGalleryItem[] = biography.gallery !== undefined 
    ? biography.gallery 
    : defaultGalleryItems;

  const showStoryCard = biography.showStoryCard !== false && galleryItems.length > 0;

  const handleOpenStory = (index: number) => {
    if (galleryItems.length === 0) return;
    setSelectedStoryIndex(index);
    setIsStoryOpen(true);
  };

  return (
    <section id="biography" className="py-12 sm:py-20 bg-f1-surface border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ============================================================ */}
        {/* 1. SECTION HEADER (MATCHING EXACT PROJECT F1 HEADER STYLE)   */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 border-b-2 border-f1-red pb-3 sm:pb-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-f1 font-bold tracking-[0.25em] text-f1-gray uppercase mb-2">
              <span className="w-2 h-2 bg-f1-red"></span>
              <span>{biography.kicker || 'PROFESSIONAL BACKGROUND // 01'}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Official Formula 1 Racing Line Separator SVG */}
              <svg viewBox="0 0 500 120" fill="none" className="h-6 sm:h-8 w-auto text-f1-red shrink-0" role="separator">
                <g fill="currentColor">
                  <path d="M120 0h80l-120 120h-80Z" />
                  <path d="M210 0h25000v55h-25055Z" />
                  <path d="M85 120h25200v-60h-25100Z" />
                </g>
              </svg>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-f1 font-black italic tracking-tight text-white uppercase">
                {biography.heading || 'BIOGRAPHY'}
              </h2>
            </div>
          </div>
          <span className="text-xs font-f1 font-bold text-f1-gray tracking-widest uppercase hidden sm:block">
            OFFICIAL ENGINEER PROFILE // SPEC #{hero.number || '24'}
          </span>
        </div>

        {/* ============================================================ */}
        {/* 2. DATA GRID (DATE OF BIRTH & PLACE OF BIRTH)               */}
        {/* ============================================================ */}
        <div className="mb-8 sm:mb-12">
          <dl className="flex flex-wrap items-center gap-8 sm:gap-14 lg:gap-20">
            <div className="space-y-1">
              <dt className="text-[10px] sm:text-xs font-f1 font-bold text-f1-gray uppercase tracking-wider">
                DATE OF BIRTH
              </dt>
              <dd className="text-2xl sm:text-3xl lg:text-4xl font-f1 font-black italic text-white tracking-tight uppercase">
                {biography.dateOfBirth || '24/09/2001'}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-[10px] sm:text-xs font-f1 font-bold text-f1-gray uppercase tracking-wider">
                PLACE OF BIRTH
              </dt>
              <dd className="text-2xl sm:text-3xl lg:text-4xl font-f1 font-black italic text-white tracking-tight uppercase">
                {biography.placeOfBirth || contact.base || 'Surakarta, Indonesia'}
              </dd>
            </div>
          </dl>
        </div>

        {/* ============================================================ */}
        {/* 3. TWO-COLUMN GRID: PORTRAIT STORY CARD (LEFT) & STORY (RIGHT)*/}
        {/* Exact F1 Charles Leclerc layout                             */}
        {/* ============================================================ */}
        <div className={`grid grid-cols-1 ${showStoryCard ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'} gap-x-8 lg:gap-x-16 gap-y-12 items-center`}>
          
          {/* ORDER-1: DRIVER PORTRAIT STORY CARD WITH F1 BACKGROUND */}
          {showStoryCard && (
            <div className="order-1 relative min-h-[460px] sm:min-h-[520px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
              {/* Geometric F1 Watermark Lines Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none select-none">
                <svg width="100%" height="100%" viewBox="0 0 600 600" fill="none">
                  <g stroke="#ffffff" strokeWidth="1.5" opacity="0.6">
                    <line x1="0" y1="100" x2="600" y2="500" />
                    <line x1="0" y1="200" x2="600" y2="600" />
                    <line x1="0" y1="50" x2="550" y2="600" />
                    <line x1="150" y1="0" x2="600" y2="450" />
                    <rect x="180" y="80" width="300" height="420" stroke="#e10600" strokeWidth="2" fill="none" opacity="0.3" />
                  </g>
                </svg>
              </div>

              {/* Portrait Card (Interactive Instagram Story Card) */}
              <div 
                onClick={() => handleOpenStory(0)}
                className="group relative w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] lg:w-[360px] lg:h-[540px] rounded-xl overflow-hidden shadow-2xl border-2 border-white/15 hover:border-f1-red cursor-pointer transition-all duration-500 bg-[#0f0f15] hover:scale-[1.02]"
                title="Klik untuk membuka Instagram Story"
              >
                {/* Image */}
                <img
                  src={galleryItems[0]?.image || hero.photo || 'assets/driver-portrait.png'}
                  alt={hero.firstName}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'assets/driver-portrait.png';
                  }}
                />

                {/* Instagram Story Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Instagram Story Indicator Ring */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-f1-red animate-pulse" />
                    <span className="text-[10px] font-f1 font-black text-white tracking-widest uppercase">
                      FIELD STORY
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-f1-red text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={14} className="ml-0.5 fill-current" />
                  </div>
                </div>

                {/* Bottom Card Title & Story Cue */}
                <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1.5">
                  <span className="text-[10px] font-f1 font-black text-f1-red uppercase tracking-wider block">
                    Tap to view Story
                  </span>
                  <h3 className="text-base sm:text-lg font-f1 font-black italic text-white uppercase leading-tight tracking-wide drop-shadow">
                    {galleryItems[0]?.title || 'IT Infrastructure & Web Engineering'}
                  </h3>
                  {galleryItems[0]?.location && (
                    <div className="flex items-center gap-1 text-[11px] text-f1-lightGray font-mono">
                      <MapPin size={11} className="text-f1-red shrink-0" />
                      <span className="truncate">{galleryItems[0].location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* EDITORIAL NARRATIVE PARAGRAPHS */}
          <div className={`${showStoryCard ? 'order-3 lg:order-2' : ''} space-y-4 sm:space-y-5 text-f1-lightGray text-sm sm:text-base leading-relaxed font-sans`}>
            {biography.paragraphs.map((para, idx) => (
              <p key={idx} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* PULL QUOTE (SCUDERIA FERRARI / F1 LECLERC EXACT QUOTE) */}
          <div className={`${showStoryCard ? 'order-2 lg:order-3 lg:col-span-2' : 'w-full'} py-6 sm:py-10 border-y border-white/10 my-2`}>
            <figure className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
              {/* Exact Formula 1 Double Quote SVG from F1 Website */}
              <svg viewBox="0 0 64 44" fill="none" className="w-8 h-6 sm:w-10 sm:h-7 text-f1-red fill-current opacity-90" role="presentation">
                <path d="M0 6.39337V11.4717H16.5209V22.6482C16.5209 28.1046 12.9206 32.5275 8.4793 32.5275H0V37.6059H8.4793C12.13 37.6059 15.6386 35.8665 18.1044 32.8392C20.3572 30.0709 21.5993 26.4523 21.5993 22.6482V6.39337H0Z" />
                <path d="M0 0V5.07833H22.9147V22.6485C22.9147 26.7529 21.5695 30.6671 19.1243 33.6692C16.4086 37.0058 12.5287 38.9217 8.48159 38.9217H0.00229394V44H8.48159C14.0642 44 19.3786 41.4013 23.0637 36.8752C26.2423 32.9702 27.9931 27.9171 27.9931 22.6485V0H0Z" />
                <path d="M29.3037 6.39337V11.4717H45.8246V22.6482C45.8246 28.1046 42.2243 32.5275 37.783 32.5275H29.3037V37.6059H37.783C41.4337 37.6059 44.9423 35.8665 47.4082 32.8392C49.6609 30.0709 50.903 26.4523 50.903 22.6482V6.39337H29.3037Z" />
                <path d="M29.3057 0V5.07833H52.2204V22.6485C52.2204 26.7529 50.8752 30.6671 48.4299 33.6692C45.7143 37.0058 41.8344 38.9217 37.7873 38.9217H29.308V44H37.7873C43.3698 44 48.6843 41.4013 52.3694 36.8752C55.5479 32.9702 57.2988 27.9171 57.2988 22.6485V0H29.3057Z" />
              </svg>
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-f1 font-black italic uppercase text-white tracking-tight leading-snug">
                "{biography.quote}"
              </blockquote>
              <figcaption className="text-xs sm:text-sm font-f1 font-bold text-f1-red uppercase tracking-wider">
                — {biography.quoteAuthor || `${hero.firstName} ${hero.lastName}`}
              </figcaption>
            </figure>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 5. INSTAGRAM STORY VIEWER MODAL                              */}
      {/* ============================================================ */}
      {galleryItems.length > 0 && (
        <StoryViewerModal
          isOpen={isStoryOpen}
          onClose={() => setIsStoryOpen(false)}
          stories={galleryItems}
          initialIndex={selectedStoryIndex}
          driverPhoto={hero.photo || 'assets/driver-portrait.png'}
          driverName={`${hero.firstName} ${hero.lastName}`}
        />
      )}
    </section>
  );
};
