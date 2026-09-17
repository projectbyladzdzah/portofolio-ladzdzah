import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Phone, Github, Linkedin, MapPin, Radio, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { data } = usePortfolio();
  const { contact } = data;

  return (
    <section id="contact" className="py-12 sm:py-20 bg-f1-surface border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-br from-[#16161f] to-[#0e0e13] border border-white/15 rounded-md p-5 sm:p-8 md:p-14 relative overflow-hidden shadow-2xl">
          {/* Subtle Radar Ring Decor */}
          <div className="absolute -right-20 -top-20 w-96 h-96 border border-f1-red/10 rounded-full pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            {/* Left Column: Heading & Description (6 cols) */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-f1 font-bold tracking-[0.25em] text-f1-red uppercase">
                <Radio size={14} className="animate-pulse" />
                <span>DIRECT CONTACT & INQUIRIES // 05</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-f1 font-black italic tracking-tight text-white uppercase leading-[0.9]">
                {contact.heading}
              </h2>
              <p className="text-xs sm:text-base text-f1-gray font-sans leading-relaxed pt-1 sm:pt-2">
                {contact.description}
              </p>
            </div>

            {/* Right Column: Contact Links Grid (6 cols) */}
            <div className="lg:col-span-6 space-y-2.5 sm:space-y-3">
              {/* Email */}
              <a
                href={`mailto:${contact.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 sm:p-4 bg-f1-panel/80 hover:bg-f1-panel border border-white/10 hover:border-f1-red rounded-sm transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-f1-red/15 text-f1-red flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-f1 font-bold tracking-widest text-f1-gray block uppercase">
                      PROFESSIONAL EMAIL
                    </span>
                    <strong className="text-xs sm:text-sm font-f1 font-bold text-white group-hover:text-f1-red transition block truncate">
                      {contact.email}
                    </strong>
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-f1-gray group-hover:text-white transition shrink-0 ml-2" />
              </a>

              {/* Phone / WhatsApp */}
              <a
                href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-f1-panel/80 hover:bg-f1-panel border border-white/10 hover:border-f1-red rounded-sm transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-sm bg-f1-red/15 text-f1-red flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-f1 font-bold tracking-widest text-f1-gray block uppercase">
                      PHONE / WHATSAPP DIRECT
                    </span>
                    <strong className="text-xs sm:text-sm font-f1 font-bold text-white group-hover:text-f1-red transition">
                      {contact.phone}
                    </strong>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-f1-gray group-hover:text-white transition" />
              </a>

              {/* GitHub */}
              <a
                href={contact.github.startsWith('http') ? contact.github : `https://${contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-f1-panel/80 hover:bg-f1-panel border border-white/10 hover:border-f1-red rounded-sm transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-sm bg-white/10 text-white flex items-center justify-center">
                    <Github size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-f1 font-bold tracking-widest text-f1-gray block uppercase">
                      GITHUB PROFILE
                    </span>
                    <strong className="text-xs sm:text-sm font-f1 font-bold text-white group-hover:text-f1-red transition">
                      {contact.github}
                    </strong>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-f1-gray group-hover:text-white transition" />
              </a>

              {/* LinkedIn */}
              {contact.linkedin && (
                <a
                  href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-f1-panel/80 hover:bg-f1-panel border border-white/10 hover:border-f1-red rounded-sm transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm bg-[#0077b5]/20 text-[#0077b5] flex items-center justify-center">
                      <Linkedin size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-f1 font-bold tracking-widest text-f1-gray block uppercase">
                        LINKEDIN PROFILE
                      </span>
                      <strong className="text-xs sm:text-sm font-f1 font-bold text-white group-hover:text-f1-red transition">
                        {contact.linkedin}
                      </strong>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-f1-gray group-hover:text-white transition" />
                </a>
              )}

              {/* Location */}
              <div className="flex items-center gap-3 p-4 bg-f1-panel/40 border border-white/5 rounded-sm">
                <div className="w-9 h-9 rounded-sm bg-white/5 text-f1-yellow flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-f1 font-bold tracking-widest text-f1-gray block uppercase">
                    CURRENT LOCATION
                  </span>
                  <strong className="text-xs sm:text-sm font-f1 font-bold text-white">
                    {contact.base}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
