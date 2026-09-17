import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, Building2 } from 'lucide-react';

export const CareerHistory: React.FC = () => {
  const { data } = usePortfolio();
  const { career } = data;

  return (
    <section id="career" className="py-12 sm:py-20 bg-f1-surface border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 border-b-2 border-f1-red pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-f1 font-bold tracking-[0.25em] text-f1-gray uppercase mb-2">
              <span className="w-2 h-2 bg-f1-red"></span>
              <span>PROFESSIONAL TIMELINE // 03</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-f1 font-black italic tracking-tight text-white uppercase">
              WORK EXPERIENCE <span className="text-f1-red">& CAREER</span>
            </h2>
          </div>
          <span className="text-xs font-f1 font-bold text-f1-gray tracking-widest uppercase hidden sm:block">
            VERIFIED ROLES & ON-SITE IMPACT
          </span>
        </div>

        {/* Professional Experience History Table */}
        <div className="bg-f1-panel border border-white/10 rounded-sm overflow-hidden shadow-2xl">
          {/* Table Header (Desktop) */}
          <div className="hidden lg:grid grid-cols-12 gap-6 px-6 py-3.5 bg-[#15151d] text-f1-gray font-f1 font-bold text-xs tracking-widest uppercase border-b border-white/10">
            <div className="col-span-2">PERIOD / YEAR</div>
            <div className="col-span-3">ORGANIZATION & ROLE</div>
            <div className="col-span-5">JOB RESPONSIBILITIES & IMPACT (FULL DETAIL)</div>
            <div className="col-span-2 text-right">KEY IMPACT / STATUS</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/10">
            {career.map((entry) => {
              const isCurrent = entry.year.toUpperCase().includes('PRESENT') || entry.status === 'ACTIVE' || entry.team.includes('TMC');
              return (
                <div
                  key={entry.id}
                  className={`p-4 sm:p-6 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start transition space-y-3.5 lg:space-y-0 ${
                    isCurrent
                      ? 'bg-white/[0.03] border-l-4 border-l-f1-red hover:bg-white/[0.05]'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Column 1: Year & Live Status */}
                  <div className="lg:col-span-2 space-y-1.5">
                    <span className="text-f1-red font-f1 font-black italic text-xl lg:text-2xl block leading-none">
                      {entry.year}
                    </span>
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-f1 font-bold text-[#00ff66] uppercase bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-ping inline-block"></span>
                        CURRENT ROLE
                      </span>
                    ) : (
                      <span className="text-[10px] font-f1 font-bold text-f1-gray uppercase block">
                        COMPLETED
                      </span>
                    )}
                  </div>

                  {/* Column 2: Organization & Role Badge */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className={isCurrent ? 'text-f1-red' : 'text-f1-gray'} />
                      <strong className="text-base lg:text-lg font-f1 font-black text-white block leading-snug">
                        {entry.team}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Briefcase size={13} className="text-f1-yellow shrink-0" />
                      <span className="text-xs font-f1 font-bold tracking-wider text-f1-yellow uppercase bg-f1-yellow/10 border border-f1-yellow/20 px-2.5 py-1 rounded-sm inline-block">
                        {entry.role}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Full Detailed Responsibilities & Infrastructure (No line-clamp, 100% readable) */}
                  <div className="lg:col-span-5 bg-black/25 p-3.5 rounded border border-white/5 space-y-1">
                    <span className="text-[10px] font-f1 font-bold text-f1-gray tracking-wider uppercase block lg:hidden">
                      URAIAN TUGAS & TANGGUNG JAWAB:
                    </span>
                    <p className="text-xs md:text-sm text-f1-lightGray font-sans leading-relaxed break-words whitespace-normal selection:bg-f1-red selection:text-white">
                      {entry.description}
                    </p>
                  </div>

                  {/* Column 4: Key Impact / Status */}
                  <div className="lg:col-span-2 lg:text-right space-y-1.5 pt-1 lg:pt-0">
                    <span className="text-xs font-f1 font-bold tracking-widest text-white uppercase bg-white/10 border border-white/15 px-3 py-1 rounded-sm inline-block shadow-sm">
                      {entry.points || 'OPERATIONAL'}
                    </span>
                    {entry.status && (
                      <span className="text-[10px] font-f1 font-bold text-f1-gray uppercase block">
                        {entry.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
