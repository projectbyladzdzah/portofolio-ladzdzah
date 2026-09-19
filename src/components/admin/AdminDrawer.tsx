import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ItemEditModal, EditModalType } from './ItemEditModal';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  LogOut,
  Database,
  Gauge,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { BiographyGalleryItem } from '../../types/portfolio';

export const AdminDrawer: React.FC = () => {
  const {
    data,
    updateHero,
    updateBiography,
    updateTicker,
    deleteProject,
    deleteCareer,
    deleteAward,
    updateContact,
    resetToDefaults,
    exportJSON,
    importJSON,
    isAdminOpen,
    setIsAdminOpen,
    logoutAdmin,
    cloudStatus,
    showToast,
    uploadImage
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'hero' | 'bio' | 'projects' | 'career' | 'ticker' | 'awards' | 'contact' | 'backup'>('hero');

  // Modal for editing project, career, or award
  const [modalType, setModalType] = useState<EditModalType>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [heroForm, setHeroForm] = useState(data.hero);
  const [bioForm, setBioForm] = useState(data.biography);
  const [bioSkillsInput, setBioSkillsInput] = useState((data.biography.skills || []).join(', '));
  const [tickerInput, setTickerInput] = useState((data.ticker || []).join(', '));
  const [contactForm, setContactForm] = useState(data.contact);

  // Keep forms synced when data changes externally (e.g. on reset or import)
  React.useEffect(() => {
    setHeroForm(data.hero);
    setBioForm(data.biography);
    setBioSkillsInput((data.biography.skills || []).join(', '));
    setTickerInput((data.ticker || []).join(', '));
    setContactForm(data.contact);
  }, [data]);

  if (!isAdminOpen) return null;

  const handleDriverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Mengunggah portrait ke Supabase Storage...', 'warning');
      const url = await uploadImage(file, 'portraits', 800, 0.88);
      setHeroForm(prev => ({ ...prev, photo: url }));
      showToast('Foto portrait tersimpan di Supabase Storage!', 'success');
    } catch {
      showToast('Gagal memproses gambar', 'error');
    }
  };

  const [newMobileBannerUrl, setNewMobileBannerUrl] = useState('');

  const handleDriverMobileBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Mengunggah banner mobile ke Supabase Storage...', 'warning');
      const url = await uploadImage(file, 'banners', 1440, 0.9);
      const currentMobileBanners = heroForm.mobileBanners && heroForm.mobileBanners.length > 0
        ? [...heroForm.mobileBanners]
        : [heroForm.mobileBanner || 'assets/driver-f1-banner-mobile.png'];
      const updatedMobileBanners = [...currentMobileBanners, url];
      const updated = {
        ...heroForm,
        mobileBanner: updatedMobileBanners[0],
        mobileBanners: updatedMobileBanners
      };
      setHeroForm(updated);
      updateHero(updated);
      showToast('Banner mobile tersimpan di Supabase Storage & ditambahkan ke slider!', 'success');
      e.target.value = '';
    } catch {
      showToast('Gagal memproses banner mobile', 'error');
    }
  };

  const handleRemoveMobileBanner = (indexToRemove: number) => {
    const currentMobileBanners = heroForm.mobileBanners && heroForm.mobileBanners.length > 0
      ? [...heroForm.mobileBanners]
      : [heroForm.mobileBanner || 'assets/driver-f1-banner-mobile.png'];
    if (currentMobileBanners.length <= 1) {
      showToast('Minimal harus ada 1 banner mobile.', 'warning');
      return;
    }
    const updatedMobileBanners = currentMobileBanners.filter((_, idx) => idx !== indexToRemove);
    const updated = {
      ...heroForm,
      mobileBanner: updatedMobileBanners[0],
      mobileBanners: updatedMobileBanners
    };
    setHeroForm(updated);
    updateHero(updated);
    showToast('Banner mobile berhasil dihapus.', 'success');
  };

  const handleMoveMobileBanner = (index: number, direction: 'up' | 'down') => {
    const currentMobileBanners = heroForm.mobileBanners && heroForm.mobileBanners.length > 0
      ? [...heroForm.mobileBanners]
      : [heroForm.mobileBanner || 'assets/driver-f1-banner-mobile.png'];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentMobileBanners.length) return;
    const reordered = [...currentMobileBanners];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    const updated = {
      ...heroForm,
      mobileBanner: reordered[0],
      mobileBanners: reordered
    };
    setHeroForm(updated);
    updateHero(updated);
    showToast('Urutan banner mobile diperbarui.', 'success');
  };

  const handleAddMobileBannerUrl = () => {
    if (!newMobileBannerUrl.trim()) return;
    const currentMobileBanners = heroForm.mobileBanners && heroForm.mobileBanners.length > 0
      ? [...heroForm.mobileBanners]
      : [heroForm.mobileBanner || 'assets/driver-f1-banner-mobile.png'];
    const updatedMobileBanners = [...currentMobileBanners, newMobileBannerUrl.trim()];
    const updated = {
      ...heroForm,
      mobileBanner: updatedMobileBanners[0],
      mobileBanners: updatedMobileBanners
    };
    setHeroForm(updated);
    updateHero(updated);
    setNewMobileBannerUrl('');
    showToast('Banner mobile baru ditambahkan ke slider!', 'success');
  };

  const [newBannerUrl, setNewBannerUrl] = useState('');

  const handleDriverBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Mengunggah banner ke Supabase Storage...', 'warning');
      const url = await uploadImage(file, 'banners', 1920, 0.88);
      const currentBanners = heroForm.banners && heroForm.banners.length > 0
        ? [...heroForm.banners]
        : [heroForm.banner || 'assets/driver-f1-banner.webp'];
      const updatedBanners = [...currentBanners, url];
      const updated = {
        ...heroForm,
        banner: updatedBanners[0],
        banners: updatedBanners
      };
      setHeroForm(updated);
      updateHero(updated);
      showToast('Foto banner tersimpan di Supabase Storage & ditambahkan ke slider!', 'success');
      e.target.value = '';
    } catch {
      showToast('Gagal memproses gambar banner', 'error');
    }
  };

  const handleRemoveBanner = (indexToRemove: number) => {
    const currentBanners = heroForm.banners && heroForm.banners.length > 0
      ? [...heroForm.banners]
      : [heroForm.banner || 'assets/driver-f1-banner.webp'];
    if (currentBanners.length <= 1) {
      showToast('Minimal harus ada 1 banner.', 'warning');
      return;
    }
    const updatedBanners = currentBanners.filter((_, idx) => idx !== indexToRemove);
    const updated = {
      ...heroForm,
      banner: updatedBanners[0],
      banners: updatedBanners
    };
    setHeroForm(updated);
    updateHero(updated);
    showToast('Banner berhasil dihapus.', 'success');
  };

  const handleMoveBanner = (index: number, direction: 'up' | 'down') => {
    const currentBanners = heroForm.banners && heroForm.banners.length > 0
      ? [...heroForm.banners]
      : [heroForm.banner || 'assets/driver-f1-banner.webp'];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentBanners.length) return;
    const reordered = [...currentBanners];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    const updated = {
      ...heroForm,
      banner: reordered[0],
      banners: reordered
    };
    setHeroForm(updated);
    updateHero(updated);
    showToast('Urutan banner diperbarui.', 'success');
  };

  const handleAddBannerUrl = () => {
    if (!newBannerUrl.trim()) return;
    const currentBanners = heroForm.banners && heroForm.banners.length > 0
      ? [...heroForm.banners]
      : [heroForm.banner || 'assets/driver-f1-banner.webp'];
    const updatedBanners = [...currentBanners, newBannerUrl.trim()];
    const updated = {
      ...heroForm,
      banner: updatedBanners[0],
      banners: updatedBanners
    };
    setHeroForm(updated);
    updateHero(updated);
    setNewBannerUrl('');
    showToast('Banner baru ditambahkan ke slider!', 'success');
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(heroForm);
  };

  const handleBioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = bioSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    updateBiography({ ...bioForm, skills });
  };

  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sIdx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('Mengunggah foto story...', 'warning');
        const url = await uploadImage(file, 'banners', 1200, 0.88);
        const updated = [...(bioForm.gallery || [])];
        updated[sIdx].image = url;
        setBioForm({ ...bioForm, gallery: updated });
        showToast('Foto story berhasil diunggah & diterapkan!', 'success');
      } catch {
        showToast('Gagal memproses unggahan gambar story.', 'error');
      }
    }
  };

  const handleAddStoryItem = () => {
    const newStory: BiographyGalleryItem = {
      id: `story_${Date.now()}`,
      image: 'assets/driver-f1-banner.webp',
      title: 'Momen Dokumentasi Baru',
      caption: 'Deskripsi dokumentasi / implementasi proyek dan sistem.',
      location: 'Surakarta, Indonesia',
      timestamp: 'Field Milestone • ' + new Date().getFullYear()
    };
    const updated = [...(bioForm.gallery || []), newStory];
    setBioForm({ ...bioForm, gallery: updated });
    showToast('Story foto baru ditambahkan!', 'success');
  };

  const handleDeleteStoryItem = (sIdx: number) => {
    const updated = (bioForm.gallery || []).filter((_, i) => i !== sIdx);
    setBioForm({ ...bioForm, gallery: updated });
    showToast('Foto story berhasil dihapus!', 'warning');
  };

  const handleMakeStoryCover = (sIdx: number) => {
    if (sIdx === 0) return;
    const current = [...(bioForm.gallery || [])];
    const item = current.splice(sIdx, 1)[0];
    current.unshift(item);
    setBioForm({ ...bioForm, gallery: current });
    showToast('Foto dijadikan cover utama kartu biografi!', 'success');
  };

  const handleMoveStory = (sIdx: number, direction: 'up' | 'down') => {
    const current = [...(bioForm.gallery || [])];
    const targetIdx = direction === 'up' ? sIdx - 1 : sIdx + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[sIdx];
    current[sIdx] = current[targetIdx];
    current[targetIdx] = temp;
    setBioForm({ ...bioForm, gallery: current });
  };

  const handleTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticker = tickerInput.split(',').map(s => s.trim()).filter(Boolean);
    updateTicker(ticker);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContact(contactForm);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const str = ev.target?.result as string;
      importJSON(str);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddTelemetryBar = () => {
    const current = heroForm.telemetryBars || [];
    setHeroForm({
      ...heroForm,
      telemetryBars: [...current, { label: 'NEW COMPETENCY', percent: 85 }]
    });
  };

  const handleRemoveTelemetryBar = (index: number) => {
    const current = heroForm.telemetryBars || [];
    setHeroForm({
      ...heroForm,
      telemetryBars: current.filter((_, i) => i !== index)
    });
  };

  const handleTelemetryBarChange = (index: number, field: 'label' | 'percent', val: any) => {
    const current = [...(heroForm.telemetryBars || [])];
    current[index] = {
      ...current[index],
      [field]: field === 'percent' ? Math.max(0, Math.min(100, Number(val) || 0)) : val
    };
    setHeroForm({ ...heroForm, telemetryBars: current });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAdminOpen(false)}
      >
        <aside
          className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-[#0e0e13] border-l border-white/20 z-50 flex flex-col shadow-2xl text-white font-sans"
          onClick={e => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-f1-surface">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-f1 font-bold tracking-widest text-f1-red uppercase block">
                  PORTFOLIO ADMIN CMS
                </span>
                <span className="text-[9px] font-f1 font-bold px-2 py-0.5 rounded-full border border-white/10 bg-black/40 flex items-center gap-1.5">
                  <Database size={10} className={cloudStatus === 'connected' ? 'text-[#00ff66]' : 'text-f1-yellow'} />
                  <span className={cloudStatus === 'connected' ? 'text-[#00ff66]' : 'text-f1-yellow'}>
                    {cloudStatus === 'connected' ? 'SUPABASE CLOUD' : cloudStatus === 'offline' ? 'OFFLINE CACHE' : 'LOCAL STORAGE'}
                  </span>
                </span>
              </div>
              <h2 className="text-xl font-f1 font-black tracking-wider text-white">
                CONTROL ROOM <span>v3.0</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={logoutAdmin}
                title="Keluar / Logout Admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/40 hover:bg-f1-red text-white text-xs font-f1 font-bold border border-red-500/20 transition"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
              <button
                onClick={() => setIsAdminOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded text-f1-gray hover:text-white transition"
                aria-label="Tutup Panel"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto bg-[#13131a] border-b border-white/10 text-xs font-f1 font-bold tracking-wider px-4">
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition ${
                activeTab === 'hero' ? 'border-f1-red text-white bg-white/5' : 'border-transparent text-f1-gray hover:text-white'
              }`}
            >
              🏁 HERO PROFILE
            </button>
            <button
              onClick={() => setActiveTab('bio')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition ${
                activeTab === 'bio' ? 'border-f1-red text-white bg-white/5' : 'border-transparent text-f1-gray hover:text-white'
              }`}
            >
              👤 BIOGRAPHY
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition ${
                activeTab === 'projects' ? 'border-f1-red text-white bg-white/5' : 'border-transparent text-f1-gray hover:text-white'
              }`}
            >
              💻 PROJECTS ({data.projects.length})
            </button>
            <button
              onClick={() => setActiveTab('career')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition ${
                activeTab === 'career' ? 'border-f1-red text-white bg-white/5' : 'border-transparent text-f1-gray hover:text-white'
              }`}
            >
              ⏱️ EXPERIENCE ({data.career.length})
            </button>
            <button
              onClick={() => setActiveTab('ticker')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition ${
                activeTab === 'ticker' ? 'border-f1-red text-white bg-white/5' : 'border-transparent text-f1-gray hover:text-white'
              }`}
            >
              📊 TICKER
            </button>
            <button
              onClick={() => setActiveTab('awards')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition ${
                activeTab === 'awards' ? 'border-f1-red text-white bg-white/5' : 'border-transparent text-f1-gray hover:text-white'
              }`}
            >
              🏆 AWARDS ({data.awards.length})
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition ${
                activeTab === 'contact' ? 'border-f1-red text-white bg-white/5' : 'border-transparent text-f1-gray hover:text-white'
              }`}
            >
              📡 CONTACT
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition ${
                activeTab === 'backup' ? 'border-f1-red text-white bg-white/5' : 'border-transparent text-f1-gray hover:text-white'
              }`}
            >
              💾 BACKUP & SYSTEM
            </button>
          </div>

          {/* Tab Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: HERO & DRIVER */}
            {activeTab === 'hero' && (
              <form onSubmit={handleHeroSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">BADGE / ID NUMBER</label>
                    <input
                      type="text"
                      value={heroForm.number}
                      onChange={e => setHeroForm({ ...heroForm, number: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">FLAG EMOJI</label>
                    <input
                      type="text"
                      value={heroForm.flagEmoji}
                      onChange={e => setHeroForm({ ...heroForm, flagEmoji: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">COUNTRY</label>
                    <input
                      type="text"
                      value={heroForm.country}
                      onChange={e => setHeroForm({ ...heroForm, country: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">FIRST NAME</label>
                    <input
                      type="text"
                      value={heroForm.firstName}
                      onChange={e => setHeroForm({ ...heroForm, firstName: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white uppercase font-f1 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">LAST NAME / ROLE</label>
                    <input
                      type="text"
                      value={heroForm.lastName}
                      onChange={e => setHeroForm({ ...heroForm, lastName: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white uppercase font-f1 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">TEAM NAME BADGE</label>
                  <input
                    type="text"
                    value={heroForm.team}
                    onChange={e => setHeroForm({ ...heroForm, team: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white uppercase font-f1 font-bold"
                  />
                </div>

                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">ROLE / SUBTITLE</label>
                  <input
                    type="text"
                    value={heroForm.role}
                    onChange={e => setHeroForm({ ...heroForm, role: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white uppercase"
                  />
                </div>

                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">PROFESSIONAL MOTTO / QUOTE</label>
                  <textarea
                    rows={2}
                    value={heroForm.quote}
                    onChange={e => setHeroForm({ ...heroForm, quote: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                  />
                </div>

                {/* Dedicated Mobile Banner Slider (Multi-Banner) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <label className="font-f1 font-bold text-white tracking-wider block text-xs">
                        BANNER KHUSUS MOBILE (HP SLIDER)
                      </label>
                      <span className="text-[9px] bg-f1-red text-white font-f1 font-black px-1.5 py-0.2 rounded uppercase">
                        Mobile Slider
                      </span>
                    </div>
                    <span className="text-[9px] bg-f1-red text-white px-1.5 py-0.2 rounded font-f1 font-bold">
                      {((heroForm.mobileBanners && heroForm.mobileBanners.length > 0) ? heroForm.mobileBanners : [heroForm.mobileBanner || 'assets/driver-f1-banner-mobile.png']).length} Banner
                    </span>
                  </div>
                  <span className="text-[10px] text-f1-lightGray block font-sans mb-1.5">
                    Banner rasio potret khusus smartphone (disarankan 4:5 atau 1080x1350 px). Dapat digeser di HP.
                  </span>

                  <div className="space-y-3 p-3 bg-f1-red/5 border border-f1-red/30 rounded">
                    {/* Mobile banners list */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {((heroForm.mobileBanners && heroForm.mobileBanners.length > 0) ? heroForm.mobileBanners : [heroForm.mobileBanner || 'assets/driver-f1-banner-mobile.png']).map((mUrl, mIdx, arr) => (
                        <div key={mIdx} className="bg-[#12121a] border border-white/10 p-2 rounded flex items-center gap-2.5">
                          <div className="w-12 h-16 rounded overflow-hidden border border-white/15 shrink-0 bg-black relative">
                            <img
                              src={mUrl}
                              alt={`Mobile Banner ${mIdx + 1}`}
                              onError={(e) => {
                                if (!e.currentTarget.src.includes('driver-f1-banner.webp')) {
                                  e.currentTarget.src = 'assets/driver-f1-banner.webp';
                                }
                              }}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-0.5 left-0.5 bg-black/80 text-[8px] font-f1 font-black text-f1-red px-1 rounded">
                              #{mIdx + 1}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-f1 font-bold text-white block uppercase truncate">
                              {mIdx === 0 ? '★ Banner Awal (#1)' : `Slide #${mIdx + 1}`}
                            </span>
                            <span className="text-[9px] text-f1-gray block truncate font-mono">
                              {mUrl}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={mIdx === 0}
                              onClick={() => handleMoveMobileBanner(mIdx, 'up')}
                              className="p-1 rounded bg-white/5 hover:bg-white/15 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                              title="Pindah ke Atas"
                            >
                              <ChevronUp size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={mIdx === arr.length - 1}
                              onClick={() => handleMoveMobileBanner(mIdx, 'down')}
                              className="p-1 rounded bg-white/5 hover:bg-white/15 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                              title="Pindah ke Bawah"
                            >
                              <ChevronDown size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveMobileBanner(mIdx)}
                              className="p-1 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition"
                              title="Hapus Banner Mobile"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add new mobile banner */}
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <label className="text-[10px] font-f1 font-bold text-f1-gray tracking-wider uppercase block">
                        + Tambah Banner Mobile
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDriverMobileBannerUpload}
                        className="text-xs text-f1-gray file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-f1-red file:text-white file:text-xs w-full"
                      />
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={newMobileBannerUrl}
                          onChange={e => setNewMobileBannerUrl(e.target.value)}
                          placeholder="Atau masukkan URL banner..."
                          className="flex-1 bg-[#181822] border border-white/10 px-2.5 py-1 rounded text-white text-xs outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddMobileBannerUrl}
                          className="bg-f1-red hover:bg-f1-darkRed text-white px-2.5 py-1 rounded text-xs font-f1 font-bold transition whitespace-nowrap"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">PROFILE PHOTO / AVATAR</label>
                  <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded">
                    <img
                      src={heroForm.photo || 'assets/driver-portrait.png'}
                      alt="Preview"
                      className="w-12 h-16 object-cover rounded border border-white/20"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDriverPhotoUpload}
                        className="text-xs text-f1-gray file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-f1-red file:text-white file:text-xs"
                      />
                      <input
                        type="text"
                        value={heroForm.photo}
                        onChange={e => setHeroForm({ ...heroForm, photo: e.target.value })}
                        placeholder="Atau URL gambar portrait..."
                        className="w-full bg-[#181822] border border-white/10 px-2.5 py-1 rounded text-white text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Widescreen Banners Slider Upload */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block">
                      WIDESCREEN HERO BANNERS (MULTI-BANNER)
                    </label>
                    <span className="text-[9px] bg-f1-red/20 text-f1-red border border-f1-red/40 px-1.5 py-0.2 rounded font-f1 font-bold">
                      {((heroForm.banners && heroForm.banners.length > 0) ? heroForm.banners : [heroForm.banner || 'assets/driver-f1-banner.webp']).length} Banner
                    </span>
                  </div>

                  <div className="space-y-3 p-3 bg-white/5 border border-white/10 rounded">
                    {/* Banners list */}
                    <div className="space-y-2">
                      {((heroForm.banners && heroForm.banners.length > 0) ? heroForm.banners : [heroForm.banner || 'assets/driver-f1-banner.webp']).map((bannerUrl, bIdx, arr) => (
                        <div key={bIdx} className="bg-[#12121a] border border-white/10 p-2 rounded flex items-center gap-2.5">
                          <div className="w-20 aspect-[21/8] rounded overflow-hidden border border-white/15 shrink-0 bg-black relative">
                            <img
                              src={bannerUrl}
                              alt={`Banner ${bIdx + 1}`}
                              onError={(e) => {
                                if (!e.currentTarget.src.includes('driver-f1-banner.webp')) {
                                  e.currentTarget.src = 'assets/driver-f1-banner.webp';
                                }
                              }}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-0.5 left-0.5 bg-black/80 text-[8px] font-f1 font-black text-f1-red px-1 rounded">
                              #{bIdx + 1}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-f1 font-bold text-white block uppercase truncate">
                              {bIdx === 0 ? '★ Utama' : `Slide #${bIdx + 1}`}
                            </span>
                            <span className="text-[9px] text-f1-gray block truncate font-mono">
                              {bannerUrl}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={bIdx === 0}
                              onClick={() => handleMoveBanner(bIdx, 'up')}
                              className="p-1 rounded bg-white/5 hover:bg-white/15 text-white disabled:opacity-30"
                              title="Ke Atas"
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={bIdx === arr.length - 1}
                              onClick={() => handleMoveBanner(bIdx, 'down')}
                              className="p-1 rounded bg-white/5 hover:bg-white/15 text-white disabled:opacity-30"
                              title="Ke Bawah"
                            >
                              <ChevronDown size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveBanner(bIdx)}
                              className="p-1 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                              title="Hapus"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add banner controls */}
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <span className="text-[9px] font-f1 font-bold text-f1-gray uppercase block">
                        + TAMBAH BANNER BARU
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDriverBannerUpload}
                        className="text-xs text-f1-gray file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-f1-red file:text-white file:text-xs w-full"
                      />
                      <div className="flex gap-1 pt-0.5">
                        <input
                          type="text"
                          value={newBannerUrl}
                          onChange={e => setNewBannerUrl(e.target.value)}
                          placeholder="Atau URL gambar banner..."
                          className="flex-1 bg-[#181822] border border-white/10 px-2 py-1 rounded text-white text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddBannerUrl}
                          className="bg-f1-red hover:bg-f1-darkRed text-white px-2.5 py-1 rounded text-xs font-f1 font-bold transition whitespace-nowrap"
                        >
                          + Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2x4 Stats Grid Editor */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <span className="font-f1 font-black text-white tracking-wider block uppercase">
                    PROFESSIONAL METRICS GRID (2x4)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {heroForm.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="bg-white/5 p-2.5 rounded border border-white/10 space-y-1">
                        <input
                          type="text"
                          value={stat.label}
                          onChange={e => {
                            const newStats = [...heroForm.stats];
                            newStats[sIdx].label = e.target.value;
                            setHeroForm({ ...heroForm, stats: newStats });
                          }}
                          className="w-full text-[10px] font-f1 font-bold text-f1-gray bg-transparent border-b border-white/10 outline-none uppercase"
                        />
                        <input
                          type="text"
                          value={stat.value}
                          onChange={e => {
                            const newStats = [...heroForm.stats];
                            newStats[sIdx].value = e.target.value;
                            setHeroForm({ ...heroForm, stats: newStats });
                          }}
                          className="w-full text-xs font-f1 font-bold text-white bg-transparent outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Technical Competencies Editor */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-f1 font-black text-white tracking-wider block uppercase flex items-center gap-1.5 text-xs">
                        <Gauge size={14} className="text-f1-red" />
                        CORE TECHNICAL COMPETENCIES ({heroForm.telemetryBars?.length || 0})
                      </span>
                      <span className="text-[10px] text-f1-gray font-sans block">
                        Keahlian & telemetry bars di halaman depan.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTelemetryBar}
                      className="bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-2.5 py-1 rounded flex items-center gap-1 transition text-[11px]"
                    >
                      <Plus size={13} />
                      TAMBAH
                    </button>
                  </div>

                  {(!heroForm.telemetryBars || heroForm.telemetryBars.length === 0) ? (
                    <div className="text-center py-4 border border-dashed border-white/10 rounded bg-white/[0.02] text-f1-gray font-sans text-xs">
                      Belum ada keahlian. Klik <strong>+ TAMBAH</strong>.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {heroForm.telemetryBars.map((bar, bIdx) => (
                        <div
                          key={bIdx}
                          className="bg-white/5 border border-white/10 p-3 rounded space-y-2 hover:border-white/20 transition"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-f1-red font-bold text-xs w-5">#{bIdx + 1}</span>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={bar.label}
                                onChange={e => handleTelemetryBarChange(bIdx, 'label', e.target.value)}
                                placeholder="KEAHLIAN (cth: NETWORK ARCHITECTURE)"
                                className="w-full bg-[#181822] border border-white/10 px-2.5 py-1 rounded text-white font-f1 font-bold text-xs uppercase focus:border-f1-red outline-none"
                              />
                            </div>
                            <div className="w-24 flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={bar.percent}
                                onChange={e => handleTelemetryBarChange(bIdx, 'percent', e.target.value)}
                                className="w-14 bg-[#181822] border border-white/10 px-1.5 py-1 rounded text-white font-mono text-xs text-right focus:border-f1-red outline-none"
                              />
                              <span className="text-f1-gray font-mono text-xs">%</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveTelemetryBar(bIdx)}
                              className="text-f1-gray hover:text-f1-red p-1 rounded hover:bg-f1-red/10 transition"
                              title="Hapus keahlian ini"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={bar.percent}
                              onChange={e => handleTelemetryBarChange(bIdx, 'percent', e.target.value)}
                              className="flex-1 accent-[#e10600] h-1.5 bg-white/10 rounded cursor-pointer"
                            />
                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden shrink-0">
                              <div
                                className="h-full bg-gradient-to-r from-f1-red to-f1-yellow transition-all duration-300"
                                style={{ width: `${bar.percent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-3 rounded tracking-widest transition"
                >
                  SIMPAN HERO & PROFIL DRIVER ✓
                </button>
              </form>
            )}

            {/* TAB 2: BIOGRAPHY */}
            {activeTab === 'bio' && (
              <form onSubmit={handleBioSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">DATE OF BIRTH (TGL LAHIR)</label>
                    <input
                      type="text"
                      value={bioForm.dateOfBirth || ''}
                      onChange={e => setBioForm({ ...bioForm, dateOfBirth: e.target.value })}
                      placeholder="24/09/2001"
                      className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-f1 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">PLACE OF BIRTH / BASE</label>
                    <input
                      type="text"
                      value={bioForm.placeOfBirth || ''}
                      onChange={e => setBioForm({ ...bioForm, placeOfBirth: e.target.value })}
                      placeholder="Surakarta, Indonesia"
                      className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-f1 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">PULL QUOTE</label>
                  <textarea
                    rows={2}
                    value={bioForm.quote}
                    onChange={e => setBioForm({ ...bioForm, quote: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                  />
                </div>

                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">QUOTE AUTHOR / SIGNATURE</label>
                  <input
                    type="text"
                    value={bioForm.quoteAuthor}
                    onChange={e => setBioForm({ ...bioForm, quoteAuthor: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                  />
                </div>

                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">
                    PARAGRAF BIOGRAFI (Gunakan baris baru per paragraf)
                  </label>
                  <textarea
                    rows={5}
                    value={bioForm.paragraphs.join('\n\n')}
                    onChange={e =>
                      setBioForm({
                        ...bioForm,
                        paragraphs: e.target.value.split('\n\n').map(p => p.trim()).filter(Boolean)
                      })
                    }
                    className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-sans text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">
                    SKILL ARSENAL (Pisahkan dengan koma)
                  </label>
                  <textarea
                    rows={2}
                    value={bioSkillsInput}
                    onChange={e => setBioSkillsInput(e.target.value)}
                    className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-f1 font-bold text-xs"
                  />
                </div>

                {/* TOGGLE STORY CARD DISPLAY */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between p-2.5 bg-black/40 border border-white/10 rounded">
                    <div>
                      <span className="font-f1 font-bold text-white text-[11px] block">
                        TAMPILKAN KARTU STORY BIOGRAFI
                      </span>
                      <span className="text-[9px] text-f1-lightGray block font-sans">
                        Tampilkan kartu foto portrait / story di biografi
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bioForm.showStoryCard !== false}
                        onChange={e => setBioForm({ ...bioForm, showStoryCard: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-f1-red"></div>
                    </label>
                  </div>
                </div>

                {/* STORY GALLERY MANAGER */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-f1 font-bold text-white tracking-wider block text-xs">
                        PORTFOLIO STORIES ({bioForm.gallery?.length || 0})
                      </label>
                      <span className="text-[9px] text-f1-lightGray block font-sans">
                        #1 otomatis menjadi sampul kartu di biografi.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddStoryItem}
                      className="bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-2 py-1 rounded text-[10px] transition flex items-center gap-1"
                    >
                      <Plus size={11} />
                      <span>+ STORY</span>
                    </button>
                  </div>

                  {(!bioForm.gallery || bioForm.gallery.length === 0) ? (
                    <div className="p-4 text-center border border-dashed border-white/20 rounded bg-black/30">
                      <p className="text-[10px] text-f1-gray font-f1 uppercase tracking-wider mb-2">
                        Belum ada foto story
                      </p>
                      <button
                        type="button"
                        onClick={handleAddStoryItem}
                        className="bg-white/10 hover:bg-white/20 text-white font-f1 font-bold px-2.5 py-1 rounded text-[10px] transition inline-flex items-center gap-1"
                      >
                        <Plus size={11} />
                        <span>TAMBAH FOTO PERTAMA</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                      {(bioForm.gallery || []).map((story, sIdx) => (
                        <div key={story.id || sIdx} className="p-2.5 bg-black/50 border border-white/10 hover:border-white/20 rounded space-y-2 transition">
                          
                          {/* Story Header */}
                          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-f1 font-bold text-white">
                                #{sIdx + 1}
                              </span>
                              {sIdx === 0 ? (
                                <span className="bg-f1-red text-white text-[8px] font-f1 font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                                  ★ COVER
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleMakeStoryCover(sIdx)}
                                  className="text-[9px] text-f1-lightGray hover:text-white bg-white/10 px-1.5 py-0.5 rounded font-f1 font-bold uppercase"
                                >
                                  Jadikan Cover
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveStory(sIdx, 'up')}
                                disabled={sIdx === 0}
                                className="p-0.5 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-25"
                                title="Geser ke atas"
                              >
                                <ChevronUp size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveStory(sIdx, 'down')}
                                disabled={sIdx === (bioForm.gallery?.length || 0) - 1}
                                className="p-0.5 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-25"
                                title="Geser ke bawah"
                              >
                                <ChevronDown size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStoryItem(sIdx)}
                                className="text-red-400 hover:text-red-300 p-1 rounded bg-red-500/10 hover:bg-red-500/20"
                                title="Hapus story"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>

                          {/* Thumbnail & Inputs */}
                          <div className="flex gap-2 items-start">
                            <div className="w-14 h-20 rounded bg-[#0f0f15] border border-white/15 overflow-hidden shrink-0">
                              <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'assets/driver-f1-banner.webp';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <div>
                                <label className="text-[9px] text-f1-gray uppercase font-bold block mb-0.5">Upload / Path Foto</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleStoryImageUpload(e, sIdx)}
                                  className="text-[10px] text-f1-gray file:mr-1 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:bg-f1-red file:text-white file:text-[9px] file:font-bold file:cursor-pointer w-full mb-1"
                                />
                                <input
                                  type="text"
                                  value={story.image}
                                  onChange={e => {
                                    const updated = [...(bioForm.gallery || [])];
                                    updated[sIdx].image = e.target.value;
                                    setBioForm({ ...bioForm, gallery: updated });
                                  }}
                                  placeholder="Path/URL gambar..."
                                  className="w-full bg-[#181822] border border-white/10 px-2 py-0.5 rounded text-white text-[10px] font-mono"
                                />
                              </div>
                              <input
                                type="text"
                                value={story.title}
                                onChange={e => {
                                  const updated = [...(bioForm.gallery || [])];
                                  updated[sIdx].title = e.target.value;
                                  setBioForm({ ...bioForm, gallery: updated });
                                }}
                                placeholder="Judul Story..."
                                className="w-full bg-[#181822] border border-white/10 px-2 py-0.5 rounded text-white text-[11px] font-f1 font-bold"
                              />
                              <input
                                type="text"
                                value={story.location || ''}
                                onChange={e => {
                                  const updated = [...(bioForm.gallery || [])];
                                  updated[sIdx].location = e.target.value;
                                  setBioForm({ ...bioForm, gallery: updated });
                                }}
                                placeholder="Lokasi (mis: Surakarta, Central Java)"
                                className="w-full bg-[#181822] border border-white/10 px-2 py-0.5 rounded text-white text-[10px]"
                              />
                              <input
                                type="text"
                                value={story.caption}
                                onChange={e => {
                                  const updated = [...(bioForm.gallery || [])];
                                  updated[sIdx].caption = e.target.value;
                                  setBioForm({ ...bioForm, gallery: updated });
                                }}
                                placeholder="Deskripsi/caption..."
                                className="w-full bg-[#181822] border border-white/10 px-2 py-0.5 rounded text-white text-[10px] font-sans"
                              />
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-3 rounded tracking-widest transition shadow-lg shadow-f1-red/20"
                >
                  SIMPAN BIOGRAFI & STORY GALLERY ✓
                </button>
              </form>
            )}

            {/* TAB 3: PORTFOLIO PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-f1 font-bold text-f1-gray tracking-wider uppercase">
                    DAFTAR PROYEK & PORTFOLIO ({data.projects.length})
                  </span>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setModalType('project');
                    }}
                    className="bg-f1-red hover:bg-f1-darkRed text-white text-xs font-f1 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                  >
                    <Plus size={14} />
                    <span>+ PROYEK BARU</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {data.projects.map(proj => (
                    <div
                      key={proj.id}
                      className="p-3.5 bg-f1-panel border border-white/10 rounded flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <strong className="text-sm font-f1 font-bold text-white block truncate">
                          {proj.title}
                        </strong>
                        <span className="text-[11px] font-f1 text-f1-gray tracking-wider uppercase">
                          {proj.category.toUpperCase()} • {proj.year} {proj.featured ? '• ★ FEATURED' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingItem(proj);
                            setModalType('project');
                          }}
                          className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition"
                          title="Edit Proyek"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus proyek "${proj.title}"?`)) deleteProject(proj.id);
                          }}
                          className="p-1.5 bg-f1-red/20 hover:bg-f1-red text-f1-red hover:text-white rounded transition"
                          title="Hapus Proyek"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: CAREER HISTORY */}
            {activeTab === 'career' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-f1 font-bold text-f1-gray tracking-wider uppercase">
                    RIWAYAT PENGALAMAN & KARIR ({data.career.length})
                  </span>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setModalType('career');
                    }}
                    className="bg-f1-red hover:bg-f1-darkRed text-white text-xs font-f1 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                  >
                    <Plus size={14} />
                    <span>+ KARIR BARU</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {data.career.map(car => (
                    <div
                      key={car.id}
                      className="p-3.5 bg-f1-panel border border-white/10 rounded flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <strong className="text-sm font-f1 font-bold text-white block truncate">
                          {car.role} — {car.team}
                        </strong>
                        <span className="text-[11px] font-f1 text-f1-gray tracking-wider uppercase">
                          {car.year} • {car.points}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingItem(car);
                            setModalType('career');
                          }}
                          className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus karir "${car.role}"?`)) deleteCareer(car.id);
                          }}
                          className="p-1.5 bg-f1-red/20 hover:bg-f1-red text-f1-red hover:text-white rounded transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: TICKER */}
            {activeTab === 'ticker' && (
              <form onSubmit={handleTickerSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">
                    KATA KUNCI RUNNING TICKER (Pisahkan koma)
                  </label>
                  <textarea
                    rows={4}
                    value={tickerInput}
                    onChange={e => setTickerInput(e.target.value)}
                    placeholder="F1 TELEMETRY, WEB DEV, IT SYSTEMS..."
                    className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-f1 font-bold text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-3 rounded tracking-widest transition"
                >
                  SIMPAN RUNNING TICKER ✓
                </button>
              </form>
            )}

            {/* TAB 6: AWARDS */}
            {activeTab === 'awards' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-f1 font-bold text-f1-gray tracking-wider uppercase">
                    DAFTAR PODIUM PENGHARGAAN ({data.awards.length})
                  </span>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setModalType('award');
                    }}
                    className="bg-f1-red hover:bg-f1-darkRed text-white text-xs font-f1 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                  >
                    <Plus size={14} />
                    <span>+ PENGHARGAAN BARU</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {data.awards.map(awd => (
                    <div
                      key={awd.id}
                      className="p-3.5 bg-f1-panel border border-white/10 rounded flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <strong className="text-sm font-f1 font-bold text-white block truncate">
                          {awd.title}
                        </strong>
                        <span className="text-[11px] font-f1 text-f1-yellow tracking-wider uppercase">
                          {awd.position} • {awd.year}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingItem(awd);
                            setModalType('award');
                          }}
                          className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus penghargaan "${awd.title}"?`)) deleteAward(awd.id);
                          }}
                          className="p-1.5 bg-f1-red/20 hover:bg-f1-red text-f1-red hover:text-white rounded transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: CONTACT */}
            {activeTab === 'contact' && (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">HEADLINE</label>
                  <input
                    type="text"
                    value={contactForm.heading}
                    onChange={e => setContactForm({ ...contactForm, heading: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                  />
                </div>
                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">DESKRIPSI</label>
                  <textarea
                    rows={2}
                    value={contactForm.description}
                    onChange={e => setContactForm({ ...contactForm, description: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">EMAIL</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">TELEPON / WA</label>
                    <input
                      type="text"
                      value={contactForm.phone}
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">GITHUB</label>
                    <input
                      type="text"
                      value={contactForm.github}
                      onChange={e => setContactForm({ ...contactForm, github: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">LINKEDIN</label>
                    <input
                      type="text"
                      value={contactForm.linkedin}
                      onChange={e => setContactForm({ ...contactForm, linkedin: e.target.value })}
                      className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">LOKASI / BASE</label>
                  <input
                    type="text"
                    value={contactForm.base}
                    onChange={e => setContactForm({ ...contactForm, base: e.target.value })}
                    className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-3 rounded tracking-widest transition"
                >
                  SIMPAN INFORMASI KONTAK ✓
                </button>
              </form>
            )}

            {/* TAB 8: BACKUP & SYSTEM */}
            {activeTab === 'backup' && (
              <div className="space-y-6 text-xs">
                <div className="space-y-3">
                  <span className="font-f1 font-bold text-white tracking-wider block uppercase">
                    BACKUP & RESTORE DATA
                  </span>
                  <button
                    onClick={exportJSON}
                    className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-3 rounded flex items-center justify-center gap-2 transition"
                  >
                    <Download size={16} />
                    <span>DOWNLOAD CADANGAN DATA (EXPORT JSON)</span>
                  </button>

                  <label className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-f1 font-bold py-3 rounded flex items-center justify-center gap-2 cursor-pointer transition">
                    <Upload size={16} />
                    <span>UPLOAD & RESTORE DARI JSON</span>
                    <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                  </label>
                </div>

                {/* Reset Factory Defaults */}
                <div className="p-4 bg-f1-red/10 border border-f1-red/30 rounded space-y-2">
                  <strong className="text-f1-red font-f1 font-bold text-xs tracking-wider uppercase block">
                    ⚠️ DANGER ZONE: FACTORY RESET
                  </strong>
                  <p className="text-[11px] text-f1-gray">
                    Reset seluruh data portofolio ke pengaturan awal bawaan.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Yakin ingin mereset seluruh data ke setelan bawaan?')) resetToDefaults();
                    }}
                    className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-2.5 rounded transition"
                  >
                    RESET SEMUA KE DEFAULT
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Item Edit Modal (Project / Career / Award) */}
      <ItemEditModal
        type={modalType}
        item={editingItem}
        onClose={() => {
          setModalType(null);
          setEditingItem(null);
        }}
      />
    </>
  );
};
