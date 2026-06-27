import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  User,
  Lock,
  Mail,
  Phone,
  Camera,
  Check,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  MapPin,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';
import { LocationPicker } from '../components/LocationPicker';
import { API_BASE_URL } from '../config/api';
import { fetchUserProfile, updateUserProfile, updatePassword, uploadUserAvatar, UserProfile } from '../api/userApi';

const API_ORIGIN = (() => {
  try { return new URL(API_BASE_URL).origin; } catch { return ''; }
})();
const FALLBACK_AVATAR = `${API_ORIGIN}/images/fallbacks/default-avatar.png`;

const TABS = [
  { id: 'profile', label: 'Profile', icon: User, desc: 'Personal information' },
  { id: 'security', label: 'Security', icon: ShieldCheck, desc: 'Password & access' },
] as const;
type Tab = typeof TABS[number]['id'];

function FormField({ label, icon: Icon, children, hint }: { label: string; icon?: React.ElementType; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
        {children}
      </div>
      {hint && <p className="text-[11px] text-slate-400 font-medium">{hint}</p>}
    </div>
  );
}

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [locationDisplay, setLocationDisplay] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUserProfile();
      setProfile(data);
      setLocationDisplay(data.location_title || '');
    } catch {
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !profile) return;
    setIsUploadingAvatar(true);
    try {
      const url = await uploadUserAvatar(profile.id, file);
      setProfile({ ...profile, avatar: url });
      toast.success('Profile photo updated.');
    } catch {
      toast.error('Failed to upload photo.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    try {
      const updated = await updateUserProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location_id: profile.location_id,
        settings: profile.settings,
      });
      setProfile(updated);
      setLocationDisplay(updated.location_title || '');
      toast.success('Profile saved successfully.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (newPassword !== confirmPassword) { setPasswordError('New passwords do not match.'); return; }
    setIsUpdatingPassword(true);
    try {
      await updatePassword({ current_password: currentPassword, password: newPassword, password_confirmation: confirmPassword });
      setPasswordSuccess(true);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const inputCls = (withIcon = true) =>
    cn(
      'w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400',
      'focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] transition-all',
      withIcon ? 'pl-11' : 'pl-4',
    );

  if (isLoading) return (
    <div className="space-y-6 max-w-4xl animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-slate-100 rounded-2xl" />
        <div className="h-4 w-64 bg-slate-100 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <div className="h-14 w-full bg-slate-100 rounded-2xl" />
          <div className="h-14 w-full bg-slate-100 rounded-2xl" />
        </div>
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/70 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-slate-100 shrink-0" />
            <div className="space-y-2.5 flex-1">
              <div className="h-5 w-40 bg-slate-100 rounded-full" />
              <div className="h-4 w-56 bg-slate-100 rounded-full" />
              <div className="h-3 w-32 bg-slate-100 rounded-full" />
              <div className="flex gap-2 mt-1">
                <div className="h-6 w-16 bg-slate-100 rounded-full" />
                <div className="h-6 w-14 bg-slate-100 rounded-full" />
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 bg-slate-100 rounded-full" />
                <div className="h-11 w-full bg-slate-100 rounded-2xl" />
              </div>
            ))}
          </div>
          <div className="px-6 sm:px-8 pb-6 flex justify-end">
            <div className="h-10 w-32 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1.5 font-medium">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-left group',
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200',
              )}
            >
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200')}>
                <tab.icon size={16} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">{tab.label}</p>
                <p className={cn('text-[10px] font-medium mt-0.5 leading-none', activeTab === tab.id ? 'text-white/60' : 'text-slate-400')}>
                  {tab.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {error ? (
            <div className="glass-surface p-10 text-center">
              <p className="text-red-500 mb-4 font-semibold">{error}</p>
              <Button onClick={loadProfile} size="sm">Retry</Button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="glass-surface"
              >
                {activeTab === 'profile' && profile && (
                  <form onSubmit={handleSave}>
                    {/* Avatar section */}
                    <div className="p-6 sm:p-8 border-b border-slate-100">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="relative shrink-0 group">
                          <div className={cn('w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl ring-2 ring-slate-100', isUploadingAvatar && 'opacity-60')}>
                            <img
                              src={profile.avatar || FALLBACK_AVATAR}
                              alt={profile.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                          <button
                            type="button"
                            disabled={isUploadingAvatar}
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-9 h-9 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--primary-color)] transition-colors disabled:opacity-60"
                          >
                            {isUploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                          </button>
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900">{profile.name}</h3>
                          <p className="text-sm text-slate-500 mt-0.5">{profile.email}</p>
                          <p className="text-xs text-slate-400 mt-2 font-medium">
                            Member since {profile.member_since || 'Jan 2024'}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-100">
                              Verified
                            </span>
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-full">
                              Buyer
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="p-6 sm:p-8 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField label="Full Name" icon={User}>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className={inputCls()}
                            placeholder="Your name"
                          />
                        </FormField>
                        <FormField label="Email Address" icon={Mail}>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className={inputCls()}
                            placeholder="you@example.com"
                          />
                        </FormField>
                        <FormField label="Phone Number" icon={Phone}>
                          <input
                            type="tel"
                            value={profile.phone || ''}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className={inputCls()}
                            placeholder="+1 (555) 000-0000"
                          />
                        </FormField>
                        <FormField label="Location" icon={MapPin} hint="Used to surface nearby listings.">
                          <LocationPicker
                            displayValue={locationDisplay}
                            onSelect={(id, title) => { setProfile({ ...profile, location_id: id }); setLocationDisplay(title); }}
                            onClear={() => { setProfile({ ...profile, location_id: null }); setLocationDisplay(''); }}
                            placeholder="Search your city..."
                          />
                        </FormField>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={isSaving} leftIcon={!isSaving ? <Check size={16} /> : undefined}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </form>
                )}

                {activeTab === 'security' && profile && (
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="p-6 sm:p-8 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                          <ShieldCheck size={20} className="text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900">Password & Security</h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">Keep your account protected</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 space-y-5">
                      {passwordSuccess && (
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm font-bold text-emerald-700">
                          <Check size={16} className="shrink-0" />
                          Password updated successfully.
                        </div>
                      )}
                      {passwordError && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600">
                          {passwordError}
                        </div>
                      )}

                      <FormField label="Current Password">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type={showCurrent ? 'text' : 'password'}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className={cn(inputCls(), 'pr-12')}
                          placeholder="Current password"
                        />
                        <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </FormField>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField label="New Password">
                          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type={showNew ? 'text' : 'password'}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={cn(inputCls(), 'pr-12')}
                            placeholder="New password"
                          />
                          <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </FormField>
                        <FormField label="Confirm New Password">
                          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type={showConfirm ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={cn(inputCls(), 'pr-12')}
                            placeholder="Confirm password"
                          />
                          <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </FormField>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={isUpdatingPassword}>
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
