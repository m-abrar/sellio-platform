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
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { LocationPicker } from '../components/LocationPicker';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { API_BASE_URL } from '../config/api';
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
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
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
      setLocationDisplay(data.location_title || '');
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
        location_id: profile.location_id,
        settings: profile.settings
      });
      setProfile(updated);
      setLocationDisplay(updated.location_title || '');
      toast.success('Profile updated successfully.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile. Please try again.');
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
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
              className="glass-surface p-4 sm:p-8"
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
                        onSelect={(id, title) => {
                          setProfile({ ...profile, location_id: id });
                          setLocationDisplay(title);
                        }}
                        onClear={() => {
                          setProfile({ ...profile, location_id: null });
                          setLocationDisplay('');
                        }}
                        placeholder="Search your city or region..."
                      />
                      <p className="text-[11px] text-zinc-400 px-1">Shown on your public profile and used to surface nearby listings.</p>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
                    <Button
                      type="submit"
                      isLoading={isSaving}
                      leftIcon={!isSaving && <Check size={20} />}
                      className="w-full sm:w-auto"
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

                <div className="pt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
                  <Button type="submit" isLoading={isUpdatingPassword} className="w-full sm:w-auto">Update Password</Button>
                </div>
              </form>
            )}

          </motion.div>
        )}
      </div>
      </div>
    </div>
  );
}
