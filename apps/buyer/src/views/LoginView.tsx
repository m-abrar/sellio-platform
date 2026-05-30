import React, { useState, useEffect } from 'react';
import { Lock, Mail, Rocket } from 'lucide-react';
import { Button } from '../components/Button';
import { useUser } from '../context/UserContext';
import { getBrandSettings, BrandSettings } from '../api/brandApi';

export default function LoginView() {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brand, setBrand] = useState<BrandSettings | null>(null);

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const data = await getBrandSettings();
        setBrand(data);
      } catch (error) {
        console.error('Failed to load brand settings in login:', error);
      }
    };
    loadBrand();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md glass-surface p-8 space-y-6">
        <div className="flex items-center gap-3">
          {brand?.site_logo ? (
            <img src={brand.site_logo} alt={brand.site_name} className="w-12 h-12 object-contain rounded-2xl bg-zinc-50 border border-zinc-100 p-1 shrink-0" />
          ) : (
            <div className="h-12 w-12 rounded-2xl bg-[var(--primary-color)] text-white flex items-center justify-center shrink-0">
              <Rocket size={24} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-950">
              {brand?.site_name || 'Sellio'}
            </h1>
            <p className="text-sm text-zinc-500">Buyer Portal Access</p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email</span>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border-none bg-zinc-50 py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-zinc-900"
              required
            />
          </div>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Password</span>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border-none bg-zinc-50 py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-zinc-900"
              required
            />
          </div>
        </label>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Sign In
        </Button>
      </form>
    </div>
  );
}
