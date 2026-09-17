import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Gauge, ArrowUpRight } from 'lucide-react';

export const DriverHero: React.FC = () => {
  const { data, setActiveAwardModal } = usePortfolio();
  const { hero } = data;

  const bannerImg = hero.banner || 'assets/driver-f1-banner.png';

  return (
    <section id="hero" className="bg-[#0b0b0e] text-white">
      {/* ============================================================ */}
      {/* THE OFFICIAL F1 FULL-WIDTH RED DRIVER BANNER (CHARLES LECLERC STYLE) */}
      {/* Full width edge-to-edge from left edge to right edge of screen */}
      {/* ============================================================ */}
      <div className="w-full relative overflow-hidden bg-[#50020f]">
        {/* Full-bleed Edge-to-Edge Container with exact 4K master aspect ratio (4058x1550) */}
        <div className="relative w-full aspect-[4058/1550] flex items-center justify-center overflow-hidden">
          <picture className="w-full h-full block">
            <source srcSet="assets/driver-f1-banner.webp" type="image/webp" />
            <img
              src={bannerImg}
              alt={`${hero.firstName} ${hero.lastName}`}
              fetchPriority="high"
              decoding="sync"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </picture>

          {/* Desktop Overlay Action Buttons (Ferrari style on desktop) */}
          <div className="hidden sm:flex absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-6 sm:left-8 md:left-12 lg:left-16 items-center gap-3">
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
        </div>
      </div>

      {/* Mobile Action Bar (Right below banner, clean & finger-friendly) */}
      <div className="sm:hidden bg-[#12121a] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-2.5">
        <a
          href="#portfolio"
          className="flex-1 bg-f1-red hover:bg-f1-darkRed text-white text-center py-2 px-3 rounded-full text-xs font-f1 font-bold tracking-wider shadow-md flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <span>EXPLORE PORTFOLIO</span>
          <ArrowUpRight size={13} />
        </a>
        <a
          href="#contact"
          className="bg-white/10 hover:bg-white/20 text-white text-center py-2 px-4 rounded-full text-xs font-f1 font-bold tracking-wider border border-white/15 transition active:scale-95"
        >
          CONTACT
        </a>
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
