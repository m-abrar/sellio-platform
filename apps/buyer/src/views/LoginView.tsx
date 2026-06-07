import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, Rocket, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';
import { getBrandSettings, BrandSettings } from '../api/brandApi';
import { applyBrandToDocumentHead } from '../lib/brandHead';
import { getAuthErrorMessage } from '../lib/authErrors';
import SetupReminderBanner from '../components/SetupReminderBanner';

export default function LoginView() {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [brand, setBrand] = useState<BrandSettings | null>(null);

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const data = await getBrandSettings();
        setBrand(data);
        applyBrandToDocumentHead(data);
      } catch (error) {
        console.error('Failed to load brand settings in login:', error);
      }
    };
    loadBrand();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    const loginAction = async () => {
      await login(email, password);
      await new Promise((resolve) => setTimeout(resolve, 300));
    };

    toast.promise(loginAction(), {
      loading: 'Verifying your account...',
      success: () => ({
        message: 'Welcome back',
        description: brand?.site_name ? `Signed in to ${brand.site_name}` : 'Buyer portal access granted',
      }),
      error: (err: unknown) => ({
        message: 'Login failed',
        description: getAuthErrorMessage(err),
      }),
      finally: () => setIsLoading(false),
    });
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col select-none">
      <SetupReminderBanner />
      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="text-center mb-8 sm:mb-10">
            {brand?.site_logo ? (
              <img
                src={brand.site_logo}
                alt={brand.site_name}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-2xl sm:rounded-3xl mx-auto mb-5 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300 bg-white border border-slate-100 p-1.5"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--primary-color)] rounded-2xl sm:rounded-3xl flex items-center justify-center text-white mx-auto mb-5 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
                <Rocket size={28} />
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">
              {brand?.site_name || 'Sellio'} Buyer
            </h1>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
              Customer Portal Access
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 pl-12 text-sm font-bold focus:bg-white focus:border-[var(--primary-color)]/10 focus:ring-4 focus:ring-[var(--primary-color)]/5 transition-all outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 pl-12 pr-14 text-sm font-bold focus:bg-white focus:border-[var(--primary-color)]/10 focus:ring-4 focus:ring-[var(--primary-color)]/5 transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-[var(--primary-color)] transition-colors rounded-xl"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[var(--primary-color)] transition-all active:scale-[0.97] shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <ShieldAlert size={16} />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
