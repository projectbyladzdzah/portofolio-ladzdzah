import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Terminal, Shield, CheckCircle2 } from 'lucide-react';

export const BiographySection: React.FC = () => {
  const { data } = usePortfolio();
  const { biography } = data;

  return (
    <section id="biography" className="py-12 sm:py-20 bg-f1-surface border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header with F1 Official Red Cut */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-f1 font-bold tracking-[0.25em] text-f1-gray uppercase mb-2">
            <span className="w-2 h-2 bg-f1-red"></span>
            <span>{biography.kicker}</span>
          </div>
          <div className="flex items-end justify-between border-b-2 border-f1-red pb-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-f1 font-black italic tracking-tight text-white uppercase">
              {biography.heading}
            </h2>
            <span className="text-xs font-f1 font-bold tracking-widest text-f1-red hidden sm:block">
              TECHNICAL SPECIFICATION
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Big Pull Quote & Key Badges (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="bg-f1-panel border-l-4 border-f1-red p-4 sm:p-6 rounded-r-md shadow-xl">
              <span className="text-3xl sm:text-4xl font-serif text-f1-red block leading-none select-none">“</span>
              <p className="text-sm sm:text-base md:text-lg text-white font-sans italic leading-relaxed -mt-2">
                {biography.quote}
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-f1 font-bold tracking-wider text-f1-gray">
                <span>{biography.quoteAuthor}</span>
                <span className="text-f1-red">#16 SPEC</span>
              </div>
            </div>

            {/* F1 Technical Status Box */}
            <div className="bg-[#16161d] border border-white/10 p-4 sm:p-5 rounded-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-f1 font-bold tracking-widest text-white">
                <Terminal size={15} className="text-f1-red" />
                <span>ACTIVE CAPABILITIES</span>
              </div>
              <ul className="space-y-2 text-xs font-sans text-f1-gray">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-f1-yellow flex-shrink-0" />
                  <span>Full-Stack Web Engineering & Modern Frameworks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-f1-yellow flex-shrink-0" />
                  <span>Enterprise IT Support & Network Troubleshooting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-f1-yellow flex-shrink-0" />
                  <span>Relational Database Management & SQL Optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-f1-yellow flex-shrink-0" />
                  <span>High-Speed Visual Production & Digital Media</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Paragraph Narrative & Skill Pills (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4 text-f1-gray text-sm sm:text-base leading-relaxed font-sans">
              {biography.paragraphs.map((p, idx) => (
                <p key={idx} className="first-letter:text-2xl sm:first-letter:text-3xl first-letter:font-f1 first-letter:font-bold first-letter:text-f1-red first-letter:mr-1">
                  {p}
                </p>
              ))}
            </div>

            {/* Skills & Arsenal Pills */}
            <div className="pt-4 sm:pt-6 border-t border-white/10">
              <h3 className="text-xs font-f1 font-black tracking-widest text-white uppercase mb-3 sm:mb-4 flex items-center gap-2">
                <Shield size={14} className="text-f1-red" />
                <span>CORE TECHNOLOGIES & TOOLS ARSENAL</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {biography.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-f1-panel hover:bg-white/10 text-f1-lightGray hover:text-white border border-white/10 hover:border-f1-red text-[11px] sm:text-xs font-f1 font-bold tracking-wider px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-sm transition cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
