import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ItemEditModal, EditModalType } from './ItemEditModal';
import {
  Lock,
  LogOut,
  Database,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Gauge,
  Cloud,
  UploadCloud,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { BiographyGalleryItem } from '../../types/portfolio';
import pbylLogo from '../../assets/pbyl-logo.webp';

interface AdminPageProps {
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateHome }) => {
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
    isAdminUnlocked,
    loginWithSupabase,
    logoutAdmin,
    cloudStatus,
    showToast,
    uploadImage,
    syncLocalAssetsToSupabase
  } = usePortfolio();

  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSyncingAssets, setIsSyncingAssets] = useState(false);

  // Dashboard states
  const [activeTab, setActiveTab] = useState<'hero' | 'bio' | 'projects' | 'career' | 'ticker' | 'awards' | 'contact' | 'backup'>('hero');
  const [modalType, setModalType] = useState<EditModalType>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [heroForm, setHeroForm] = useState(data.hero);
  const [bioForm, setBioForm] = useState(data.biography);
  const [bioSkillsInput, setBioSkillsInput] = useState((data.biography.skills || []).join(', '));
  const [tickerInput, setTickerInput] = useState((data.ticker || []).join(', '));
  const [contactForm, setContactForm] = useState(data.contact);

  useEffect(() => {
    setHeroForm(data.hero);
    setBioForm(data.biography);
    setBioSkillsInput((data.biography.skills || []).join(', '));
    setTickerInput((data.ticker || []).join(', '));
    setContactForm(data.contact);
  }, [data]);

  const supabaseReady = isSupabaseConfigured();

  // Login handlers
  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await loginWithSupabase(email, password);
      if (result.success) {
        setSuccessMsg('Authentication Successful! Launching Control Room...');
      } else {
        setErrorMsg(result.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error communicating with authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // Form submit handlers
  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(heroForm);
  };

  const handleBioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = bioSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    updateBiography({ ...bioForm, skills });
  };

  const handleTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tickerArr = tickerInput.split(',').map(s => s.trim()).filter(Boolean);
    updateTicker(tickerArr);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContact(contactForm);
  };

  const handleDriverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('Uploading portrait image to Supabase Storage...', 'warning');
        const url = await uploadImage(file, 'portraits', 800, 0.88);
        const updated = { ...heroForm, photo: url };
        setHeroForm(updated);
        updateHero(updated);
        showToast('Portrait image uploaded and applied successfully!', 'success');
      } catch {
        showToast('Failed to process image.', 'error');
      }
    }
  };

  const [newMobileBannerUrl, setNewMobileBannerUrl] = useState('');

  const handleDriverMobileBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('Uploading mobile banner to Supabase Storage...', 'warning');
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
        showToast('Mobile banner uploaded and added to slider!', 'success');
        e.target.value = '';
      } catch {
        showToast('Failed to process mobile banner.', 'error');
      }
    }
  };

  const handleRemoveMobileBanner = (indexToRemove: number) => {
    const currentMobileBanners = heroForm.mobileBanners && heroForm.mobileBanners.length > 0
      ? [...heroForm.mobileBanners]
      : [heroForm.mobileBanner || 'assets/driver-f1-banner-mobile.png'];
    if (currentMobileBanners.length <= 1) {
      showToast('At least 1 mobile banner must remain in the slider.', 'warning');
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
    showToast('Mobile banner removed from slider.', 'success');
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
    showToast('Mobile banner order updated!', 'success');
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
    showToast('New mobile banner added to slider!', 'success');
  };

  const [newBannerUrl, setNewBannerUrl] = useState('');

  const handleDriverBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('Uploading banner to Supabase Storage...', 'warning');
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
        showToast('Banner uploaded and added to slider!', 'success');
        e.target.value = '';
      } catch {
        showToast('Failed to process banner.', 'error');
      }
    }
  };

  const handleRemoveBanner = (indexToRemove: number) => {
    const currentBanners = heroForm.banners && heroForm.banners.length > 0
      ? [...heroForm.banners]
      : [heroForm.banner || 'assets/driver-f1-banner.webp'];
    if (currentBanners.length <= 1) {
      showToast('At least 1 banner must remain in the slider.', 'warning');
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
    showToast('Banner removed from slider.', 'success');
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
    showToast('Banner order updated!', 'success');
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
    showToast('New banner added to slider!', 'success');
  };

  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sIdx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('Uploading story photo to storage...', 'warning');
        const url = await uploadImage(file, 'banners', 1200, 0.88);
        const updated = [...(bioForm.gallery || [])];
        updated[sIdx].image = url;
        setBioForm({ ...bioForm, gallery: updated });
        showToast('Story photo uploaded and applied!', 'success');
      } catch {
        showToast('Failed to process story image upload.', 'error');
      }
    }
  };

  const handleAddStoryItem = () => {
    const newStory: BiographyGalleryItem = {
      id: `story_${Date.now()}`,
      image: 'assets/driver-f1-banner.webp',
      title: 'New Field Story Moment',
      caption: 'Description of milestone or on-site operational deployment.',
      location: 'Surakarta, Indonesia',
      timestamp: 'Field Milestone • ' + new Date().getFullYear()
    };
    const updated = [...(bioForm.gallery || []), newStory];
    setBioForm({ ...bioForm, gallery: updated });
    showToast('New story moment added! Upload an image or edit details.', 'success');
  };

  const handleDeleteStoryItem = (sIdx: number) => {
    const updated = (bioForm.gallery || []).filter((_, i) => i !== sIdx);
    setBioForm({ ...bioForm, gallery: updated });
    showToast('Story photo removed!', 'warning');
  };

  const handleMakeStoryCover = (sIdx: number) => {
    if (sIdx === 0) return;
    const current = [...(bioForm.gallery || [])];
    const item = current.splice(sIdx, 1)[0];
    current.unshift(item);
    setBioForm({ ...bioForm, gallery: current });
    showToast('Photo set as primary cover for biography card!', 'success');
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

  const handleSyncAssets = async () => {
    setIsSyncingAssets(true);
    try {
      await syncLocalAssetsToSupabase();
    } finally {
      setIsSyncingAssets(false);
    }
  };

  const handleJSONFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (content) importJSON(content);
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

  // ------------------------------------------------------------
  // SCREEN 1: LOGIN GATE (If not unlocked)
  // ------------------------------------------------------------
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-[#09090d] text-white flex flex-col justify-between font-sans selection:bg-f1-red selection:text-white">
        {/* Top Header */}
        <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center bg-[#111118]">
          <div className="flex items-center gap-3">
            <img
              src={pbylLogo}
              alt="PBYL Logo"
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="text-sm font-f1 font-black tracking-widest text-white block">
                {data.hero.firstName} {data.hero.lastName}
              </span>
              <span className="text-[10px] font-f1 tracking-widest text-f1-gray block">
                ADMIN CONTROL ROOM PORTAL
              </span>
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-f1 font-bold text-f1-gray hover:text-white transition px-3 py-1.5 rounded border border-white/10 hover:border-white/30"
          >
            <ArrowLeft size={14} />
            <span>RETURN TO PORTFOLIO</span>
          </button>
        </header>

        {/* Center Login Box */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#12121a] border border-white/15 rounded-sm shadow-2xl overflow-hidden animate-fade-in">
            <div className="h-1.5 w-full bg-gradient-to-r from-f1-red via-f1-yellow to-f1-red"></div>

            <div className="p-6 border-b border-white/10 bg-[#161622] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-f1-red/20 text-f1-red flex items-center justify-center border border-f1-red/30">
                  <Lock size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-f1 font-bold tracking-widest text-f1-red uppercase block">
                    RESTRICTED ACCESS
                  </span>
                  <h2 className="text-lg font-f1 font-black text-white tracking-wider uppercase">
                    CONTROL ROOM LOGIN
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[10px] font-f1 font-bold block ${supabaseReady ? 'text-[#00ff66]' : 'text-f1-yellow'}`}>
                  {supabaseReady ? '● SUPABASE ONLINE' : '● LOCAL MODE'}
                </span>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-950/50 border border-red-500/30 rounded text-xs text-red-200 flex items-start gap-2 animate-shake">
                  <AlertCircle size={15} className="text-f1-red shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-green-950/50 border border-green-500/30 rounded text-xs text-green-200 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#00ff66] shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSupabaseSubmit} className="space-y-4 font-f1">
                {!supabaseReady && (
                  <div className="p-3 bg-yellow-950/30 border border-yellow-500/30 rounded text-xs text-yellow-200/90 font-sans space-y-1">
                    <p className="font-bold font-f1 text-f1-yellow">SUPABASE CREDENTIALS NOT CONNECTED</p>
                    <p>
                      Ensure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> are configured in <code>.env</code> or deployment dashboard.
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-f1-gray tracking-wider block mb-1 uppercase">
                    ADMIN USERNAME / EMAIL
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="username or email@domain.com"
                    className="w-full bg-[#181824] border border-white/15 focus:border-f1-red px-3.5 py-2.5 rounded text-white text-xs font-sans outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-f1-gray tracking-wider block mb-1 uppercase">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#181824] border border-white/15 focus:border-f1-red px-3.5 py-2.5 rounded text-white text-xs font-sans outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-f1-red hover:bg-f1-darkRed disabled:opacity-50 text-white font-bold text-xs tracking-widest py-3 rounded uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-f1-red/20"
                >
                  {loading ? <span>VERIFYING CREDENTIALS...</span> : (
                    <>
                      <span>ENTER CONTROL ROOM</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="px-6 py-3 bg-[#0c0c12] border-t border-white/10 text-[10px] font-f1 text-f1-gray flex justify-between items-center">
              <span>SECURITY LEVEL: MAXIMUM</span>
              <button
                onClick={onNavigateHome}
                className="text-f1-red hover:text-white transition"
              >
                RETURN TO SITE
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 px-6 py-3 text-center text-xs text-f1-gray font-f1">
          © {new Date().getFullYear()} {data.hero.firstName} — Admin Control Room System
        </footer>
      </div>
    );
  }

  // ------------------------------------------------------------
  // SCREEN 2: FULL-PAGE CONTROL ROOM DASHBOARD (When unlocked)
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0c0c10] text-white font-sans flex flex-col selection:bg-f1-red selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#121218] border-b border-white/10 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          {/* Brand & Connection Status */}
          <div className="flex items-center gap-3">
            <img
              src={pbylLogo}
              alt="PBYL Logo"
              className="h-8 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-f1 font-black tracking-widest text-white uppercase">
                  CONTROL ROOM DASHBOARD
                </h1>
                <span className="text-[9px] font-f1 font-bold px-2 py-0.5 rounded-full border border-white/10 bg-black/40 flex items-center gap-1.5">
                  <Database size={10} className={cloudStatus === 'connected' ? 'text-[#00ff66]' : 'text-f1-yellow'} />
                  <span className={cloudStatus === 'connected' ? 'text-[#00ff66]' : 'text-f1-yellow'}>
                    {cloudStatus === 'connected' ? 'SUPABASE CLOUD ONLINE' : 'LOCAL CACHE MODE'}
                  </span>
                </span>
              </div>
              <span className="text-[10px] font-f1 tracking-wider text-f1-gray hidden sm:block">
                Manage hero telemetry, projects, career, certificates, and content in real time
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 text-xs font-f1 font-bold text-white hover:text-f1-red transition px-3 py-1.5 rounded border border-white/15 hover:border-white/30 bg-white/5"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">VIEW PUBLIC WEBSITE</span>
              <span className="sm:hidden">SITE</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/50 hover:bg-f1-red text-white text-xs font-f1 font-bold border border-red-500/30 transition"
            >
              <LogOut size={13} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-white/10 flex overflow-x-auto text-xs font-f1 font-bold tracking-wider">
          {[
            { id: 'hero', label: '🏁 HERO PROFILE' },
            { id: 'bio', label: '👤 BIOGRAPHY' },
            { id: 'projects', label: `💻 PROJECTS (${data.projects.length})` },
            { id: 'career', label: `⏱️ EXPERIENCE (${data.career.length})` },
            { id: 'ticker', label: '📊 TICKER' },
            { id: 'awards', label: `📜 CERTIFICATES (${data.awards.length})` },
            { id: 'contact', label: '📡 CONTACT' },
            { id: 'backup', label: '💾 BACKUP & SYSTEM' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-f1-red text-white bg-white/5'
                  : 'border-transparent text-f1-gray hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
        {/* TAB 1: HERO */}
        {activeTab === 'hero' && (
          <form onSubmit={handleHeroSubmit} className="space-y-6 bg-[#13131b] border border-white/10 p-6 rounded-sm shadow-xl text-xs">
            <div className="border-b border-white/10 pb-3 flex justify-between items-center">
              <h2 className="text-lg font-f1 font-black text-white uppercase">HERO TELEMETRY & PRIMARY PROFILE</h2>
              <span className="text-f1-red font-f1 font-bold">PROFILE ID #{heroForm.number}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">LAST NAME</label>
                <input
                  type="text"
                  value={heroForm.lastName}
                  onChange={e => setHeroForm({ ...heroForm, lastName: e.target.value })}
                  className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white uppercase font-f1 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">TEAM / INSTITUTION BADGE</label>
                <input
                  type="text"
                  value={heroForm.team}
                  onChange={e => setHeroForm({ ...heroForm, team: e.target.value })}
                  className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white uppercase font-f1 font-bold"
                />
              </div>
              <div>
                <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">ROLE / TITLE</label>
                <input
                  type="text"
                  value={heroForm.role}
                  onChange={e => setHeroForm({ ...heroForm, role: e.target.value })}
                  className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white uppercase font-f1 font-bold text-f1-red"
                />
              </div>
            </div>

            <div>
              <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">MOTTO / SLOGAN</label>
              <textarea
                rows={2}
                value={heroForm.quote}
                onChange={e => setHeroForm({ ...heroForm, quote: e.target.value })}
                className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-sans"
              />
            </div>

            {/* AVATAR / PORTRAIT PHOTO */}
            <div className="border border-white/10 bg-white/5 p-3.5 rounded">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-f1 font-bold text-f1-gray tracking-wider block text-xs">AVATAR / PORTRAIT PHOTO</label>
                {heroForm.photo !== data.hero.photo && (
                  <button
                    type="button"
                    onClick={() => {
                      updateHero(heroForm);
                      showToast('Portrait photo saved successfully!', 'success');
                    }}
                    className="text-[10px] bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-2 py-0.5 rounded transition uppercase"
                  >
                    SAVE PHOTO
                  </button>
                )}
              </div>
              <span className="text-[10px] text-f1-gray block font-sans mb-2">
                Square avatar photo for desktop profile identity and driver credential cards
              </span>
              <div className="flex items-center gap-4 p-3 bg-black/50 border border-white/10 rounded">
                <img
                  src={heroForm.photo || 'assets/driver-portrait.png'}
                  alt="Preview"
                  onError={(e) => {
                    if (!e.currentTarget.src.includes('driver-portrait.png')) {
                      e.currentTarget.src = 'assets/driver-portrait.png';
                    }
                  }}
                  className="w-16 h-16 object-cover rounded border border-white/20 shrink-0"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDriverPhotoUpload}
                    className="text-xs text-f1-gray file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-f1-red file:text-white file:text-xs file:font-f1 file:font-bold file:cursor-pointer w-full"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={heroForm.photo || ''}
                      onChange={e => setHeroForm({ ...heroForm, photo: e.target.value })}
                      placeholder="Or paste portrait image URL..."
                      className="flex-1 bg-[#181822] border border-white/10 px-2.5 py-1 rounded text-white text-xs outline-none focus:border-f1-red font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateHero(heroForm);
                        showToast('Portrait photo updated!', 'success');
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded text-[11px] font-f1 font-bold transition whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TWO-COLUMN SLIDERS: MOBILE SLIDER & DESKTOP SLIDER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              {/* 1. MOBILE HERO BANNERS (MULTI-BANNER SLIDER) */}
              <div className="border border-f1-red/30 bg-f1-red/5 p-3.5 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <label className="font-f1 font-bold text-white tracking-wider block text-xs">
                        MOBILE HERO BANNERS (MULTI-SLIDE CAROUSEL)
                      </label>
                      <span className="text-[9px] bg-f1-red text-white font-f1 font-black px-1.5 py-0.2 rounded uppercase">
                        Mobile Only
                      </span>
                    </div>
                    <span className="text-[10px] text-f1-lightGray block font-sans">
                      Swipeable on mobile devices. 4:5 or 1080x1350 px recommended.
                    </span>
                  </div>
                  <span className="text-[10px] bg-f1-red text-white px-2 py-0.5 rounded font-f1 font-bold">
                    {((heroForm.mobileBanners && heroForm.mobileBanners.length > 0) ? heroForm.mobileBanners : [heroForm.mobileBanner || 'assets/driver-f1-banner-mobile.png']).length} Banners
                  </span>
                </div>

                <div className="space-y-3 p-3 bg-black/60 border border-white/10 rounded">
                  {/* List of current mobile banners */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {((heroForm.mobileBanners && heroForm.mobileBanners.length > 0) ? heroForm.mobileBanners : [heroForm.mobileBanner || 'assets/driver-f1-banner-mobile.png']).map((mUrl, mIdx, arr) => (
                      <div key={mIdx} className="bg-[#12121a] border border-white/10 p-2 rounded flex items-center gap-2.5">
                        {/* Thumbnail (Portrait ratio) */}
                        <div className="w-12 h-16 rounded overflow-hidden border border-white/15 shrink-0 relative bg-black/50">
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
                          <span className="absolute top-0.5 left-0.5 bg-black/80 px-1 py-0.2 rounded text-[8px] font-f1 font-black text-f1-red">
                            #{mIdx + 1}
                          </span>
                        </div>

                        {/* Banner Info */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-f1 font-bold text-white uppercase">
                              {mIdx === 0 ? '★ Primary (#1)' : `Slide #${mIdx + 1}`}
                            </span>
                            <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/10 text-f1-gray">
                              {mUrl.startsWith('http') ? 'CDN' : mUrl.startsWith('data:') ? 'Base64' : 'Local'}
                            </span>
                          </div>
                          <p className="text-[9px] text-f1-gray truncate font-mono" title={mUrl}>
                            {mUrl}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={mIdx === 0}
                            onClick={() => handleMoveMobileBanner(mIdx, 'up')}
                            title="Move Up"
                            className="p-1 rounded bg-white/5 hover:bg-white/15 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                          >
                            <ChevronUp size={13} />
                          </button>
                          <button
                            type="button"
                            disabled={mIdx === arr.length - 1}
                            onClick={() => handleMoveMobileBanner(mIdx, 'down')}
                            title="Move Down"
                            className="p-1 rounded bg-white/5 hover:bg-white/15 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                          >
                            <ChevronDown size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveMobileBanner(mIdx)}
                            title="Remove Banner"
                            className="p-1 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Mobile Banner Controls */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-f1 font-bold text-f1-gray tracking-wider uppercase block">
                      + ADD NEW MOBILE BANNER
                    </span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-f1-lightGray block">Upload Image (JPG/PNG/WebP):</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDriverMobileBannerUpload}
                        className="text-xs text-f1-gray file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-f1-red file:text-white file:text-xs file:font-f1 file:font-bold file:cursor-pointer w-full"
                      />
                    </div>

                    <div className="flex gap-1.5 pt-0.5">
                      <input
                        type="text"
                        value={newMobileBannerUrl}
                        onChange={e => setNewMobileBannerUrl(e.target.value)}
                        placeholder="Or paste mobile banner image URL..."
                        className="flex-1 bg-[#181822] border border-white/10 px-2.5 py-1 rounded text-white text-xs outline-none focus:border-f1-red font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddMobileBannerUrl}
                        className="bg-f1-red hover:bg-f1-darkRed text-white px-2.5 py-1 rounded text-xs font-f1 font-bold transition whitespace-nowrap flex items-center gap-1"
                      >
                        <Plus size={12} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. WIDESCREEN HERO BANNERS (MULTI-BANNER SLIDER) */}
              <div className="border border-white/10 bg-white/5 p-3.5 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="font-f1 font-bold text-f1-gray tracking-wider block text-xs">
                      WIDESCREEN HERO BANNERS (DESKTOP SLIDER)
                    </label>
                    <span className="text-[10px] text-f1-lightGray block font-sans">
                      Desktop widescreen banner. Recommended aspect ratio 21:8 (4058x1550 px).
                    </span>
                  </div>
                  <span className="text-[10px] bg-f1-red/20 text-f1-red border border-f1-red/40 px-2 py-0.5 rounded font-f1 font-bold">
                    {((heroForm.banners && heroForm.banners.length > 0) ? heroForm.banners : [heroForm.banner || 'assets/driver-f1-banner.webp']).length} Banners
                  </span>
                </div>

                <div className="space-y-3 p-3 bg-black/60 border border-white/10 rounded">
                  {/* List of current banners */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {((heroForm.banners && heroForm.banners.length > 0) ? heroForm.banners : [heroForm.banner || 'assets/driver-f1-banner.webp']).map((bannerUrl, bIdx, arr) => (
                      <div key={bIdx} className="bg-[#12121a] border border-white/10 p-2 rounded flex items-center gap-2.5">
                        {/* Thumbnail */}
                        <div className="w-20 aspect-[16/9] rounded overflow-hidden border border-white/15 shrink-0 relative bg-black/50">
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
                          <span className="absolute top-0.5 left-0.5 bg-black/80 px-1 py-0.2 rounded text-[8px] font-f1 font-black text-f1-red">
                            #{bIdx + 1}
                          </span>
                        </div>

                        {/* Banner Info */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-f1 font-bold text-white uppercase">
                              {bIdx === 0 ? '★ Primary (#1)' : `Slide #${bIdx + 1}`}
                            </span>
                            <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/10 text-f1-gray">
                              {bannerUrl.startsWith('http') ? 'CDN' : bannerUrl.startsWith('data:') ? 'Base64' : 'Local'}
                            </span>
                          </div>
                          <p className="text-[9px] text-f1-gray truncate font-mono" title={bannerUrl}>
                            {bannerUrl}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={bIdx === 0}
                            onClick={() => handleMoveBanner(bIdx, 'up')}
                            title="Move Up (Previous)"
                            className="p-1 rounded bg-white/5 hover:bg-white/15 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                          >
                            <ChevronUp size={13} />
                          </button>
                          <button
                            type="button"
                            disabled={bIdx === arr.length - 1}
                            onClick={() => handleMoveBanner(bIdx, 'down')}
                            title="Move Down (Next)"
                            className="p-1 rounded bg-white/5 hover:bg-white/15 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                          >
                            <ChevronDown size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveBanner(bIdx)}
                            title="Remove Banner"
                            className="p-1 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Banner Controls */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-f1 font-bold text-f1-gray tracking-wider uppercase block">
                      + ADD NEW DESKTOP BANNER
                    </span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-f1-lightGray block">Upload Image (JPG/PNG/WebP):</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDriverBannerUpload}
                        className="text-xs text-f1-gray file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-f1-red file:text-white file:text-xs file:font-f1 file:font-bold file:cursor-pointer w-full"
                      />
                    </div>

                    <div className="flex gap-1.5 pt-0.5">
                      <input
                        type="text"
                        value={newBannerUrl}
                        onChange={e => setNewBannerUrl(e.target.value)}
                        placeholder="Or paste banner image URL (https://...)..."
                        className="flex-1 bg-[#181822] border border-white/10 px-2.5 py-1 rounded text-white text-xs outline-none focus:border-f1-red font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddBannerUrl}
                        className="bg-f1-red hover:bg-f1-darkRed text-white px-2.5 py-1 rounded text-xs font-f1 font-bold transition whitespace-nowrap flex items-center gap-1"
                      >
                        <Plus size={12} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2x4 Stats Editor */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="font-f1 font-black text-white tracking-wider block uppercase">
                CAREER TELEMETRY STATS (2x4 GRID)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                      placeholder="LABEL"
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
                      placeholder="VALUE"
                      className="w-full text-xs font-f1 font-bold text-white bg-transparent outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Core Technical Competencies Editor */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-f1 font-black text-white tracking-wider block uppercase flex items-center gap-2 text-sm">
                    <Gauge size={16} className="text-f1-red" />
                    CORE TECHNICAL COMPETENCIES ({heroForm.telemetryBars?.length || 0})
                  </span>
                  <p className="text-[11px] text-f1-gray font-sans">
                    Technical competencies & telemetry bars displayed on the front-page hero section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTelemetryBar}
                  className="bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition text-xs shadow-md"
                >
                  <Plus size={14} />
                  ADD COMPETENCY
                </button>
              </div>

              {(!heroForm.telemetryBars || heroForm.telemetryBars.length === 0) ? (
                <div className="text-center py-6 border border-dashed border-white/10 rounded bg-white/[0.02] text-f1-gray font-sans">
                  No technical telemetry bars defined yet. Click <strong>+ ADD COMPETENCY</strong> above.
                </div>
              ) : (
                <div className="space-y-3">
                  {heroForm.telemetryBars.map((bar, bIdx) => (
                    <div
                      key={bIdx}
                      className="bg-white/5 border border-white/10 p-3.5 rounded space-y-2 hover:border-white/20 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-f1-red font-bold text-xs w-6">#{bIdx + 1}</span>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={bar.label}
                            onChange={e => handleTelemetryBarChange(bIdx, 'label', e.target.value)}
                            placeholder="COMPETENCY TITLE (e.g. NETWORK ARCHITECTURE)"
                            className="w-full bg-[#181822] border border-white/10 px-3 py-1.5 rounded text-white font-f1 font-bold text-xs uppercase focus:border-f1-red outline-none"
                          />
                        </div>
                        <div className="w-28 flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={bar.percent}
                            onChange={e => handleTelemetryBarChange(bIdx, 'percent', e.target.value)}
                            className="w-16 bg-[#181822] border border-white/10 px-2 py-1.5 rounded text-white font-mono text-xs text-right focus:border-f1-red outline-none"
                          />
                          <span className="text-f1-gray font-mono text-xs">%</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTelemetryBar(bIdx)}
                          className="text-f1-gray hover:text-f1-red p-1.5 rounded hover:bg-f1-red/10 transition"
                          title="Remove competency"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Slider and visual preview */}
                      <div className="flex items-center gap-3 pt-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={bar.percent}
                          onChange={e => handleTelemetryBarChange(bIdx, 'percent', e.target.value)}
                          className="flex-1 accent-[#e10600] h-1.5 bg-white/10 rounded cursor-pointer"
                        />
                        <div className="w-36 h-2 bg-white/10 rounded-full overflow-hidden shrink-0">
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
              className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-3 rounded tracking-widest uppercase transition text-xs shadow-lg shadow-f1-red/20"
            >
              SAVE HERO PROFILE ✓
            </button>
          </form>
        )}

        {/* TAB 2: BIOGRAPHY */}
        {activeTab === 'bio' && (
          <form onSubmit={handleBioSubmit} className="space-y-6 bg-[#13131b] border border-white/10 p-6 rounded-sm shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-f1 font-black text-white uppercase">BIOGRAPHY, DRIVER DATA & STORY GALLERY</h2>
              <span className="text-[10px] bg-f1-red text-white font-f1 font-bold px-2 py-0.5 rounded uppercase">
                F1 Editorial Layout
              </span>
            </div>

            {/* Date & Place of Birth Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">DATE OF BIRTH</label>
                <input
                  type="text"
                  value={bioForm.dateOfBirth || ''}
                  onChange={e => setBioForm({ ...bioForm, dateOfBirth: e.target.value })}
                  placeholder="24/09/2001"
                  className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-f1 font-bold"
                />
              </div>
              <div>
                <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">BASE OF OPERATIONS / LOCATION</label>
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
              <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">FEATURED EDITORIAL PULL QUOTE</label>
              <textarea
                rows={2}
                value={bioForm.quote}
                onChange={e => setBioForm({ ...bioForm, quote: e.target.value })}
                className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-sans"
              />
            </div>

            <div>
              <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">QUOTE AUTHOR / SIGNATURE</label>
              <input
                type="text"
                value={bioForm.quoteAuthor}
                onChange={e => setBioForm({ ...bioForm, quoteAuthor: e.target.value })}
                placeholder="Ladzdzah Hanan Naafi Mufidz // Software Engineer"
                className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-f1 font-bold"
              />
            </div>

            <div>
              <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">BIOGRAPHY PARAGRAPHS (SEPARATE WITH DOUBLE NEWLINE)</label>
              <textarea
                rows={6}
                value={bioForm.paragraphs.join('\n\n')}
                onChange={e => setBioForm({ ...bioForm, paragraphs: e.target.value.split('\n\n').filter(Boolean) })}
                className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-sans leading-relaxed"
              />
            </div>

            <div>
              <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">TECHNICAL SKILLS LIST (COMMA SEPARATED)</label>
              <input
                type="text"
                value={bioSkillsInput}
                onChange={e => setBioSkillsInput(e.target.value)}
                className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-f1 font-bold text-xs"
              />
            </div>

            {/* TOGGLE STORY CARD DISPLAY */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/10 rounded">
                <div>
                  <span className="font-f1 font-bold text-white text-xs block">
                    DISPLAY STORY CARD / BIOGRAPHY PHOTO
                  </span>
                  <span className="text-[10px] text-f1-lightGray block font-sans">
                    Enable to display interactive portrait / field story card beside biography paragraphs.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bioForm.showStoryCard !== false}
                    onChange={e => setBioForm({ ...bioForm, showStoryCard: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-f1-red"></div>
                </label>
              </div>
            </div>

            {/* STORY GALLERY MANAGER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-f1 font-bold text-white tracking-wider block text-sm">
                    PORTFOLIO STORIES & FIELD DOCUMENTATION ({bioForm.gallery?.length || 0})
                  </label>
                  <span className="text-[10px] text-f1-lightGray block font-sans">
                    Field documentation photos that open in a fullscreen story viewer. Slide #1 automatically serves as the primary card cover.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddStoryItem}
                  className="bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-3 py-1.5 rounded text-xs transition flex items-center gap-1.5 shadow-md"
                >
                  <Plus size={13} />
                  <span>ADD PHOTO / STORY</span>
                </button>
              </div>

              {(!bioForm.gallery || bioForm.gallery.length === 0) ? (
                <div className="p-6 text-center border border-dashed border-white/20 rounded bg-black/30">
                  <p className="text-xs text-f1-gray font-f1 uppercase tracking-wider mb-2">
                    No story photos added yet.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddStoryItem}
                    className="bg-white/10 hover:bg-white/20 text-white font-f1 font-bold px-3 py-1.5 rounded text-xs transition inline-flex items-center gap-1.5"
                  >
                    <Plus size={13} />
                    <span>ADD FIRST STORY</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {(bioForm.gallery || []).map((story, sIdx) => (
                    <div key={story.id || sIdx} className="p-3.5 bg-black/60 border border-white/10 hover:border-white/20 rounded space-y-3 transition">
                      
                      {/* Story Card Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-f1 font-bold text-white uppercase">
                            #{sIdx + 1}
                          </span>
                          {sIdx === 0 ? (
                            <span className="bg-f1-red text-white text-[9px] font-f1 font-black px-2 py-0.5 rounded tracking-wider uppercase">
                              ★ PRIMARY COVER
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMakeStoryCover(sIdx)}
                              className="text-[10px] text-f1-lightGray hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded font-f1 font-bold tracking-wider uppercase transition"
                            >
                              Set as Cover
                            </button>
                          )}
                        </div>

                        {/* Controls: Move Up, Move Down, Delete */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMoveStory(sIdx, 'up')}
                            disabled={sIdx === 0}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-25 transition"
                            title="Move up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveStory(sIdx, 'down')}
                            disabled={sIdx === (bioForm.gallery?.length || 0) - 1}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-25 transition"
                            title="Move down"
                          >
                            <ChevronDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStoryItem(sIdx)}
                            className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded text-xs font-f1 font-bold flex items-center gap-1 transition"
                            title="Remove story photo"
                          >
                            <Trash2 size={12} />
                            <span>DELETE</span>
                          </button>
                        </div>
                      </div>

                      {/* Story Card Content */}
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        {/* Thumbnail Preview */}
                        <div className="w-20 h-28 sm:w-24 sm:h-32 rounded bg-[#0f0f15] border border-white/15 overflow-hidden shrink-0 relative group">
                          <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'assets/driver-f1-banner.webp';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-[9px] font-f1 text-white font-bold uppercase">PREVIEW</span>
                          </div>
                        </div>

                        {/* Inputs */}
                        <div className="flex-1 min-w-0 w-full space-y-2.5">
                          {/* Upload File or Path */}
                          <div>
                            <label className="text-[10px] font-f1 font-bold text-f1-gray uppercase tracking-wider block mb-1">
                              STORY PHOTO (UPLOAD FROM DEVICE OR URL)
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleStoryImageUpload(e, sIdx)}
                                className="text-xs text-f1-gray file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-f1-red file:text-white file:text-xs file:font-f1 file:font-bold file:cursor-pointer flex-1"
                              />
                              <input
                                type="text"
                                value={story.image}
                                onChange={e => {
                                  const updated = [...(bioForm.gallery || [])];
                                  updated[sIdx].image = e.target.value;
                                  setBioForm({ ...bioForm, gallery: updated });
                                }}
                                placeholder="Or image URL / asset path..."
                                className="flex-1 bg-[#181822] border border-white/10 px-2.5 py-1 rounded text-white text-xs font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-f1 font-bold text-f1-gray uppercase tracking-wider block mb-1">
                                STORY TITLE
                              </label>
                              <input
                                type="text"
                                value={story.title}
                                onChange={e => {
                                  const updated = [...(bioForm.gallery || [])];
                                  updated[sIdx].title = e.target.value;
                                  setBioForm({ ...bioForm, gallery: updated });
                                }}
                                placeholder="e.g. IT Operations & Systems"
                                className="w-full bg-[#181822] border border-white/10 px-2.5 py-1.5 rounded text-white text-xs font-f1 font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-f1 font-bold text-f1-gray uppercase tracking-wider block mb-1">
                                LOCATION
                              </label>
                              <input
                                type="text"
                                value={story.location || ''}
                                onChange={e => {
                                  const updated = [...(bioForm.gallery || [])];
                                  updated[sIdx].location = e.target.value;
                                  setBioForm({ ...bioForm, gallery: updated });
                                }}
                                placeholder="e.g. Surakarta, Central Java"
                                className="w-full bg-[#181822] border border-white/10 px-2.5 py-1.5 rounded text-white text-xs"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-f1 font-bold text-f1-gray uppercase tracking-wider block mb-1">
                                TIMESTAMP / BADGE
                              </label>
                              <input
                                type="text"
                                value={story.timestamp || ''}
                                onChange={e => {
                                  const updated = [...(bioForm.gallery || [])];
                                  updated[sIdx].timestamp = e.target.value;
                                  setBioForm({ ...bioForm, gallery: updated });
                                }}
                                placeholder="e.g. TMC Operations • 2026"
                                className="w-full bg-[#181822] border border-white/10 px-2.5 py-1.5 rounded text-white text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-f1 font-bold text-f1-gray uppercase tracking-wider block mb-1">
                                CAPTION / DESCRIPTION
                              </label>
                              <input
                                type="text"
                                value={story.caption}
                                onChange={e => {
                                  const updated = [...(bioForm.gallery || [])];
                                  updated[sIdx].caption = e.target.value;
                                  setBioForm({ ...bioForm, gallery: updated });
                                }}
                                placeholder="Description of milestone, stack, or achievement..."
                                className="w-full bg-[#181822] border border-white/10 px-2.5 py-1.5 rounded text-white text-xs font-sans"
                              />
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-3 rounded tracking-widest uppercase transition text-xs shadow-lg shadow-f1-red/20"
            >
              SAVE BIOGRAPHY & STORY GALLERY ✓
            </button>
          </form>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4 bg-[#13131b] border border-white/10 p-6 rounded-sm shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-f1 font-black text-white text-base uppercase">PROJECT DIRECTORY ({data.projects.length})</span>
              <button
                type="button"
                onClick={() => { setEditingItem(null); setModalType('project'); }}
                className="bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition text-xs"
              >
                <Plus size={14} />
                <span>ADD PROJECT</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.projects.map(proj => (
                <div key={proj.id} className="p-4 bg-white/5 border border-white/10 rounded flex items-center justify-between gap-4">
                  <div>
                    <strong className="text-sm font-f1 font-bold text-white block">{proj.title}</strong>
                    <span className="text-[10px] text-f1-gray font-f1">
                      {proj.category.toUpperCase()} • {proj.year} • {(proj.images?.length || (proj.image ? 1 : 0))} PHOTOS {proj.featured ? '• ★ FEATURED' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingItem(proj); setModalType('project'); }}
                      className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition"
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this project?')) deleteProject(proj.id); }}
                      className="p-1.5 bg-red-950/40 hover:bg-f1-red text-white rounded transition"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CAREER */}
        {activeTab === 'career' && (
          <div className="space-y-4 bg-[#13131b] border border-white/10 p-6 rounded-sm shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-f1 font-black text-white text-base uppercase">CAREER TIMELINE & ROLES ({data.career.length})</span>
              <button
                type="button"
                onClick={() => { setEditingItem(null); setModalType('career'); }}
                className="bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition text-xs"
              >
                <Plus size={14} />
                <span>ADD EXPERIENCE</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.career.map(c => (
                <div key={c.id} className="p-4 bg-white/5 border border-white/10 rounded flex items-center justify-between gap-4">
                  <div>
                    <strong className="text-sm font-f1 font-bold text-white block">{c.role}</strong>
                    <span className="text-[10px] text-f1-yellow font-f1">{c.team} • {c.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingItem(c); setModalType('career'); }}
                      className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition"
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this career entry?')) deleteCareer(c.id); }}
                      className="p-1.5 bg-red-950/40 hover:bg-f1-red text-white rounded transition"
                      title="Delete"
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
          <form onSubmit={handleTickerSubmit} className="space-y-4 bg-[#13131b] border border-white/10 p-6 rounded-sm shadow-xl text-xs">
            <h2 className="text-lg font-f1 font-black text-white uppercase border-b border-white/10 pb-3">RUNNING TICKER STRIP</h2>
            <p className="text-f1-gray font-sans">
              Enter announcement phrases to display on the running ticker strip below the hero banner. Separate each item with a comma.
            </p>
            <textarea
              rows={4}
              value={tickerInput}
              onChange={e => setTickerInput(e.target.value)}
              className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-f1 font-bold leading-relaxed"
            />
            <button
              type="submit"
              className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-3 rounded tracking-widest uppercase transition text-xs shadow-lg shadow-f1-red/20"
            >
              SAVE TICKER ✓
            </button>
          </form>
        )}

        {/* TAB 6: AWARDS */}
        {activeTab === 'awards' && (
          <div className="space-y-4 bg-[#13131b] border border-white/10 p-6 rounded-sm shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-f1 font-black text-white text-base uppercase">DIGITAL CERTIFICATES ({data.awards.length})</span>
              <button
                type="button"
                onClick={() => { setEditingItem(null); setModalType('award'); }}
                className="bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition text-xs"
              >
                <Plus size={14} />
                <span>ADD CERTIFICATE</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.awards.map(awd => (
                <div key={awd.id} className="p-4 bg-white/5 border border-white/10 rounded flex items-center justify-between gap-4">
                  <div>
                    <strong className="text-sm font-f1 font-bold text-white block">{awd.title}</strong>
                    <span className="text-[10px] text-f1-gray font-f1">{awd.subtitle} • {awd.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingItem(awd); setModalType('award'); }}
                      className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition"
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this certificate record?')) deleteAward(awd.id); }}
                      className="p-1.5 bg-red-950/40 hover:bg-f1-red text-white rounded transition"
                      title="Delete"
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
          <form onSubmit={handleContactSubmit} className="space-y-4 bg-[#13131b] border border-white/10 p-6 rounded-sm shadow-xl text-xs">
            <h2 className="text-lg font-f1 font-black text-white uppercase border-b border-white/10 pb-3">CONTACT INFORMATION</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">PHONE / WHATSAPP</label>
                <input
                  type="text"
                  value={contactForm.phone}
                  onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  value={contactForm.linkedin || ''}
                  onChange={e => setContactForm({ ...contactForm, linkedin: e.target.value })}
                  className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">BASE LOCATION</label>
              <input
                type="text"
                value={contactForm.base}
                onChange={e => setContactForm({ ...contactForm, base: e.target.value })}
                className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-3 rounded tracking-widest uppercase transition text-xs shadow-lg shadow-f1-red/20"
            >
              SAVE CONTACT DETAILS ✓
            </button>
          </form>
        )}

        {/* TAB 8: BACKUP & SYSTEM */}
        {activeTab === 'backup' && (
          <div className="space-y-6 bg-[#13131b] border border-white/10 p-6 rounded-sm shadow-xl text-xs">
            <h2 className="text-lg font-f1 font-black text-white uppercase border-b border-white/10 pb-3">BACKUP & CLOUD STORAGE</h2>

            {/* Supabase Storage Cloud Assets */}
            <div className="p-4 bg-white/5 border border-white/10 rounded space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                <div>
                  <strong className="text-sm font-f1 font-bold text-white block uppercase flex items-center gap-2">
                    <Cloud size={16} className="text-[#00ff66]" />
                    SUPABASE STORAGE CDN (BUCKET: portfolio-assets)
                  </strong>
                  <p className="text-f1-gray font-sans text-xs">
                    All profile avatars, hero banners, project galleries, and verified credentials are hosted on Supabase Storage.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-f1-gray">Storage Status:</span>
                  <span className={supabaseReady ? 'text-[#00ff66] font-bold' : 'text-f1-red font-bold'}>
                    {supabaseReady ? 'CONNECTED' : 'UNCONFIGURED'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-black/30 rounded border border-white/5 space-y-1">
                  <span className="text-f1-gray font-mono text-[10px] block">AVATAR PORTRAIT:</span>
                  <span className="text-white font-mono truncate block">
                    {data.hero.photo?.startsWith('http') ? '✓ Supabase CDN' : 'Local / Default'}
                  </span>
                </div>
                <div className="p-2.5 bg-black/30 rounded border border-white/5 space-y-1">
                  <span className="text-f1-gray font-mono text-[10px] block">HERO BANNER:</span>
                  <span className="text-white font-mono truncate block">
                    {data.hero.banner?.startsWith('http') ? '✓ Supabase CDN' : 'Local / Default'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncAssets}
                disabled={isSyncingAssets || !supabaseReady}
                className={`w-full font-f1 font-bold py-2.5 rounded flex items-center justify-center gap-2 uppercase tracking-wider transition ${
                  isSyncingAssets || !supabaseReady
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-[#00ff66]/20 hover:bg-[#00ff66]/30 text-[#00ff66] border border-[#00ff66]/40 shadow-lg shadow-[#00ff66]/10'
                }`}
              >
                <UploadCloud size={16} />
                <span>{isSyncingAssets ? 'UPLOADING ALL MEDIA TO SUPABASE...' : 'SYNC ALL LOCAL ASSETS TO SUPABASE STORAGE'}</span>
              </button>
            </div>

            {/* Backup JSON */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded space-y-2">
                <strong className="text-sm font-f1 font-bold text-white block uppercase">EXPORT BACKUP JSON</strong>
                <p className="text-f1-gray font-sans text-xs">Download a complete JSON snapshot of your portfolio.</p>
                <button
                  onClick={exportJSON}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-f1 font-bold py-2 rounded flex items-center justify-center gap-2 transition"
                >
                  <Download size={14} />
                  <span>DOWNLOAD BACKUP</span>
                </button>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded space-y-2">
                <strong className="text-sm font-f1 font-bold text-white block uppercase">IMPORT / RESTORE JSON</strong>
                <p className="text-f1-gray font-sans text-xs">Restore your entire portfolio state from a backup JSON file.</p>
                <label className="w-full bg-white/10 hover:bg-white/20 text-white font-f1 font-bold py-2 rounded flex items-center justify-center gap-2 cursor-pointer transition">
                  <Upload size={14} />
                  <span>CHOOSE JSON FILE</span>
                  <input type="file" accept=".json" onChange={handleJSONFileImport} className="hidden" />
                </label>
              </div>
            </div>

            {/* Reset Defaults */}
            <div className="p-4 bg-red-950/30 border border-red-500/20 rounded flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <strong className="text-sm font-f1 font-bold text-red-200 block">FACTORY RESET DATA</strong>
                <p className="text-xs text-red-300/80 font-sans">Reset all portfolio data back to initial factory defaults.</p>
              </div>
              <button
                onClick={() => { if (confirm('Are you sure you want to restore all portfolio data to factory defaults?')) resetToDefaults(); }}
                className="bg-red-600 hover:bg-red-700 text-white font-f1 font-bold px-4 py-2 rounded transition whitespace-nowrap"
              >
                RESET ALL DATA
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Item Edit Modal */}
      {modalType && (
        <ItemEditModal
          type={modalType}
          item={editingItem}
          onClose={() => { setModalType(null); setEditingItem(null); }}
        />
      )}
    </div>
  );
};
