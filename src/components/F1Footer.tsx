import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Shield } from 'lucide-react';
import pbylLogo from '../assets/pbyl-logo.webp';

export const F1Footer: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <footer className="bg-[#09090c] border-t border-white/10 text-f1-gray font-f1 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Footer: Official Brand & Quick Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-8">
          <div className="flex items-center gap-3">
            <img
              src={pbylLogo}
              alt="PBYL Logo"
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="text-sm font-black tracking-widest text-white block">
                {data.hero.firstName} {data.hero.lastName}
              </span>
              <span className="text-[10px] tracking-widest text-f1-gray block">
                SOFTWARE ENGINEERING & ON-SITE IT PORTFOLIO
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-bold tracking-widest">
            <a href="#hero" className="hover:text-white transition">OVERVIEW</a>
            <a href="#biography" className="hover:text-white transition">BIOGRAPHY</a>
            <a href="#portfolio" className="hover:text-white transition">PORTFOLIO</a>
            <a href="#career" className="hover:text-white transition">CAREER</a>
            <a href="#podiums" className="hover:text-white transition">AWARDS</a>
            <a href="#contact" className="hover:text-white transition">CONTACT</a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & System Specs */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-medium tracking-wider text-f1-gray">
          <span>
            © {new Date().getFullYear()} {data.hero.firstName}. ALL RIGHTS RESERVED.
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield size={12} className="text-f1-red" />
              ENGINEERED FOR HIGH PERFORMANCE & MAXIMUM RELIABILITY
            </span>
            <span className="text-white/20">|</span>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-white/60 hover:text-f1-red transition font-mono tracking-widest text-[10px]"
            >
              CONTROL ROOM ⚙
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
