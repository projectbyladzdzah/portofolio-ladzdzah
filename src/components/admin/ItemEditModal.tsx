import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectItem, CareerItem, AwardItem } from '../../types/portfolio';
import { X, Upload, Trash2, CheckCircle2 } from 'lucide-react';

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
      return (item as ProjectItem) || {
        id: 'proj_' + Date.now(),
        title: '',
        category: 'web',
        year: new Date().getFullYear().toString(),
        description: '',
        tags: [],
        image: '',
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

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, 'projects', 1200, 0.85);
      setProjectForm(prev => ({ ...prev, image: url }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'project') {
      const finalTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      const updatedProject: ProjectItem = {
        id: projectForm.id || 'proj_' + Date.now(),
        title: projectForm.title || '',
        category: (projectForm.category as 'web' | 'photo' | 'other') || 'web',
        year: projectForm.year || '',
        description: projectForm.description || '',
        tags: finalTags,
        image: projectForm.image || '',
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
      alert('Gagal memproses file sertifikat.');
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
            {item ? (type === 'award' ? 'EDIT SERTIFIKAT' : `EDIT ${type.toUpperCase()}`) : (type === 'award' ? '+ TAMBAH SERTIFIKAT' : `+ TAMBAH ${type.toUpperCase()}`)}
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
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">JUDUL PROYEK</label>
                <input
                  type="text"
                  required
                  value={projectForm.title || ''}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Website Presensi Pegawai"
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">KATEGORI</label>
                  <select
                    value={projectForm.category || 'web'}
                    onChange={e => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3 py-2.5 rounded text-white outline-none"
                  >
                    <option value="web">Web Developer</option>
                    <option value="photo">Fotografer / Visual</option>
                    <option value="other">Lainnya / IT Support</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">TAHUN</label>
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
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">DESKRIPSI LENGKAP</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description || ''}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Deskripsikan fitur dan pencapaian proyek..."
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">TAGS (Pisahkan koma)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  placeholder="WEB, INTERNAL SYSTEM, SQL"
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
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">GITHUB URL</label>
                  <input
                    type="url"
                    value={projectForm.githubUrl || ''}
                    onChange={e => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">GAMBAR PROYEK</label>
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded">
                  {projectForm.image ? (
                    <img src={projectForm.image} alt="Preview" className="w-16 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-12 bg-black/40 rounded flex items-center justify-center text-[10px] text-f1-gray">
                      NO IMG
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProjectImageUpload}
                      className="text-xs text-f1-gray file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-f1-red file:text-white file:text-xs"
                    />
                    <input
                      type="text"
                      value={projectForm.image || ''}
                      onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                      placeholder="Atau masukkan URL gambar..."
                      className="w-full bg-[#181822] border border-white/10 px-2.5 py-1.5 rounded text-white text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white font-f1 tracking-wider">
                  <input
                    type="checkbox"
                    checked={!!projectForm.featured}
                    onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="rounded text-f1-red"
                  />
                  <span>Tandai sebagai Featured Project (tampilan 2 kolom lebar)</span>
                </label>
              </div>
            </>
          )}

          {/* CAREER FORM */}
          {type === 'career' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">TAHUN / PERIODE</label>
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
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">STATUS / RATING</label>
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
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">PERAN / POSISI</label>
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
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">INSTITUSI / TIM</label>
                <input
                  type="text"
                  required
                  value={careerForm.team || ''}
                  onChange={e => setCareerForm({ ...careerForm, team: e.target.value })}
                  placeholder="e.g. Lembaga Pendidikan SPS TPQ Al Ikhlas"
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">DESKRIPSI TUGAS</label>
                <textarea
                  rows={3}
                  required
                  value={careerForm.description || ''}
                  onChange={e => setCareerForm({ ...careerForm, description: e.target.value })}
                  placeholder="Jelaskan kontribusi Anda..."
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
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">TAHUN</label>
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
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">POSISI / LEVEL</label>
                  <input
                    type="text"
                    required
                    value={awardForm.position || ''}
                    onChange={e => setAwardForm({ ...awardForm, position: e.target.value })}
                    placeholder="e.g. P1 GOLD / CERTIFIED"
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">NAMA SERTIFIKAT</label>
                <input
                  type="text"
                  required
                  value={awardForm.title || ''}
                  onChange={e => setAwardForm({ ...awardForm, title: e.target.value })}
                  placeholder="e.g. Juara 1 Indonesia Paku Bumi Open..."
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">LEMBAGA / PENYELENGGARA</label>
                  <input
                    type="text"
                    value={awardForm.issuer || ''}
                    onChange={e => setAwardForm({ ...awardForm, issuer: e.target.value })}
                    placeholder="e.g. IPSI Jawa Tengah"
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block">KATEGORI / TINGKAT</label>
                  <input
                    type="text"
                    value={awardForm.category || ''}
                    onChange={e => setAwardForm({ ...awardForm, category: e.target.value })}
                    placeholder="e.g. Kejuaraan Internasional"
                    className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">SUBTITLE / KETERANGAN SINGKAT</label>
                <input
                  type="text"
                  required
                  value={awardForm.subtitle || ''}
                  onChange={e => setAwardForm({ ...awardForm, subtitle: e.target.value })}
                  placeholder="e.g. Kejuaraan Pencak Silat Internasional"
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block">PENJELASAN LENGKAP SERTIFIKAT</label>
                <textarea
                  rows={3}
                  value={awardForm.description || ''}
                  onChange={e => setAwardForm({ ...awardForm, description: e.target.value })}
                  placeholder="Ceritakan detail kejuaraan, dedikasi, dan pencapaian medali..."
                  className="w-full bg-[#181822] border border-white/10 focus:border-f1-red px-3.5 py-2.5 rounded text-white outline-none font-sans"
                />
              </div>

              {/* Upload Certificate Document (PDF / JPG / PNG) */}
              <div className="space-y-2 p-3.5 bg-white/5 border border-white/10 rounded">
                <div className="flex items-center justify-between">
                  <label className="font-f1 font-bold text-white tracking-wider block">
                    FILE SERTIFIKAT (PDF / JPG / PNG)
                  </label>
                  {awardForm.certificateUrl && (
                    <span className="text-[10px] text-[#00ff66] font-mono flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      TERPASANG ({awardForm.certificateType === 'pdf' ? 'PDF' : 'GAMBAR'})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 bg-white/10 hover:bg-white/20 text-white font-f1 font-bold px-3 py-2 rounded flex items-center justify-center gap-2 cursor-pointer transition text-xs">
                    <Upload size={14} />
                    <span>{awardForm.certificateUrl ? 'GANTI FILE SERTIFIKAT (PDF / JPG)' : 'PILIH FILE SERTIFIKAT (PDF / JPG)'}</span>
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
                      title="Hapus File"
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
              BATAL
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-f1-red hover:bg-f1-darkRed text-white rounded font-f1 font-bold tracking-widest transition"
            >
              SIMPAN DATA ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
