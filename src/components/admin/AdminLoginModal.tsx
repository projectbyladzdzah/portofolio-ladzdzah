import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Lock, Mail, Key, X, AlertCircle, Database, CheckCircle2, ArrowRight } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    setIsAdminOpen,
    loginWithSupabase
  } = usePortfolio();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAdminLoginModalOpen) return null;

  const supabaseReady = isSupabaseConfigured();

  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await loginWithSupabase(email, password);
      if (result.success) {
        setSuccessMsg('Authentication Successful! Launching Control Room...');
        setTimeout(() => {
          setIsAdminLoginModalOpen(false);
          setIsAdminOpen(true);
        }, 600);
      } else {
        setErrorMsg(result.error || 'Invalid username or password.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error communicating with authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#12121a] border border-white/15 rounded-sm shadow-2xl overflow-hidden">
        {/* Top Racing Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-f1-red via-f1-yellow to-f1-red"></div>

        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-[#161622]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-f1-red/20 text-f1-red flex items-center justify-center border border-f1-red/30">
              <Lock size={16} />
            </div>
            <div>
              <span className="text-[10px] font-f1 font-bold tracking-widest text-f1-red uppercase block">
                ADMIN ACCESS VERIFICATION
              </span>
              <h3 className="text-base font-f1 font-black text-white uppercase tracking-wider">
                CONTROL ROOM LOGIN
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsAdminLoginModalOpen(false)}
            className="text-f1-gray hover:text-white p-1 rounded transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cloud Connection Badge */}
        <div className="px-6 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between text-[11px] font-f1">
          <span className="text-f1-gray flex items-center gap-1.5">
            <Database size={12} className={supabaseReady ? 'text-[#00ff66]' : 'text-f1-yellow'} />
            <span>Database Backend:</span>
          </span>
          <span className={`font-bold tracking-wider ${supabaseReady ? 'text-[#00ff66]' : 'text-f1-yellow'}`}>
            {supabaseReady ? '● SUPABASE CLOUD (ONLINE)' : '● LOCAL STORAGE MODE'}
          </span>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-500/30 rounded text-xs text-red-200 flex items-start gap-2 animate-shake font-sans">
              <AlertCircle size={15} className="text-f1-red shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-950/50 border border-green-500/30 rounded text-xs text-green-200 flex items-center gap-2 font-sans">
              <CheckCircle2 size={15} className="text-[#00ff66] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Method: Supabase Email/Password */}
          <form onSubmit={handleSupabaseSubmit} className="space-y-4 font-f1">
            {!supabaseReady && (
              <div className="p-2.5 bg-yellow-950/40 border border-yellow-500/30 rounded text-[11px] text-yellow-200/90 font-sans space-y-1">
                <p className="font-bold font-f1 tracking-wider text-f1-yellow">SUPABASE CREDENTIALS NOT CONFIGURED</p>
                <p>
                  Configure your Supabase credentials in <code>.env</code> or deployment dashboard to log in.
                </p>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-f1-gray tracking-wider block mb-1 uppercase">
                ADMIN USERNAME / EMAIL
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="username or email@domain.com"
                  className="w-full bg-[#181824] border border-white/15 focus:border-f1-red px-3.5 py-2.5 rounded text-white text-xs font-sans outline-none transition"
                />
                <Mail size={14} className="absolute right-3.5 top-3 text-white/30" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-f1-gray tracking-wider block mb-1 uppercase">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181824] border border-white/15 focus:border-f1-red px-3.5 py-2.5 rounded text-white text-xs font-sans outline-none transition"
                />
                <Key size={14} className="absolute right-3.5 top-3 text-white/30" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-f1-red hover:bg-f1-darkRed disabled:opacity-50 text-white font-bold text-xs tracking-widest py-3 rounded uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-f1-red/20"
            >
              {loading ? (
                <span>VERIFYING CREDENTIALS...</span>
              ) : (
                <>
                  <span>ENTER CONTROL ROOM</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Modal Footer Info */}
        <div className="px-6 py-3 bg-[#0c0c12] border-t border-white/10 text-[10px] font-f1 text-f1-gray flex justify-between items-center">
          <span>PORTFOLIO CMS SECURITY</span>
          <span className="text-white/40">VERCEL & SUPABASE AUTH</span>
        </div>
      </div>
    </div>
  );
};
