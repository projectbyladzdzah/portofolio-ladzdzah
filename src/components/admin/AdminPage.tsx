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
  UploadCloud
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
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
        setSuccessMsg('Autentikasi Berhasil! Membuka Control Room...');
      } else {
        setErrorMsg(result.error || 'Email atau password tidak sesuai.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan saat menghubungi server autentikasi.');
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
        showToast('Mengunggah foto portrait ke Supabase Storage...', 'warning');
        const url = await uploadImage(file, 'portraits', 800, 0.88);
        setHeroForm(prev => ({ ...prev, photo: url }));
        showToast('Foto portrait tersimpan di Supabase Storage! Klik SIMPAN PERUBAHAN.', 'success');
      } catch {
        showToast('Gagal memproses gambar.', 'error');
      }
    }
  };

  const handleDriverBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('Mengunggah banner ke Supabase Storage...', 'warning');
        const url = await uploadImage(file, 'banners', 1920, 0.88);
        setHeroForm(prev => ({ ...prev, banner: url }));
        showToast('Foto banner tersimpan di Supabase Storage! Klik SIMPAN PERUBAHAN.', 'success');
      } catch {
        showToast('Gagal memproses banner.', 'error');
      }
    }
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
            <span>KEMBALI KE PORTFOLIO</span>
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
                    <p className="font-bold font-f1 text-f1-yellow">KUNCI SUPABASE BELUM TERHUBUNG</p>
                    <p>
                      Pastikan variabel <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> sudah terisi di file <code>.env</code> atau Vercel.
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-f1-gray tracking-wider block mb-1 uppercase">
                    USERNAME / EMAIL ADMIN
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ladzdzah atau email@anda.com"
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
                  {loading ? <span>MEMERIKSA KREDENSIAL...</span> : (
                    <>
                      <span>MASUK KE CONTROL ROOM</span>
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
                KEMBALI KE WEB
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
                Kelola profil, proyek, keahlian, dan konten website secara real-time
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
              <span className="hidden sm:inline">LIHAT WEBSITE PUBLIK</span>
              <span className="sm:hidden">WEB</span>
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
            { id: 'awards', label: `🏆 AWARDS (${data.awards.length})` },
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
              <h2 className="text-lg font-f1 font-black text-white uppercase">INFORMASI HERO & PROFIL UTAMA</h2>
              <span className="text-f1-red font-f1 font-bold">TABEL ID #{heroForm.number}</span>
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

            {/* Photo Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">AVATAR / PORTRAIT PHOTO</label>
                <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded">
                  <img
                    src={heroForm.photo || 'assets/driver-portrait.png'}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded border border-white/20"
                  />
                  <div className="space-y-1 flex-1">
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

              <div>
                <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">WIDESCREEN HERO BANNER</label>
                <div className="space-y-2 p-3 bg-white/5 border border-white/10 rounded">
                  {heroForm.banner && (
                    <div className="aspect-[21/8] w-full rounded overflow-hidden border border-white/20">
                      <img src={heroForm.banner} alt="Banner Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDriverBannerUpload}
                    className="text-xs text-f1-gray file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-f1-red file:text-white file:text-xs"
                  />
                  <input
                    type="text"
                    value={heroForm.banner || ''}
                    onChange={e => setHeroForm({ ...heroForm, banner: e.target.value })}
                    placeholder="Atau URL banner (assets/driver-f1-banner.webp)..."
                    className="w-full bg-[#181822] border border-white/10 px-2.5 py-1 rounded text-white text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2x4 Stats Editor */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="font-f1 font-black text-white tracking-wider block uppercase">
                METRIK STATISTIK KARIR (2x4 GRID)
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
                      placeholder="NILAI"
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
                    Keahlian teknis & telemetry bar yang tampil di halaman depan portofolio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTelemetryBar}
                  className="bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition text-xs shadow-md"
                >
                  <Plus size={14} />
                  TAMBAH KEAHLIAN
                </button>
              </div>

              {(!heroForm.telemetryBars || heroForm.telemetryBars.length === 0) ? (
                <div className="text-center py-6 border border-dashed border-white/10 rounded bg-white/[0.02] text-f1-gray font-sans">
                  Belum ada keahlian telemetry. Klik tombol <strong>+ TAMBAH KEAHLIAN</strong> di atas.
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
                            placeholder="NAMA KEAHLIAN (cth: NETWORK ARCHITECTURE)"
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
                          title="Hapus keahlian ini"
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
              SIMPAN PROFIL HERO ✓
            </button>
          </form>
        )}

        {/* TAB 2: BIOGRAPHY */}
        {activeTab === 'bio' && (
          <form onSubmit={handleBioSubmit} className="space-y-6 bg-[#13131b] border border-white/10 p-6 rounded-sm shadow-xl text-xs">
            <h2 className="text-lg font-f1 font-black text-white uppercase border-b border-white/10 pb-3">BIOGRAFI & KEAHLIAN</h2>

            <div>
              <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">PULL QUOTE</label>
              <textarea
                rows={2}
                value={bioForm.quote}
                onChange={e => setBioForm({ ...bioForm, quote: e.target.value })}
                className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-sans"
              />
            </div>

            <div>
              <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">PARAGRAF PROFIL (PISAHKAN DENGAN ENTER DUA KALI)</label>
              <textarea
                rows={6}
                value={bioForm.paragraphs.join('\n\n')}
                onChange={e => setBioForm({ ...bioForm, paragraphs: e.target.value.split('\n\n').filter(Boolean) })}
                className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-sans leading-relaxed"
              />
            </div>

            <div>
              <label className="font-f1 font-bold text-f1-gray tracking-wider block mb-1">DAFTAR SKILLS (PISAHKAN DENGAN KOMA)</label>
              <input
                type="text"
                value={bioSkillsInput}
                onChange={e => setBioSkillsInput(e.target.value)}
                className="w-full bg-[#181822] border border-white/10 px-3 py-2 rounded text-white font-f1 font-bold text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-3 rounded tracking-widest uppercase transition text-xs shadow-lg shadow-f1-red/20"
            >
              SIMPAN BIOGRAFI ✓
            </button>
          </form>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4 bg-[#13131b] border border-white/10 p-6 rounded-sm shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-f1 font-black text-white text-base uppercase">DAFTAR PROYEK ({data.projects.length})</span>
              <button
                type="button"
                onClick={() => { setEditingItem(null); setModalType('project'); }}
                className="bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition text-xs"
              >
                <Plus size={14} />
                <span>TAMBAH PROYEK</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.projects.map(proj => (
                <div key={proj.id} className="p-4 bg-white/5 border border-white/10 rounded flex items-center justify-between gap-4">
                  <div>
                    <strong className="text-sm font-f1 font-bold text-white block">{proj.title}</strong>
                    <span className="text-[10px] text-f1-gray font-f1">{proj.category.toUpperCase()} • {proj.year}</span>
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
                      onClick={() => { if (confirm('Hapus proyek ini?')) deleteProject(proj.id); }}
                      className="p-1.5 bg-red-950/40 hover:bg-f1-red text-white rounded transition"
                      title="Hapus"
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
              <span className="font-f1 font-black text-white text-base uppercase">RIWAYAT PENGALAMAN KERJA ({data.career.length})</span>
              <button
                type="button"
                onClick={() => { setEditingItem(null); setModalType('career'); }}
                className="bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition text-xs"
              >
                <Plus size={14} />
                <span>TAMBAH PENGALAMAN</span>
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
                      onClick={() => { if (confirm('Hapus pengalaman kerja ini?')) deleteCareer(c.id); }}
                      className="p-1.5 bg-red-950/40 hover:bg-f1-red text-white rounded transition"
                      title="Hapus"
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
            <h2 className="text-lg font-f1 font-black text-white uppercase border-b border-white/10 pb-3">RUNNING TICKER (TEKS BERJALAN)</h2>
            <p className="text-f1-gray font-sans">
              Masukkan kalimat-kalimat yang akan ditampilkan pada strip teks berjalan di bawah hero. Pisahkan setiap kalimat dengan tanda koma.
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
              SIMPAN TICKER ✓
            </button>
          </form>
        )}

        {/* TAB 6: AWARDS */}
        {activeTab === 'awards' && (
          <div className="space-y-4 bg-[#13131b] border border-white/10 p-6 rounded-sm shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-f1 font-black text-white text-base uppercase">PENGHARGAAN & PRESTASI ({data.awards.length})</span>
              <button
                type="button"
                onClick={() => { setEditingItem(null); setModalType('award'); }}
                className="bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition text-xs"
              >
                <Plus size={14} />
                <span>TAMBAH PENGHARGAAN</span>
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
                      onClick={() => { if (confirm('Hapus penghargaan ini?')) deleteAward(awd.id); }}
                      className="p-1.5 bg-red-950/40 hover:bg-f1-red text-white rounded transition"
                      title="Hapus"
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
            <h2 className="text-lg font-f1 font-black text-white uppercase border-b border-white/10 pb-3">INFORMASI KONTAK</h2>
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
              className="w-full bg-f1-red hover:bg-f1-darkRed text-white font-f1 font-bold py-3 rounded tracking-widest uppercase transition text-xs shadow-lg shadow-f1-red/20"
            >
              SIMPAN INFORMASI KONTAK ✓
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
                    Semua foto avatar, banner hero, proyek, dan file dokumen sertifikat disimpan di cloud storage Supabase.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-f1-gray">Status Storage:</span>
                  <span className={supabaseReady ? 'text-[#00ff66] font-bold' : 'text-f1-red font-bold'}>
                    {supabaseReady ? 'CONNECTED' : 'UNCONFIGURED'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-black/30 rounded border border-white/5 space-y-1">
                  <span className="text-f1-gray font-mono text-[10px] block">AVATAR PORTRAIT:</span>
                  <span className="text-white font-mono truncate block">
                    {data.hero.photo?.startsWith('http') ? '✓ Supabase CDN' : 'Lokal / Default'}
                  </span>
                </div>
                <div className="p-2.5 bg-black/30 rounded border border-white/5 space-y-1">
                  <span className="text-f1-gray font-mono text-[10px] block">HERO BANNER:</span>
                  <span className="text-white font-mono truncate block">
                    {data.hero.banner?.startsWith('http') ? '✓ Supabase CDN' : 'Lokal / Default'}
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
                <span>{isSyncingAssets ? 'MENGUNGGAH SEMUA ASSET KE SUPABASE...' : 'SINKRONISASI SEMUA ASSET LOKAL KE SUPABASE STORAGE'}</span>
              </button>
            </div>

            {/* Backup JSON */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded space-y-2">
                <strong className="text-sm font-f1 font-bold text-white block uppercase">EXPORT BACKUP JSON</strong>
                <p className="text-f1-gray font-sans text-xs">Unduh salinan cadangan seluruh isi portofolio.</p>
                <button
                  onClick={exportJSON}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-f1 font-bold py-2 rounded flex items-center justify-center gap-2 transition"
                >
                  <Download size={14} />
                  <span>DOWNLOAD JSON</span>
                </button>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded space-y-2">
                <strong className="text-sm font-f1 font-bold text-white block uppercase">IMPORT RESTORE JSON</strong>
                <p className="text-f1-gray font-sans text-xs">Pulihkan data dari file JSON cadangan Anda.</p>
                <label className="w-full bg-white/10 hover:bg-white/20 text-white font-f1 font-bold py-2 rounded flex items-center justify-center gap-2 cursor-pointer transition">
                  <Upload size={14} />
                  <span>PILIH FILE JSON</span>
                  <input type="file" accept=".json" onChange={handleJSONFileImport} className="hidden" />
                </label>
              </div>
            </div>

            {/* Reset Defaults */}
            <div className="p-4 bg-red-950/30 border border-red-500/20 rounded flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <strong className="text-sm font-f1 font-bold text-red-200 block">RESET KE DATA AWAL</strong>
                <p className="text-xs text-red-300/80 font-sans">Kembalikan seluruh konten ke profil awal bawaan sistem.</p>
              </div>
              <button
                onClick={() => { if (confirm('Yakin reset semua data ke setelan awal?')) resetToDefaults(); }}
                className="bg-red-600 hover:bg-red-700 text-white font-f1 font-bold px-4 py-2 rounded transition whitespace-nowrap"
              >
                RESET SEMUA DATA
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
