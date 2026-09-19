import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectItem, CareerItem, AwardItem } from '../../types/portfolio';
import { X, Upload, Trash2, CheckCircle2, ChevronLeft, ChevronRight, Star, Plus, Loader2, Image as ImageIcon } from 'lucide-react';

export type EditModalType = 'project' | 'career' | 'award' | null;

interface ItemEditModalProps {
  type: EditModalType;
  item: ProjectItem | CareerItem | AwardItem | null;
  onClose: () => void;
}

export const ItemEditModal: React.FC<ItemEditModalProps> = ({ type, item, onClose }) => {
  const {
    addProject,
    updateProject,
    addCareer,
    updateCareer,
    addAward,
    updateAward,
    processCertificateFile,
    uploadImage
  } = usePortfolio();

  // Project state
  const [projectForm, setProjectForm] = useState<Partial<ProjectItem>>(() => {
    if (type === 'project') {
      const proj = item as ProjectItem | null;
      const initialImages = proj?.images && proj.images.length > 0
        ? proj.images
        : (proj?.image ? [proj.image] : []);
      return proj
        ? { ...proj, images: initialImages }
        : {
            id: 'proj_' + Date.now(),
            title: '',
            category: 'web',
            year: new Date().getFullYear().toString(),
            description: '',
            tags: [],
            image: '',
            images: [],
            liveUrl: '',
            githubUrl: '',
            featured: false
          };
    }
    return {};
  });
  const [tagInput, setTagInput] = useState<string>(
    type === 'project' && item ? ((item as ProjectItem).tags || []).join(', ') : ''
  );
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false);

  // Career state
  const [careerForm, setCareerForm] = useState<Partial<CareerItem>>(() => {
    if (type === 'career') {
      return (item as CareerItem) || {
        id: 'car_' + Date.now(),
        year: new Date().getFullYear().toString(),
        role: '',
        team: '',
        description: '',
        points: 'ACTIVE',
        status: 'OPERATIONAL'
      };
    }
    return {};
  });

  // Award state
  const [awardForm, setAwardForm] = useState<Partial<AwardItem>>(() => {
    if (type === 'award') {
      return (item as AwardItem) || {
        id: 'awd_' + Date.now(),
        year: new Date().getFullYear().toString(),
        title: '',
        subtitle: '',
        position: 'P1 GOLD'
      };
    }
    return {};
  });

  if (!type) return null;

  const handleMultipleProjectImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImage(file, 'projects', 1440, 0.85);
        if (url) uploadedUrls.push(url);
      }
      setProjectForm(prev => {
        const currentList = prev.images || (prev.image ? [prev.image] : []);
        const nextList = [...currentList, ...uploadedUrls];
        return {
          ...prev,
          images: nextList,
          image: nextList[0] || ''
        };
      });
    } catch (err) {
      console.error(err);
      alert('Failed to upload project photo.');
    } finally {
      setIsUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setProjectForm(prev => {
      const currentList = prev.images || (prev.image ? [prev.image] : []);
      const nextList = [...currentList, trimmed];
      return {
        ...prev,
        images: nextList,
        image: nextList[0] || ''
      };
    });
    setNewImageUrl('');
  };

  const handleRemoveImage = (idxToRemove: number) => {
    setProjectForm(prev => {
      const currentList = prev.images || [];
      const nextList = currentList.filter((_, idx) => idx !== idxToRemove);
      return {
        ...prev,
        images: nextList,
        image: nextList[0] || ''
      };
    });
  };

  const handleSetPrimaryImage = (idx: number) => {
    setProjectForm(prev => {
      const currentList = [...(prev.images || [])];
      if (idx <= 0 || idx >= currentList.length) return prev;
      const [chosen] = currentList.splice(idx, 1);
      currentList.unshift(chosen);
      return {
        ...prev,
        images: currentList,
        image: currentList[0] || ''
      };
    });
  };

  const handleMoveImage = (idx: number, direction: 'left' | 'right') => {
    setProjectForm(prev => {
      const currentList = [...(prev.images || [])];
      const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= currentList.length) return prev;
      const temp = currentList[idx];
      currentList[idx] = currentList[targetIdx];
      currentList[targetIdx] = temp;
      return {
        ...prev,
        images: currentList,
        image: currentList[0] || ''
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'project') {
      const finalTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      const finalImages =
        projectForm.images && projectForm.images.length > 0
          ? projectForm.images
          : projectForm.image
          ? [projectForm.image]
          : [];
      const updatedProject: ProjectItem = {
        id: projectForm.id || 'proj_' + Date.now(),
        title: projectForm.title || '',
        category: (projectForm.category as 'web' | 'photo' | 'other') || 'web',
        year: projectForm.year || '',
        description: projectForm.description || '',
        tags: finalTags,
        image: finalImages[0] || '',
        images: finalImages,
        liveUrl: projectForm.liveUrl || '',
        githubUrl: projectForm.githubUrl || '',
        featured: !!projectForm.featured
      };
      if (item) updateProject(updatedProject);
      else addProject(updatedProject);
    } else if (type === 'career') {
      const updatedCareer: CareerItem = {
        id: careerForm.id || 'car_' + Date.now(),
        year: careerForm.year || '',
        role: careerForm.role || '',
        team: careerForm.team || '',
        description: careerForm.description || '',
        points: careerForm.points || 'ACTIVE',
        status: careerForm.status || 'OPERATIONAL'
      };
      if (item) updateCareer(updatedCareer);
      else addCareer(updatedCareer);
    } else if (type === 'award') {
      const updatedAward: AwardItem = {
        id: awardForm.id || 'awd_' + Date.now(),
        year: awardForm.year || '',
        title: awardForm.title || '',
        subtitle: awardForm.subtitle || '',
        position: awardForm.position || '1ST PLACE (GOLD)',
        issuer: awardForm.issuer || '',
        category: awardForm.category || '',
        description: awardForm.description || '',
        certificateUrl: awardForm.certificateUrl,
        certificateType: awardForm.certificateType,
        certificateFileName: awardForm.certificateFileName
      };
      if (item) updateAward(updatedAward);
      else addAward(updatedAward);
    }
    onClose();
  };

  const handleAwardFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const processed = await processCertificateFile(file);
      setAwardForm(prev => ({
        ...prev,
        certificateUrl: processed.url,
        certificateType: processed.type,
        certificateFileName: processed.name
      }));
    } catch {
      alert('Failed to process certificate document.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#121218] border border-white/20 rounded-md w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-f1-surface">
          <h3 className="text-xl font-f1 font-black tracking-wider text-white uppercase">
            {item ? (type === 'award' ? 'EDIT CERTIFICATE' : `EDIT ${type.toUpperCase()}`) : (type === 'award' ? '+ ADD CERTIFICATE' : `+ ADD ${type.toUpperCase()}`)}
          </h3>
          <button onClick={onClose} className="text-f1-gray hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans text-xs">
          {/* PROJECT FORM */}
          {type === 'project' && (
            <>
              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">PROJECT TITLE</label>
                <input
                  type="text"
                  required
                  value={projectForm.title || ''}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Geolocation Attendance System"
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">CATEGORY</label>
                  <select
                    value={projectForm.category || 'web'}
                    onChange={e => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3 py-2.5 rounded text-white outline-none"
                  >
                    <option value="web">Web Development</option>
                    <option value="photo">Photography & Visual</option>
                    <option value="other">IT Infrastructure & Support</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">YEAR</label>
                  <input
                    type="text"
                    required
                    value={projectForm.year || ''}
                    onChange={e => setProjectForm({ ...projectForm, year: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">FULL PROJECT DESCRIPTION</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description || ''}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Describe the architecture, key features, and project outcomes..."
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">TAGS (Comma separated)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  placeholder="REACT, TYPESCRIPT, SUPABASE"
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">LIVE DEMO URL</label>
                  <input
                    type="url"
                    value={projectForm.liveUrl || ''}
                    onChange={e => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">GITHUB REPO URL</label>
                  <input
                    type="url"
                    value={projectForm.githubUrl || ''}
                    onChange={e => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
              </div>

              {/* Multi-Photo Project Banner Upload & Management */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-f1 font-bold text-white tracking-wider block flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-f1-red" />
                      <span>PROJECT MEDIA & BANNER GALLERY</span>
                    </label>
                    <span className="text-[11px] text-f1-gray font-sans block mt-0.5">
                      Upload multiple images or paste URLs. Visitors can navigate through them as a banner carousel.
                    </span>
                  </div>
                  <span className="text-[11px] font-f1 font-bold text-white/70 bg-white/10 px-2 py-0.5 rounded">
                    {(projectForm.images?.length || (projectForm.image ? 1 : 0))} PHOTOS
                  </span>
                </div>

                {/* Upload & Add URL controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* File Upload Button (Single or Multiple) */}
                  <label className={`bg-white/10 hover:bg-white/15 border border-white/15 text-white font-f1 font-bold px-3 py-2.5 rounded flex items-center justify-center gap-2 cursor-pointer transition text-xs ${isUploadingImages ? 'opacity-50 pointer-events-none' : ''}`}>
                    {isUploadingImages ? (
                      <>
                        <Loader2 size={15} className="animate-spin text-f1-red" />
                        <span>UPLOADING MEDIA...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={15} className="text-f1-red" />
                        <span>+ SELECT PHOTOS (MULTI-SELECT)</span>
                      </>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleProjectImagesUpload}
                      disabled={isUploadingImages}
                      className="hidden"
                    />
                  </label>

                  {/* Add Image by URL */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={e => setNewImageUrl(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      placeholder="Or paste image URL here..."
                      className="flex-1 bg-[#181822] border border-white/10 focus:border-f1-red px-3 py-2 rounded text-white text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      disabled={!newImageUrl.trim()}
                      className="bg-white/10 hover:bg-f1-red disabled:opacity-30 disabled:hover:bg-white/10 text-white font-f1 font-bold px-3 py-2 rounded transition flex items-center gap-1 flex-shrink-0"
                      title="Add photo from URL"
                    >
                      <Plus size={14} />
                      <span>ADD</span>
                    </button>
                  </div>
                </div>

                {/* Photos List / Grid */}
                {(projectForm.images && projectForm.images.length > 0) ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-2 bg-black/40 border border-white/10 rounded">
                    {projectForm.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded border overflow-hidden group bg-[#161622] flex flex-col ${
                          idx === 0 ? 'border-f1-red shadow-md shadow-f1-red/10 ring-1 ring-f1-red/50' : 'border-white/10'
                        }`}
                      >
                        {/* Thumbnail Image */}
                        <div className="aspect-[16/10] w-full overflow-hidden relative bg-black/60">
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Badge Slide / Primary */}
                          <div className="absolute top-1 left-1 flex items-center gap-1">
                            {idx === 0 ? (
                              <span className="bg-f1-red text-white text-[9px] font-f1 font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-0.5">
                                <Star size={9} fill="currentColor" />
                                PRIMARY
                              </span>
                            ) : (
                              <span className="bg-black/70 text-white/80 text-[9px] font-f1 font-bold px-1.5 py-0.5 rounded-sm">
                                #{idx + 1}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Controls Toolbar */}
                        <div className="p-1.5 bg-[#12121a] flex items-center justify-between gap-1 border-t border-white/5">
                          <div className="flex items-center gap-1">
                            {/* Move Left / Prev */}
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'left')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-white/5 hover:bg-white/20 disabled:opacity-20 text-white transition"
                              title="Move left"
                            >
                              <ChevronLeft size={13} />
                            </button>
                            {/* Move Right / Next */}
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'right')}
                              disabled={idx === (projectForm.images?.length || 0) - 1}
                              className="p-1 rounded bg-white/5 hover:bg-white/20 disabled:opacity-20 text-white transition"
                              title="Move right"
                            >
                              <ChevronRight size={13} />
                            </button>
                            {/* Make Primary button (if not already index 0) */}
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                className="px-1.5 py-0.5 text-[9px] font-f1 font-bold rounded bg-white/10 hover:bg-f1-red text-white transition"
                                title="Set as primary banner"
                              >
                                PRIMARY
                              </button>
                            )}
                          </div>

                          {/* Delete Photo Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded bg-red-950/40 hover:bg-f1-red text-white transition"
                            title="Remove photo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-white/5 border border-dashed border-white/15 rounded text-center text-f1-gray text-xs">
                    No photos added yet. Upload files or enter image URLs above.
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white font-f1 tracking-wider">
                  <input
                    type="checkbox"
                    checked={!!projectForm.featured}
                    onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="rounded text-f1-red"
                  />
                  <span>Mark as Featured Project (wide 2-column showcase highlight)</span>
                </label>
              </div>
            </>
          )}

          {/* CAREER FORM */}
          {type === 'career' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">TIMELINE / PERIOD</label>
                  <input
                    type="text"
                    required
                    value={careerForm.year || ''}
                    onChange={e => setCareerForm({ ...careerForm, year: e.target.value })}
                    placeholder="e.g. 2023—2025"
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">KEY STATUS / KPI</label>
                  <input
                    type="text"
                    value={careerForm.points || ''}
                    onChange={e => setCareerForm({ ...careerForm, points: e.target.value })}
                    placeholder="e.g. 99.4% Uptime / P1 Project"
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">ROLE / POSITION</label>
                <input
                  type="text"
                  required
                  value={careerForm.role || ''}
                  onChange={e => setCareerForm({ ...careerForm, role: e.target.value })}
                  placeholder="e.g. IT Support & Systems Specialist"
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">ORGANIZATION / TEAM</label>
                <input
                  type="text"
                  required
                  value={careerForm.team || ''}
                  onChange={e => setCareerForm({ ...careerForm, team: e.target.value })}
                  placeholder="e.g. SPS TPQ Al Ikhlas"
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">RESPONSIBILITIES & DELIVERABLES</label>
                <textarea
                  rows={3}
                  required
                  value={careerForm.description || ''}
                  onChange={e => setCareerForm({ ...careerForm, description: e.target.value })}
                  placeholder="Detail your responsibilities, infrastructure management, and key impact..."
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>
            </>
          )}

          {/* AWARD FORM */}
          {type === 'award' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">YEAR</label>
                  <input
                    type="text"
                    required
                    value={awardForm.year || ''}
                    onChange={e => setAwardForm({ ...awardForm, year: e.target.value })}
                    placeholder="e.g. 2023"
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">STANDING / AWARD LEVEL</label>
                  <input
                    type="text"
                    required
                    value={awardForm.position || ''}
                    onChange={e => setAwardForm({ ...awardForm, position: e.target.value })}
                    placeholder="e.g. 1ST PLACE GOLD / CERTIFIED"
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">CERTIFICATE TITLE</label>
                <input
                  type="text"
                  required
                  value={awardForm.title || ''}
                  onChange={e => setAwardForm({ ...awardForm, title: e.target.value })}
                  placeholder="e.g. 1st Place Gold Medalist - Paku Bumi Open..."
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">ISSUING BODY / ORGANIZER</label>
                  <input
                    type="text"
                    value={awardForm.issuer || ''}
                    onChange={e => setAwardForm({ ...awardForm, issuer: e.target.value })}
                    placeholder="e.g. IPSI Central Java"
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">CLASSIFICATION / LEVEL</label>
                  <input
                    type="text"
                    value={awardForm.category || ''}
                    onChange={e => setAwardForm({ ...awardForm, category: e.target.value })}
                    placeholder="e.g. International Championship"
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">SUBTITLE / CITATION</label>
                <input
                  type="text"
                  required
                  value={awardForm.subtitle || ''}
                  onChange={e => setAwardForm({ ...awardForm, subtitle: e.target.value })}
                  placeholder="e.g. International Martial Arts Championship"
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">FULL CERTIFICATE DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={awardForm.description || ''}
                  onChange={e => setAwardForm({ ...awardForm, description: e.target.value })}
                  placeholder="Detail the championship history, competitive skills, and milestones..."
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none font-sans"
                />
              </div>

              {/* Upload Certificate Document (PDF / JPG / PNG) */}
              <div className="space-y-2 p-3.5 bg-white/5 border border-white/10 rounded">
                <div className="flex items-center justify-between">
                  <label className="font-f1 font-bold text-white tracking-wider block">
                    CERTIFICATE ATTACHMENT (PDF / JPG / PNG)
                  </label>
                  {awardForm.certificateUrl && (
                    <span className="text-[10px] text-[#00ff66] font-mono flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      ATTACHED ({awardForm.certificateType === 'pdf' ? 'PDF' : 'IMAGE'})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 bg-white/10 hover:bg-white/20 text-white font-f1 font-bold px-3 py-2 rounded flex items-center justify-center gap-2 cursor-pointer transition text-xs">
                    <Upload size={14} />
                    <span>{awardForm.certificateUrl ? 'REPLACE CERTIFICATE FILE (PDF / JPG)' : 'CHOOSE CERTIFICATE FILE (PDF / JPG)'}</span>
                    <input
                      type="file"
                      accept=".pdf,image/jpeg,image/png,image/webp"
                      onChange={handleAwardFileChange}
                      className="hidden"
                    />
                  </label>

                  {awardForm.certificateUrl && (
                    <button
                      type="button"
                      onClick={() => setAwardForm(prev => ({
                        ...prev,
                        certificateUrl: undefined,
                        certificateType: undefined,
                        certificateFileName: undefined
                      }))}
                      className="p-2 bg-red-950/40 hover:bg-f1-red text-white rounded transition"
                      title="Remove file"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                {awardForm.certificateFileName && (
                  <span className="text-[11px] text-f1-gray font-mono block truncate">
                    File: {awardForm.certificateFileName}
                  </span>
                )}
              </div>
            </>
          )}

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-white/20 text-white hover:bg-white/5 rounded font-f1 font-bold tracking-wider"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-f1-red hover:bg-f1-darkRed text-white rounded font-f1 font-bold tracking-widest transition"
            >
              SAVE CHANGES ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
