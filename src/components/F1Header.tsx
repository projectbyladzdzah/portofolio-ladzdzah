import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Menu, X, Clock, ArrowLeft } from 'lucide-react';
import pbylLogo from '../assets/pbyl-logo.webp';
import pbylLogoPng from '../assets/pbyl-logo.png';

export const F1Header: React.FC = () => {
  const { data } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 1. TOP OFFICIAL F1 NAVBAR (Schedule, Results, Standings, Drivers, Teams) */}
      <header className="sticky top-0 z-40 bg-[#15151e] border-b border-white/10 px-4 md:px-8 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <a href="#hero" className="flex items-center gap-2 group" aria-label="Home">
              <img
                src={pbylLogo}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = pbylLogoPng;
                }}
                alt="PBYL Logo"
                className="h-8 md:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(225,6,0,0.35)]"
              />
            </a>

            <nav className="hidden lg:flex items-center space-x-6 font-f1 font-bold text-xs tracking-wider text-f1-gray">
              <a href="#hero" className="text-white border-b-2 border-f1-red pb-0.5">Overview</a>
              <a href="#portfolio" className="hover:text-white transition">Projects</a>
              <a href="#career" className="hover:text-white transition">Experience</a>
              <a href="#statistics" className="hover:text-white transition">Competencies</a>
              <a href="#podiums" className="hover:text-white transition">Awards</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </nav>
          </div>

          {/* Right: Verified Badge & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Verified Professional Badge */}
            <div className="hidden sm:flex items-center justify-center px-2.5 h-6 rounded-full border border-white/30 text-[9px] font-f1 font-black text-white bg-white/5 tracking-wider">
              VERIFIED
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-1 hover:text-f1-red transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 flex flex-col space-y-1 font-f1 font-bold text-xs tracking-wider pb-2 bg-[#101017] -mx-4 px-4">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-white bg-white/5 rounded flex items-center justify-between">
              <span>PROFILE OVERVIEW</span>
              <span className="text-f1-red text-[10px]">#16</span>
            </a>
            <a href="#statistics" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-f1-gray hover:text-white hover:bg-white/5 rounded transition">
              SKILLS & METRICS
            </a>
            <a href="#biography" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-f1-gray hover:text-white hover:bg-white/5 rounded transition">
              BIOGRAPHY
            </a>
            <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-f1-gray hover:text-white hover:bg-white/5 rounded transition">
              PROJECTS
            </a>
            <a href="#career" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-f1-gray hover:text-white hover:bg-white/5 rounded transition">
              WORK EXPERIENCE
            </a>
            <a href="#podiums" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-f1-gray hover:text-white hover:bg-white/5 rounded transition">
              AWARDS & CERTIFICATE
            </a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-[#00ff66] hover:bg-white/5 rounded transition">
              GET IN TOUCH →
            </a>
          </div>
        )}
      </header>

      {/* 2. SUB-BAR: AVAILABILITY & REAL-TIME CLOCK */}
      <div className="bg-[#0e0e13] border-b border-white/10 px-4 md:px-8 py-2 text-[10px] sm:text-[11px] font-f1 font-bold tracking-wider text-f1-gray">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          {/* Left: Work Status & Location */}
          <div className="flex items-center gap-2">
            <span className="text-[#00ff66] flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse"></span>
              <span>AVAILABLE FOR HIRE</span>
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:flex text-white items-center gap-1 truncate">
              <span>{data.hero.flagEmoji}</span>
              <span className="truncate">Central Java, ID &gt;</span>
            </span>
          </div>

          {/* Right: Live Work Clock */}
          <div className="flex items-center gap-2 sm:gap-4 text-white/80 shrink-0">
            <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/10">
              <span className="text-f1-red font-black text-[9px]">WIB</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-mono">
              <Clock size={12} className="text-f1-red" />
              <span>{currentTime || '14:20'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. CONTEXT JUMP BAR (Desktop only - prevents mobile clutter and horizontal scrollbar) */}
      <div className="hidden md:block bg-[#0b0b0e] border-b border-white/5 px-4 md:px-8 py-2.5 text-xs font-f1 font-bold tracking-wider text-f1-gray">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">
          <a href="#hero" className="hover:text-white flex items-center gap-1.5 transition text-white/80 shrink-0">
            <ArrowLeft size={13} />
            <span>Engineer Profile</span>
          </a>

          <div className="flex items-center space-x-6 text-xs">
            <a href="#statistics" className="hover:text-white transition">Overview</a>
            <a href="#biography" className="hover:text-white transition">Biography</a>
            <a href="#portfolio" className="hover:text-white transition">Projects</a>
            <a href="#career" className="hover:text-white transition">Experience</a>
            <a href="#podiums" className="hover:text-white transition">Awards</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </div>
    </>
  );
};
