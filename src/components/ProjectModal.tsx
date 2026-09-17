import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, ExternalLink, Github, Calendar, Tag } from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const { activeProjectModal, setActiveProjectModal } = usePortfolio();

  if (!activeProjectModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={() => setActiveProjectModal(null)}
    >
      <div
        className="bg-[#121218] border border-white/20 rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-f1-red/20 text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-f1-surface">
          <div className="flex items-center gap-3">
            <span className="bg-f1-red text-white text-[10px] font-f1 font-black tracking-widest px-2 py-0.5 rounded-sm uppercase">
              {activeProjectModal.category.toUpperCase()}
            </span>
            <span className="text-xs font-f1 font-bold text-f1-gray tracking-wider flex items-center gap-1">
              <Calendar size={13} />
              {activeProjectModal.year}
            </span>
          </div>
          <button
            onClick={() => setActiveProjectModal(null)}
            className="text-f1-gray hover:text-white transition p-1 hover:bg-white/10 rounded"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Image Banner */}
          {activeProjectModal.image ? (
            <div className="aspect-video w-full rounded-sm overflow-hidden border border-white/10">
              <img
                src={activeProjectModal.image}
                alt={activeProjectModal.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[21/9] w-full rounded-sm bg-[#1a1a24] border border-white/10 flex items-center justify-center text-center p-4">
              <span className="font-f1 font-black text-2xl tracking-widest text-white/20 uppercase">
                PROJECT PREVIEW // {activeProjectModal.category.toUpperCase()}
              </span>
            </div>
          )}

          {/* Title & Description */}
          <div>
            <h2 className="text-2xl md:text-3xl font-f1 font-black text-white leading-tight mb-3">
              {activeProjectModal.title}
            </h2>
            <p className="text-sm md:text-base text-f1-gray font-sans leading-relaxed whitespace-pre-line">
              {activeProjectModal.description}
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-xs font-f1 font-bold text-f1-gray tracking-widest flex items-center gap-1.5 uppercase">
              <Tag size={13} />
              TECHNOLOGY STACK & TAGS
            </span>
            <div className="flex flex-wrap gap-2">
              {activeProjectModal.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-f1-panel border border-white/10 text-xs font-f1 font-bold text-f1-lightGray px-3 py-1 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions: Live Demo & GitHub */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
            {activeProjectModal.liveUrl && (
              <a
                href={activeProjectModal.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-f1-red hover:bg-f1-darkRed text-white text-xs font-f1 font-bold tracking-wider px-5 py-2.5 rounded-sm flex items-center gap-2 transition"
              >
                <span>VISIT LIVE DEMO</span>
                <ExternalLink size={14} />
              </a>
            )}
            {activeProjectModal.githubUrl && (
              <a
                href={activeProjectModal.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-f1 font-bold tracking-wider px-5 py-2.5 rounded-sm flex items-center gap-2 transition"
              >
                <Github size={14} />
                <span>SOURCE CODE</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
