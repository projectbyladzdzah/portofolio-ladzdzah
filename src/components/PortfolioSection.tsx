import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Eye } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const { data, setActiveProjectModal, setIsAdminOpen, isAdminUnlocked } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('all');

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
              TRACKSIDE <span>PORTFOLIO</span>
            </h2>
          </div>

          {/* Filter Tabs & Quick Add */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1 sm:gap-1.5 bg-f1-surface p-1 rounded border border-white/10 text-[11px] sm:text-xs">
              <button
                onClick={() => setActiveCategory('all')}
                className={`font-f1 font-bold tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded transition ${
                  activeCategory === 'all' ? 'bg-f1-red text-white' : 'text-f1-gray hover:text-white'
                }`}
              >
                ALL ({counts.all})
              </button>
              <button
                onClick={() => setActiveCategory('web')}
                className={`font-f1 font-bold tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded transition ${
                  activeCategory === 'web' ? 'bg-f1-red text-white' : 'text-f1-gray hover:text-white'
                }`}
              >
                WEB DEV ({counts.web})
              </button>
              <button
                onClick={() => setActiveCategory('photo')}
                className={`font-f1 font-bold tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded transition ${
                  activeCategory === 'photo' ? 'bg-f1-red text-white' : 'text-f1-gray hover:text-white'
                }`}
              >
                FOTO ({counts.photo})
              </button>
              <button
                onClick={() => setActiveCategory('other')}
                className={`font-f1 font-bold tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded transition ${
                  activeCategory === 'other' ? 'bg-f1-red text-white' : 'text-f1-gray hover:text-white'
                }`}
              >
                LAINNYA ({counts.other})
              </button>
            </div>

            {isAdminUnlocked && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="bg-white/5 hover:bg-f1-red border border-white/10 hover:border-f1-red text-white font-f1 font-bold text-xs tracking-wider px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                title="Add New Project"
              >
                <Plus size={14} />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((project) => (
            <article
              key={project.id}
              onClick={() => setActiveProjectModal(project)}
              className="bg-f1-panel border border-white/10 hover:border-f1-red rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer shadow-xl flex flex-col"
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
