import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Mail, 
  Phone, 
  Camera,
  Check,
  Terminal,
  Server,
  Database,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { API_BASE_URL, IS_EXTERNAL_BACKEND, STOREFRONT_BASE_URL } from '../config/api';
import { fetchUserProfile, updateUserProfile, updatePassword, uploadUserAvatar, UserProfile } from '../api/userApi';

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

const FALLBACK_AVATAR = `${API_ORIGIN}/images/fallbacks/default-avatar.png`;

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing' | 'developer'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUserProfile();
      setProfile(data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || !profile) {
      return;
    }

    setIsUploadingAvatar(true);
    setError(null);

    try {
      const avatarUrl = await uploadUserAvatar(profile.id, file);
      setProfile({ ...profile, avatar: avatarUrl });
    } catch (err) {
      setError('Failed to upload avatar');
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
        location: profile.location,
        settings: profile.settings
      });
      setProfile(updated);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      setPasswordSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Auto-Save Notification settings state
  const [savingSettings, setSavingSettings] = useState<Record<string, 'saving' | 'saved' | null>>({});

  // 2FA states
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorPin, setTwoFactorPin] = useState('');
  const [is2FASaving, setIs2FASaving] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);

  const handleAutoSaveSettings = async (newSettings: any, settingId: string) => {
    setSavingSettings(prev => ({ ...prev, [settingId]: 'saving' }));
    try {
      const updated = await updateUserProfile({
        name: profile?.name || '',
        email: profile?.email || '',
        phone: profile?.phone,
        location: profile?.location,
        settings: newSettings
      });
      setProfile(updated);
      setSavingSettings(prev => ({ ...prev, [settingId]: 'saved' }));
      setTimeout(() => {
        setSavingSettings(prev => ({ ...prev, [settingId]: null }));
      }, 1500);
    } catch {
      setSavingSettings(prev => ({ ...prev, [settingId]: null }));
    }
  };

  const handleToggle2FA = async () => {
    if (!profile) return;
    const isCurrentlyEnabled = !!profile.settings?.two_factor_enabled;

    if (isCurrentlyEnabled) {
      setIsSaving(true);
      try {
        const newSettings = { ...profile.settings, two_factor_enabled: false };
        const updated = await updateUserProfile({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          settings: newSettings
        });
        setProfile(updated);
      } catch (err) {
        alert('Failed to disable Two-Factor Authentication');
      } finally {
        setIsSaving(false);
      }
    } else {
      setTwoFactorPin('');
      setTwoFactorError(null);
      setShow2FAModal(true);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setTwoFactorError(null);

    const cleanPin = twoFactorPin.replace(/\s+/g, '');
    if (cleanPin !== '123456' && cleanPin.length !== 6) {
      setTwoFactorError('Invalid verification code. Please enter 6 digits (e.g. 123456).');
      return;
    }

    setIs2FASaving(true);
    try {
      const newSettings = { ...profile.settings, two_factor_enabled: true };
      const updated = await updateUserProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        settings: newSettings
      });
      setProfile(updated);
      setShow2FAModal(false);
    } catch (err) {
      setTwoFactorError('Failed to enable Two-Factor Authentication');
    } finally {
      setIs2FASaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'developer', label: 'Backend', icon: Terminal },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        breadcrumb="Settings"
        title="Settings"
        description="Manage your account preferences and security settings."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-3">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
                  : "text-zinc-500 hover:bg-white hover:text-zinc-900"
              )}
            >
              <tab.icon size={20} />
              <span className="font-bold text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          {isLoading ? (
            <div className="glass-surface p-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-4" />
              <p className="text-sm text-zinc-500">Loading your settings...</p>
            </div>
          ) : error ? (
            <div className="glass-surface p-12 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadProfile}>Retry</Button>
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-surface p-8"
            >
              {activeTab === 'profile' && profile && (
                <form onSubmit={handleSave} className="space-y-8">
                  <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-zinc-100">
                    <div className="relative group">
                      <img 
                        src={profile.avatar || FALLBACK_AVATAR} 
                        alt="Avatar" 
                        className={cn(
                          "w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover",
                          isUploadingAvatar && "opacity-60"
                        )}
                        referrerPolicy="no-referrer"
                      />
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      <button
                        type="button"
                        disabled={isUploadingAvatar}
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-zinc-900 text-white rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-60 disabled:hover:scale-100"
                        aria-label="Upload avatar"
                      >
                        {isUploadingAvatar ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-bold text-zinc-900">{profile.name}</h3>
                      <p className="text-zinc-500 mb-4">Premium Member since {profile.member_since || 'Jan 2024'}</p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        <Badge variant="success">Verified</Badge>
                        <Badge variant="default">Partner Mode Active</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                          type="text" 
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                          type="email" 
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                          type="tel" 
                          value={profile.phone || ''}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Location</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                          type="text" 
                          value={profile.location || ''}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="submit"
                      isLoading={isSaving}
                      leftIcon={!isSaving && <Check size={20} />}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              )}

            {activeTab === 'security' && profile && (
              <form onSubmit={handlePasswordUpdate} className="space-y-8">
                <div className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                  profile.settings?.two_factor_enabled 
                    ? "bg-emerald-50 border-emerald-100" 
                    : "bg-amber-50 border-amber-100"
                )}>
                  <Shield className={cn(
                    profile.settings?.two_factor_enabled ? "text-emerald-500" : "text-amber-500"
                  )} size={24} />
                  <div>
                    <p className={cn(
                      "text-sm font-bold",
                      profile.settings?.two_factor_enabled ? "text-emerald-900" : "text-amber-900"
                    )}>
                      Two-Factor Authentication is {profile.settings?.two_factor_enabled ? 'On' : 'Off'}
                    </p>
                    <p className={cn(
                      "text-xs",
                      profile.settings?.two_factor_enabled ? "text-emerald-700" : "text-amber-700"
                    )}>
                      Add an extra layer of security to your account by requiring an authenticator code.
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleToggle2FA}
                    className={cn(
                      "ml-auto text-white border-none cursor-pointer",
                      profile.settings?.two_factor_enabled 
                        ? "bg-red-500 hover:bg-red-650" 
                        : "bg-amber-500 hover:bg-amber-600"
                    )}
                  >
                    {profile.settings?.two_factor_enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>

                {passwordSuccess && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600">
                    {passwordSuccess}
                  </div>
                )}

                {passwordError && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Change Password</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Current Password</label>
                      <input 
                        type="password" 
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">New Password</label>
                        <input 
                          type="password" 
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Confirm New Password</label>
                        <input 
                          type="password" 
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" isLoading={isUpdatingPassword}>Update Password</Button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && profile && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {[
                    { id: 'email_notifications', title: 'Email Notifications', desc: 'Receive daily updates and account activity via email.' },
                    { id: 'push_notifications', title: 'Push Notifications', desc: 'Get real-time alerts on your browser or mobile device.' },
                    { id: 'booking_reminders', title: 'Booking Reminders', desc: 'Receive alerts 24 hours before your scheduled events.' },
                    { id: 'marketing_emails', title: 'Marketing Emails', desc: 'Stay updated with our latest features and special offers.' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 rounded-2xl transition-colors">
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{item.title}</p>
                        <p className="text-xs text-zinc-500">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <AnimatePresence>
                          {savingSettings[item.id] === 'saving' && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-[10px] font-bold text-zinc-400"
                            >
                              Saving...
                            </motion.span>
                          )}
                          {savingSettings[item.id] === 'saved' && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-[10px] font-extrabold text-[var(--primary-color)] bg-[var(--primary-light)] px-2.5 py-0.5 rounded-full"
                            >
                              ✓ Saved!
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={!!profile.settings?.[item.id]} 
                            onChange={(e) => {
                              const newSettings = { ...profile.settings, [item.id]: e.target.checked };
                              setProfile({ ...profile, settings: newSettings });
                              handleAutoSaveSettings(newSettings, item.id);
                            }}
                          />
                          <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && profile && (
              <div className="space-y-8">
                <div className="p-6 bg-zinc-900 rounded-3xl text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Wallet Balance</p>
                    <p className="text-3xl font-extrabold mb-1">
                      ${Number(profile.wallet_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-white/70">Credits and refunds from marketplace activity.</p>
                  </div>
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="p-6 border border-zinc-200 rounded-2xl bg-zinc-50 space-y-3">
                  <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Booking payments</h4>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Property and event bookings are paid during storefront checkout. The buyer panel does not store payment cards yet.
                  </p>
                  <a
                    href={STOREFRONT_BASE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-[var(--primary-color)] transition-colors"
                  >
                    Browse storefront
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'developer' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 glass-surface bg-zinc-50/50 p-6 border-none">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "p-2 rounded-xl",
                        IS_EXTERNAL_BACKEND ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                      )}>
                        <Server size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900">Current Backend</h4>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          {IS_EXTERNAL_BACKEND ? 'External API' : 'Local Node Server'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">API Base URL:</span>
                        <code className="bg-white px-2 py-1 rounded border border-zinc-100 font-mono text-[10px]">
                          {API_BASE_URL}
                        </code>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Data Source:</span>
                        <span className="font-bold text-zinc-900">
                          {IS_EXTERNAL_BACKEND ? 'Laravel API' : 'Local development host'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Storefront URL:</span>
                        <code className="bg-white px-2 py-1 rounded border border-zinc-100 font-mono text-[10px]">
                          {STOREFRONT_BASE_URL}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 glass-surface bg-zinc-900 text-white p-6 border-none">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/10 rounded-xl text-[var(--primary-color)]">
                        <Database size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Switch Backend</h4>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Configuration</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                      The buyer panel now talks directly to Laravel. Configure your <strong>.env</strong> file:
                    </p>
                    <div className="bg-black/30 rounded-xl p-3 font-mono text-[10px] space-y-1">
                      <p className="text-amber-400"># Local Laravel</p>
                      <p className="text-zinc-300">VITE_API_URL=http://127.0.0.1:8000/api</p>
                      <p className="text-amber-400"># Storefront browsing</p>
                      <p className="text-zinc-300">VITE_STOREFRONT_URL=http://localhost:3000</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Developer Resources</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a 
                      href="https://laravel.com/docs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                          <ExternalLink size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900">Laravel Docs</p>
                          <p className="text-[10px] text-zinc-500">API Development Guide</p>
                        </div>
                      </div>
                    </a>
                    <a 
                      href="https://expressjs.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 text-zinc-900 rounded-xl flex items-center justify-center">
                          <ExternalLink size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900">Express Docs</p>
                          <p className="text-[10px] text-zinc-500">Node.js Server Guide</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 2FA Verification Modal */}
      <AnimatePresence>
        {show2FAModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative border border-zinc-100 text-left"
            >
              <button 
                type="button"
                onClick={() => setShow2FAModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer border-none bg-transparent"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 leading-tight">Enable 2FA</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Secure Authentication</p>
                </div>
              </div>

              <div className="space-y-4 text-center pb-2">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Scan this QR code with your Google Authenticator or custom 2FA app, then enter the 6-digit verification code below.
                </p>
                {/* Mock QR Code */}
                <div className="w-40 h-40 mx-auto border-2 border-zinc-150 rounded-2xl bg-zinc-100 flex flex-col items-center justify-center p-2 relative group overflow-hidden shadow-2xs">
                  <div className="w-full h-full bg-zinc-950 flex flex-wrap p-1 gap-1.5 opacity-90 transition-opacity group-hover:opacity-100">
                    {[...Array(64)].map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-3 h-3 rounded-[2px]", 
                          (i % 3 === 0 || i % 7 === 0) ? "bg-white" : "bg-black"
                        )} 
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-4 text-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    <span className="text-[10px] font-black uppercase text-zinc-900 tracking-wider">Secret Key</span>
                    <code className="bg-zinc-100 px-2 py-1 rounded font-mono text-[9px] mt-1 text-zinc-650">SELLIO-BUYER-KEY</code>
                  </div>
                </div>
              </div>

              {twoFactorError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-650 mb-4">
                  {twoFactorError}
                </div>
              )}

              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Verification Code</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 123456"
                    value={twoFactorPin}
                    onChange={(e) => setTwoFactorPin(e.target.value)}
                    maxLength={6}
                    className="w-full text-center tracking-[0.4em] font-mono font-bold px-4 py-3 bg-zinc-50 border-none rounded-2xl text-base focus:ring-2 focus:ring-zinc-900 transition-all placeholder-zinc-300 placeholder:tracking-normal placeholder:font-sans placeholder:text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShow2FAModal(false)}
                    disabled={is2FASaving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    isLoading={is2FASaving}
                  >
                    Verify & Enable
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
