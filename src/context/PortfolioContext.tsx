import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PortfolioData,
  DriverHeroData,
  DriverStat,
  BiographyData,
  ProjectItem,
  CareerItem,
  AwardItem,
  ContactData,
  SecurityConfig
} from '../types/portfolio';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaultData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error';
}

export type CloudStatus = 'connected' | 'offline' | 'unconfigured';

export type StorageFolder = 'portraits' | 'banners' | 'projects' | 'certificates' | 'assets';

interface PortfolioContextType {
  data: PortfolioData;
  updateHero: (hero: DriverHeroData) => void;
  updateBiography: (biography: BiographyData) => void;
  updateTicker: (ticker: string[]) => void;
  addProject: (project: ProjectItem) => void;
  updateProject: (project: ProjectItem) => void;
  deleteProject: (id: string) => void;
  addCareer: (career: CareerItem) => void;
  updateCareer: (career: CareerItem) => void;
  deleteCareer: (id: string) => void;
  addAward: (award: AwardItem) => void;
  updateAward: (award: AwardItem) => void;
  deleteAward: (id: string) => void;
  updateContact: (contact: ContactData) => void;
  updateSecurity: (security: SecurityConfig) => void;
  resetToDefaults: () => void;
  exportJSON: () => void;
  importJSON: (jsonStr: string) => boolean;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (unlocked: boolean) => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  loginWithSupabase: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  cloudStatus: CloudStatus;
  activeProjectModal: ProjectItem | null;
  setActiveProjectModal: (project: ProjectItem | null) => void;
  activeAwardModal: AwardItem | null;
  setActiveAwardModal: (award: AwardItem | null) => void;
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'warning' | 'error') => void;
  compressImage: (file: File, maxDim?: number, quality?: number) => Promise<string>;
  processCertificateFile: (file: File) => Promise<{ url: string; type: 'pdf' | 'image'; name: string }>;
  uploadMediaToSupabase: (fileOrBlob: File | Blob, folder: StorageFolder, originalFileName?: string) => Promise<string>;
  uploadImage: (file: File, folder: StorageFolder, maxDim?: number, quality?: number) => Promise<string>;
  syncLocalAssetsToSupabase: () => Promise<{ success: boolean; count: number; message: string }>;
}

const STORAGE_KEY = 'ladzdzah_f1_react_portfolio_v4_2';
const AUTH_KEY = 'ladzdzah_f1_admin_auth_session';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const sanitizeHeroStats = (stats: any[], awardsCount?: number): DriverStat[] => {
  if (!Array.isArray(stats)) return DEFAULT_PORTFOLIO_DATA.hero.stats;
  return stats.map(stat => {
    const rawLabel = String(stat.label || '');
    if (rawLabel.toUpperCase().includes('AWARD') || rawLabel.toUpperCase().includes('CERTIFICATE')) {
      let val = String(stat.value || '');
      if (/award|title/i.test(val)) {
        val = val.replace(/\d+\s*(?:gold\s*)?(?:titles?|awards?)\s*(?:&|\+|\/)?\s*/gi, '').trim();
        if (!val) {
          val = `${awardsCount || 3} Verified`;
        }
      }
      return {
        ...stat,
        label: 'CERTIFICATES',
        value: val
      };
    }
    return stat;
  });
};

