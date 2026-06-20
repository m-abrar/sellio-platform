import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Lock,
  Bell,
  Mail,
  Phone,
  Camera,
  Check,
  Terminal,
  Server,
  Database,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { LocationPicker } from '../components/LocationPicker';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { API_BASE_URL, IS_EXTERNAL_BACKEND, STOREFRONT_BASE_URL } from '../config/api';
import { fetchUserProfile, updateUserProfile, updatePassword, uploadUserAvatar, UserProfile } from '../api/userApi';
import { fetchLocationBySlug } from '../api/locationApi';

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

const FALLBACK_AVATAR = `${API_ORIGIN}/images/fallbacks/default-avatar.png`;

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'developer'>('profile');
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

  const [locationDisplay, setLocationDisplay] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUserProfile();
      setProfile(data);
      // Resolve the stored slug to a display title. Falls back to the raw value
      // (e.g. legacy free-text) if no matching location record is found.
      if (data.location) {
        fetchLocationBySlug(data.location)
          .then(loc => setLocationDisplay(loc ? loc.title : data.location || ''))
          .catch(() => setLocationDisplay(data.location || ''));
      }
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
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
                      <LocationPicker
                        displayValue={locationDisplay}
                        onSelect={(slug, title) => {
                          setProfile({ ...profile, location: slug });
                          setLocationDisplay(title);
                        }}
                        onClear={() => {
                          setProfile({ ...profile, location: '' });
                          setLocationDisplay('');
                        }}
                        placeholder="Search your city or region..."
                      />
                      <p className="text-[11px] text-zinc-400 px-1">Shown on your public profile and used to surface nearby listings.</p>
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
                      Production buyers edit <strong>public/config.js</strong> on the server — no rebuild required:
                    </p>
                    <div className="bg-black/30 rounded-xl p-3 font-mono text-[10px] space-y-1">
                      <p className="text-amber-400">// public/config.js</p>
                      <p className="text-zinc-300">apiUrl: &apos;{API_BASE_URL}&apos;</p>
                      <p className="text-zinc-300">storefrontUrl: &apos;{STOREFRONT_BASE_URL}&apos;</p>
                      <p className="text-zinc-300">basePath: &apos;&apos;</p>
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
      </div>
    </div>
  );
}
