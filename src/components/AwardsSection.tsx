import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Trophy, ArrowUpRight, Sparkles } from 'lucide-react';

export const AwardsSection: React.FC = () => {
  const { data, setActiveAwardModal } = usePortfolio();
  const { awards } = data;

  return (
    <section id="podiums" className="py-12 sm:py-20 bg-f1-black border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 border-b-2 border-f1-red pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-f1 font-bold tracking-[0.25em] text-f1-gray uppercase mb-2">
              <span className="w-2 h-2 bg-f1-red"></span>
              <span>HONORS, ACHIEVEMENTS & CREDENTIALS // 04</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-f1 font-black italic tracking-tight text-white uppercase">
              AWARDS <span className="text-f1-red">& CERTIFICATES</span>
            </h2>
          </div>
          <span className="text-[11px] sm:text-xs font-f1 font-bold text-[#d4af37] tracking-widest uppercase flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>KLIK KARTU UNTUK LIHAT SERTIFIKAT DIGITAL</span>
          </span>
        </div>

        {/* Podium Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {awards.map((award, idx) => (
            <div
              key={award.id}
              onClick={() => setActiveAwardModal(award)}
              className="bg-f1-panel border border-white/10 hover:border-[#d4af37] p-4 sm:p-6 rounded-sm relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer shadow-lg hover:shadow-[#d4af37]/10"
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
              <div className="space-y-2 relative z-10">
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
                  <span>LIHAT SERTIFIKAT & DETAIL</span>
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
    </section>
  );
};