const sanitizeProjects = (projectsList: any[]): ProjectItem[] => {
  if (!Array.isArray(projectsList)) return [];
  return projectsList.map(p => {
    const images = Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : (p.image ? [p.image] : []);
    return {
      ...p,
      image: p.image || images[0] || '',
      images
    };
  });
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      // Clean up previous storage versions so obsolete cached data is purged
      ['ladzdzah_f1_react_portfolio_v3_6', 'ladzdzah_f1_react_portfolio_v3_7', 'ladzdzah_f1_react_portfolio_v3_8', 'ladzdzah_f1_react_portfolio_v4_0', 'ladzdzah_f1_react_portfolio_v4_1'].forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });

      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_PORTFOLIO_DATA;
      const parsed = JSON.parse(saved);

      const awards = Array.isArray(parsed.awards) ? parsed.awards : DEFAULT_PORTFOLIO_DATA.awards;
      const hero = {
        ...DEFAULT_PORTFOLIO_DATA.hero,
        ...(parsed.hero || {}),
        stats: sanitizeHeroStats(parsed.hero?.stats, awards.length)
      };
      const career = Array.isArray(parsed.career) ? parsed.career : DEFAULT_PORTFOLIO_DATA.career;
      const rawProjects = Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PORTFOLIO_DATA.projects;
      const projects = sanitizeProjects(rawProjects);

      return {
        ...DEFAULT_PORTFOLIO_DATA,
        ...parsed,
        hero,
        awards,
        career,
        biography: { ...DEFAULT_PORTFOLIO_DATA.biography, ...(parsed.biography || {}) },
        contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...(parsed.contact || {}) },
        security: { ...DEFAULT_PORTFOLIO_DATA.security, ...(parsed.security || {}) },
        projects,
        ticker: Array.isArray(parsed.ticker) ? parsed.ticker : DEFAULT_PORTFOLIO_DATA.ticker
      };
    } catch {
      return DEFAULT_PORTFOLIO_DATA;
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>(() =>
    isSupabaseConfigured() ? 'connected' : 'unconfigured'
  );
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [activeAwardModal, setActiveAwardModal] = useState<AwardItem | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Sync to Cloud Supabase
  const syncToSupabase = useCallback(async (updatedData: PortfolioData) => {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
      const { error } = await supabase
        .from('portfolio_content')
        .upsert(
          {
            id: 'main',
            data: updatedData,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'id' }
        );

      if (error) {
        console.warn('[Supabase Sync Error]:', error.message);
        setCloudStatus('offline');
        if (error.code === '42501') {
          showToast('Sesi Supabase kedaluwarsa. Silakan login ulang agar tersimpan di Cloud.', 'warning');
        }
      } else {
        setCloudStatus('connected');
      }
    } catch (err) {
      console.warn('[Supabase Sync Network Error]:', err);
      setCloudStatus('offline');
    }
  }, [showToast]);

  // Fetch initial data from Supabase on load
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setCloudStatus('unconfigured');
      return;
    }

    let isMounted = true;

    // Check existing Supabase auth session & listen for state changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && isMounted) {
        setIsAdminUnlocked(true);
        try {
          sessionStorage.setItem(AUTH_KEY, 'true');
        } catch {}
      } else if (!session && isMounted) {
        setIsAdminUnlocked(false);
        try {
          sessionStorage.removeItem(AUTH_KEY);
        } catch {}
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        setIsAdminUnlocked(true);
        try { sessionStorage.setItem(AUTH_KEY, 'true'); } catch {}
      } else if (event === 'SIGNED_OUT') {
        setIsAdminUnlocked(false);
        try { sessionStorage.removeItem(AUTH_KEY); } catch {}
      }
    });

    const loadCloudData = async () => {
      try {
        const { data: row, error } = await supabase!
          .from('portfolio_content')
          .select('data')
          .eq('id', 'main')
          .maybeSingle();

        if (!isMounted) return;

        if (error) {
          console.warn('[Supabase Fetch Error]:', error.message);
          setCloudStatus('offline');
          return;
        }

        if (row && row.data) {
          setData(prev => {
            const cloudAwards = Array.isArray(row.data.awards) ? row.data.awards : prev.awards;
            const cloudHero = {
              ...DEFAULT_PORTFOLIO_DATA.hero,
              ...(row.data.hero || {}),
              stats: sanitizeHeroStats(row.data.hero?.stats, cloudAwards.length)
            };
            const cloudCareer = Array.isArray(row.data.career) ? row.data.career : prev.career;
            const cloudProjects = sanitizeProjects(Array.isArray(row.data.projects) ? row.data.projects : prev.projects);
            const cloudTicker = Array.isArray(row.data.ticker) ? row.data.ticker : prev.ticker;

            return {
              ...prev,
              ...row.data,
              hero: cloudHero,
              career: cloudCareer,
              awards: cloudAwards,
              biography: { ...DEFAULT_PORTFOLIO_DATA.biography, ...prev.biography, ...(row.data.biography || {}) },
              contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...prev.contact, ...(row.data.contact || {}) },
              security: { ...DEFAULT_PORTFOLIO_DATA.security, ...prev.security, ...(row.data.security || {}) },
              projects: cloudProjects,
              ticker: cloudTicker
            };
          });
          setCloudStatus('connected');
        } else {
          // If table is empty, seed initial data
          syncToSupabase(DEFAULT_PORTFOLIO_DATA);
          setCloudStatus('connected');
        }
      } catch {
        if (isMounted) setCloudStatus('offline');
      }
    };

    loadCloudData();

    // Listen for real-time updates across tabs and devices
    const realtimeChannel = supabase
      .channel('portfolio_content_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portfolio_content' },
        (payload: any) => {
          if (!isMounted) return;
          if (payload?.new && payload.new.data) {
            setData(prev => {
              const rtAwards = Array.isArray(payload.new.data.awards) ? payload.new.data.awards : prev.awards;
              const rtHero = {
                ...prev.hero,
                ...(payload.new.data.hero || {}),
                stats: sanitizeHeroStats(payload.new.data.hero?.stats, rtAwards.length)
              };
              return {
                ...prev,
                ...payload.new.data,
                hero: rtHero,
                biography: { ...prev.biography, ...(payload.new.data.biography || {}) },
                contact: { ...prev.contact, ...(payload.new.data.contact || {}) },
                career: Array.isArray(payload.new.data.career) ? payload.new.data.career : prev.career,
                awards: rtAwards,
                projects: Array.isArray(payload.new.data.projects) ? payload.new.data.projects : prev.projects,
                ticker: Array.isArray(payload.new.data.ticker) ? payload.new.data.ticker : prev.ticker
              };
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
      if (supabase) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [syncToSupabase]);

  // Sync to localStorage with quota protection
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage quota exceeded, storing lean data:', e);
      try {
        const leanData = JSON.parse(JSON.stringify(data));
        if (leanData.hero?.banner?.startsWith('data:')) {
          leanData.hero.banner = 'assets/driver-f1-banner.webp';
        }
        if (Array.isArray(leanData.hero?.banners)) {
          leanData.hero.banners = leanData.hero.banners.filter((b: string) => !b.startsWith('data:'));
          if (leanData.hero.banners.length === 0) {
            leanData.hero.banners = ['assets/driver-f1-banner.webp'];
          }
        }
        if (leanData.hero?.photo?.startsWith('data:')) {
          leanData.hero.photo = 'assets/driver-portrait.png';
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leanData));
      } catch {}
      showToast('Penyimpanan lokal penuh. Gambar disarankan diunggah ke CDN Supabase.', 'warning');
    }
  }, [data, showToast]);

  // Auth Functions
  const loginWithSupabase = async (emailOrUser: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: 'Kunci Supabase belum disetel di .env atau Vercel. Pastikan kredensial Supabase sudah terkonfigurasi.'
      };
    }

    try {
      const cleanInput = emailOrUser.trim().toLowerCase();
      const candidateEmails: string[] = [];
      if (cleanInput.includes('@')) {
        candidateEmails.push(cleanInput);
      }
      if (!candidateEmails.includes('ladzdzahhanannaafimufidz@gmail.com')) {
        candidateEmails.push('ladzdzahhanannaafimufidz@gmail.com');
      }
      if (!cleanInput.includes('@')) {
        candidateEmails.push(`${cleanInput}@portfolio.admin`);
        candidateEmails.push(`${cleanInput}@gmail.com`);
      }

      let lastError = 'Email atau username tidak ditemukan.';
      for (const candidate of candidateEmails) {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: candidate,
          password: pass
        });

        if (!error && authData?.session) {
          setIsAdminUnlocked(true);
          try {
            sessionStorage.setItem(AUTH_KEY, 'true');
          } catch {}
          showToast('Login Admin Supabase Berhasil!', 'success');
          return { success: true };
        }
        if (error) {
          lastError = error.message;
        }
      }

      return { success: false, error: lastError };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Gagal menghubungi server Supabase.' };
    }
  };

  const logoutAdmin = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setIsAdminUnlocked(false);
    setIsAdminOpen(false);
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {}
    showToast('Admin telah logout.', 'warning');
  };

  // Auto-migrate any residual awards stats in localStorage/state
  useEffect(() => {
    setData(prev => {
      const sanitized = sanitizeHeroStats(prev.hero.stats, prev.awards?.length);
      const isDifferent = JSON.stringify(sanitized) !== JSON.stringify(prev.hero.stats);
      if (!isDifferent) return prev;
      const next = {
        ...prev,
        hero: {
          ...prev.hero,
          stats: sanitized
        }
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      syncToSupabase(next);
      return next;
    });
  }, [syncToSupabase]);

  // Content Updaters
  const updateHero = (hero: DriverHeroData) => {
    const sanitizedHero = {
      ...hero,
      stats: sanitizeHeroStats(hero.stats, data.awards?.length)
    };
    setData(prev => {
      const next = { ...prev, hero: sanitizedHero };
      syncToSupabase(next);
      return next;
    });
    showToast('Profil Hero & Engineer berhasil disimpan!', 'success');
  };

  const updateBiography = (biography: BiographyData) => {
    setData(prev => {
      const next = { ...prev, biography };
      syncToSupabase(next);
      return next;
    });
    showToast('Biografi berhasil disimpan!', 'success');
  };

  const updateTicker = (ticker: string[]) => {
    setData(prev => {
      const next = { ...prev, ticker };
      syncToSupabase(next);
      return next;
    });
    showToast('Teks Ticker berhasil disimpan!', 'success');
  };

  const addProject = (project: ProjectItem) => {
    setData(prev => {
      const next = { ...prev, projects: [project, ...prev.projects] };
      syncToSupabase(next);
      return next;
    });
    showToast('Proyek baru berhasil ditambahkan!', 'success');
  };

  const updateProject = (project: ProjectItem) => {
    setData(prev => {
      const next = { ...prev, projects: prev.projects.map(p => (p.id === project.id ? project : p)) };
      syncToSupabase(next);
      return next;
    });
    showToast('Proyek berhasil diupdate!', 'success');
  };

  const deleteProject = (id: string) => {
    setData(prev => {
      const next = { ...prev, projects: prev.projects.filter(p => p.id !== id) };
      syncToSupabase(next);
      return next;
    });
    showToast('Proyek telah dihapus.', 'warning');
  };

  const addCareer = (careerItem: CareerItem) => {
    setData(prev => {
      const next = { ...prev, career: [careerItem, ...prev.career] };
      syncToSupabase(next);
      return next;
    });
    showToast('Pengalaman kerja baru berhasil ditambahkan!', 'success');
  };

  const updateCareer = (careerItem: CareerItem) => {
    setData(prev => {
      const next = { ...prev, career: prev.career.map(c => (c.id === careerItem.id ? careerItem : c)) };
      syncToSupabase(next);
      return next;
    });
    showToast('Pengalaman kerja berhasil diupdate!', 'success');
  };

  const deleteCareer = (id: string) => {
    setData(prev => {
      const next = { ...prev, career: prev.career.filter(c => c.id !== id) };
      syncToSupabase(next);
      return next;
    });
    showToast('Riwayat kerja telah dihapus.', 'warning');
  };

  const addAward = (award: AwardItem) => {
    setData(prev => {
      const next = { ...prev, awards: [award, ...prev.awards] };
      syncToSupabase(next);
      return next;
    });
    showToast('Penghargaan baru berhasil ditambahkan!', 'success');
  };

  const updateAward = (award: AwardItem) => {
    setData(prev => {
      const next = { ...prev, awards: prev.awards.map(a => (a.id === award.id ? award : a)) };
      syncToSupabase(next);
      return next;
    });
    showToast('Penghargaan berhasil diupdate!', 'success');
  };

  const deleteAward = (id: string) => {
    setData(prev => {
      const next = { ...prev, awards: prev.awards.filter(a => a.id !== id) };
      syncToSupabase(next);
      return next;
    });
    showToast('Penghargaan telah dihapus.', 'warning');
  };

  const updateContact = (contact: ContactData) => {
    setData(prev => {
      const next = { ...prev, contact };
      syncToSupabase(next);
      return next;
    });
    showToast('Informasi Kontak berhasil disimpan!', 'success');
  };

  const updateSecurity = (security: SecurityConfig) => {
    setData(prev => {
      const next = { ...prev, security };
      syncToSupabase(next);
      return next;
    });
    showToast('Pengaturan keamanan PIN berhasil diupdate!', 'success');
  };

  const resetToDefaults = () => {
    const defaults = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    setData(defaults);
    syncToSupabase(defaults);
    showToast('Seluruh data berhasil direset ke setelan awal!', 'warning');
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ladzdzah_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File backup JSON berhasil didownload!', 'success');
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.hero || !Array.isArray(parsed.projects)) {
        throw new Error('Invalid schema structure');
      }
      setData(parsed);
      syncToSupabase(parsed);
      showToast('Data berhasil diimpor & dimuat ulang!', 'success');
      return true;
    } catch {
      showToast('Gagal mengimpor file JSON: Format tidak sesuai', 'error');
      return false;
    }
  };

  const compressImage = (file: File, maxDim = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const scale = Math.min(1, maxDim / img.width, maxDim / img.height);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context not available'));
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Convert image to Blob for direct Supabase Storage CDN upload
  const compressImageToBlob = (file: File, maxDim = 1600, quality = 0.85): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const scale = Math.min(1, maxDim / img.width, maxDim / img.height);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context not available'));
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            blob => {
              if (blob) {
                resolve(blob);
              } else {
                canvas.toBlob(
                  fallbackBlob => {
                    if (fallbackBlob) resolve(fallbackBlob);
                    else reject(new Error('Gagal menghasilkan blob gambar'));
                  },
                  'image/jpeg',
                  quality
                );
              }
            },
            'image/webp',
            quality
          );
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Convert Base64 Data URL to Blob for cloud storage migration
  const dataUrlToBlob = (dataUrl: string): Blob => {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Upload any media (Photo, Banner, Project, Certificate) directly to Supabase Storage bucket 'portfolio-assets'
  const uploadMediaToSupabase = async (
    fileOrBlob: File | Blob,
    folder: StorageFolder,
    originalFileName?: string
  ): Promise<string> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const isWebpBlob = fileOrBlob.type.includes('webp');
        const isPdf = fileOrBlob.type.includes('pdf');
        const fallbackExt = isPdf
          ? 'pdf'
          : fileOrBlob.type.includes('png')
          ? 'png'
          : isWebpBlob
          ? 'webp'
          : 'jpg';

        let ext = isPdf ? 'pdf' : (isWebpBlob ? 'webp' : fallbackExt);
        let rawBaseName: string = folder;

        if (originalFileName) {
          const parts = originalFileName.split('.');
          if (parts.length > 1) {
            const originalExt = (parts.pop() || fallbackExt).toLowerCase();
            if (!isWebpBlob && !isPdf) {
              ext = originalExt;
            }
            rawBaseName = parts.join('.');
          } else {
            rawBaseName = originalFileName;
          }
        }

        const cleanName = rawBaseName
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '-')
          .slice(0, 32);

        const filePath = `${folder}/${Date.now()}_${cleanName}.${ext}`;
        const contentType = fileOrBlob.type || (ext === 'webp' ? 'image/webp' : ext === 'pdf' ? 'application/pdf' : 'image/jpeg');

        const { data: uploadData, error } = await supabase.storage
          .from('portfolio-assets')
          .upload(filePath, fileOrBlob, {
            cacheControl: '31536000',
            upsert: true,
            contentType
          });

        if (!error && uploadData?.path) {
          const { data: urlData } = supabase.storage
            .from('portfolio-assets')
            .getPublicUrl(uploadData.path);

          if (urlData?.publicUrl) {
            return urlData.publicUrl;
          }
        } else if (error) {
          console.warn('[Supabase Storage Upload Error]:', error.message);
          showToast(`Supabase Storage: ${error.message}. Fallback ke lokal.`, 'warning');
        }
      } catch (err: any) {
        console.warn('[Supabase Storage Upload Exception]:', err);
      }
    }

    // Fallback: Convert to DataURL if Supabase not configured or offline
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBlob);
    });
  };

  // High-level helper: compress image then upload to Supabase Storage
  const uploadImage = async (
    file: File,
    folder: StorageFolder,
    maxDim = 1600,
    quality = 0.85
  ): Promise<string> => {
    try {
      const compressedBlob = await compressImageToBlob(file, maxDim, quality);
      return await uploadMediaToSupabase(compressedBlob, folder, file.name);
    } catch (err) {
      console.warn('Compress blob error, using dataURL fallback:', err);
      return await compressImage(file, maxDim, quality);
    }
  };

  // Certificate processing: PDFs and images are uploaded to Supabase Storage 'portfolio-assets/certificates/'
  const processCertificateFile = async (file: File): Promise<{ url: string; type: 'pdf' | 'image'; name: string }> => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      try {
        const publicUrl = await uploadMediaToSupabase(file, 'certificates', file.name);
        return {
          url: publicUrl,
          type: 'pdf',
          name: file.name
        };
      } catch (e) {
        console.warn('Certificate PDF upload error:', e);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = reject;
          reader.onload = () => {
            resolve({
              url: reader.result as string,
              type: 'pdf',
              name: file.name
            });
          };
          reader.readAsDataURL(file);
        });
      }
    } else {
      try {
        const compressedBlob = await compressImageToBlob(file, 2048, 0.9);
        const publicUrl = await uploadMediaToSupabase(compressedBlob, 'certificates', file.name);
        return {
          url: publicUrl,
          type: 'image',
          name: file.name
        };
      } catch {
        const url = await compressImage(file, 2048, 0.9);
        return {
          url,
          type: 'image',
          name: file.name
        };
      }
    }
  };

  // One-click Migration: Sync all local photos & certificates into Supabase Storage
  const syncLocalAssetsToSupabase = async (): Promise<{ success: boolean; count: number; message: string }> => {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        count: 0,
        message: 'Supabase belum terhubung. Konfigurasikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env terlebih dahulu.'
      };
    }

    try {
      let count = 0;
      const nextData = JSON.parse(JSON.stringify(data)) as PortfolioData;

      // 1. Sync Portrait Photo
      if (nextData.hero.photo && !nextData.hero.photo.startsWith('http')) {
        try {
          const photoPath = nextData.hero.photo.startsWith('/') ? nextData.hero.photo : `/${nextData.hero.photo}`;
          let blob: Blob | null = null;
          if (nextData.hero.photo.startsWith('data:')) {
            blob = dataUrlToBlob(nextData.hero.photo);
          } else {
            const res = await fetch(photoPath);
            if (res.ok) blob = await res.blob();
          }
          if (blob) {
            const publicUrl = await uploadMediaToSupabase(blob, 'portraits', 'driver-portrait.png');
            if (publicUrl.startsWith('http')) {
              nextData.hero.photo = publicUrl;
              count++;
            }
          }
        } catch (err) {
          console.warn('Sync portrait failed:', err);
        }
      }

      // 2. Sync Hero Banner
      if (nextData.hero.banner && !nextData.hero.banner.startsWith('http')) {
        try {
          const bannerPath = nextData.hero.banner.startsWith('/') ? nextData.hero.banner : `/${nextData.hero.banner}`;
          let blob: Blob | null = null;
          if (nextData.hero.banner.startsWith('data:')) {
            blob = dataUrlToBlob(nextData.hero.banner);
          } else {
            const res = await fetch(bannerPath);
            if (res.ok) blob = await res.blob();
          }
          if (blob) {
            const publicUrl = await uploadMediaToSupabase(blob, 'banners', 'driver-f1-banner.webp');
            if (publicUrl.startsWith('http')) {
              nextData.hero.banner = publicUrl;
              count++;
            }
          }
        } catch (err) {
          console.warn('Sync banner failed:', err);
        }
      }

      // 3. Sync Project Images
      for (const project of nextData.projects) {
        if (project.image && project.image.startsWith('data:image')) {
          try {
            const blob = dataUrlToBlob(project.image);
            const publicUrl = await uploadMediaToSupabase(blob, 'projects', `${project.id}.webp`);
            if (publicUrl.startsWith('http')) {
              project.image = publicUrl;
              count++;
            }
          } catch (err) {
            console.warn(`Sync project ${project.id} failed:`, err);
          }
        }
      }

      // 4. Sync Certificate Documents
      for (const award of nextData.awards) {
        if (award.certificateUrl && award.certificateUrl.startsWith('data:')) {
          try {
            const isPdf = award.certificateType === 'pdf' || award.certificateUrl.startsWith('data:application/pdf');
            const blob = dataUrlToBlob(award.certificateUrl);
            const publicUrl = await uploadMediaToSupabase(blob, 'certificates', award.certificateFileName || `${award.id}.${isPdf ? 'pdf' : 'webp'}`);
            if (publicUrl.startsWith('http')) {
              award.certificateUrl = publicUrl;
              count++;
            }
          } catch (err) {
            console.warn(`Sync award ${award.id} failed:`, err);
          }
        }
      }

      if (count > 0) {
        setData(nextData);
        syncToSupabase(nextData);
        showToast(`Berhasil mengunggah & menyimpan ${count} foto asset ke Supabase Storage!`, 'success');
        return { success: true, count, message: `Berhasil mengunggah ${count} foto asset ke Supabase Storage!` };
      } else {
        showToast('Semua foto asset & sertifikat sudah tersimpan di Supabase Storage.', 'success');
        return { success: true, count: 0, message: 'Semua foto asset sudah tersimpan di Supabase Storage.' };
      }
    } catch (err: any) {
      showToast(`Gagal sinkronisasi asset: ${err?.message || 'Error'}`, 'error');
      return { success: false, count: 0, message: err?.message || 'Gagal sinkronisasi asset ke Supabase.' };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateHero,
        updateBiography,
        updateTicker,
        addProject,
        updateProject,
        deleteProject,
        addCareer,
        updateCareer,
        deleteCareer,
        addAward,
        updateAward,
        deleteAward,
        updateContact,
        updateSecurity,
        resetToDefaults,
        exportJSON,
        importJSON,
        isAdminOpen,
        setIsAdminOpen,
        isAdminUnlocked,
        setIsAdminUnlocked,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        loginWithSupabase,
        logoutAdmin,
        cloudStatus,
        activeProjectModal,
        setActiveProjectModal,
        activeAwardModal,
        setActiveAwardModal,
        toasts,
        showToast,
        compressImage,
        processCertificateFile,
        uploadMediaToSupabase,
        uploadImage,
        syncLocalAssetsToSupabase
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
