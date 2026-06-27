import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineShieldCheck, HiOutlineLockClosed, HiOutlineBellAlert } from 'react-icons/hi2';
import { getProfile, updateProfile, changePassword } from '../../api/profile';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../lib/apiErrorMessage';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone_number: '',
    company_name: '',
    website_url: '',
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [passwordForm, setPasswordForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadError(null);
        const response = await getProfile();
        setProfile({
          name: response.data.name ?? '',
          email: response.data.email ?? '',
          phone_number: response.data.phone ?? '',
          company_name: response.data.company_name ?? '',
          website_url: response.data.website_url ?? '',
          bio: response.data.bio ?? '',
        });
      } catch (error) {
        const message = getApiErrorMessage(error, 'Failed to load profile.');
        setLoadError(message);
        toast.error(message);
        console.error('Failed to fetch profile', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await updateProfile(profile);
      toast.success(response.message || 'Profile updated successfully.');
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error('New passwords do not match.');
      return;
    }
    setIsChangingPassword(true);
    try {
      const response = await changePassword(passwordForm);
      toast.success(response.message || 'Password updated successfully.');
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update password.'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const deferredSections = [
    { title: 'Security & Access', icon: HiOutlineShieldCheck, description: 'Two-factor authentication support is planned for a future release.' },
    { title: 'Alert Preferences', icon: HiOutlineBellAlert, description: 'Granular notification controls are planned for a future release.' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Configuration" title="Settings" subtitle="Account Preferences" />

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-container border border-slate-100 shadow-premium space-y-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900 italic tracking-tight mb-2">Profile Settings.</h3>
          <p className="text-sm text-slate-400 font-medium">Update your partner account details synced with the Laravel API.</p>
        </div>

        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <span className="text-label font-black uppercase tracking-caps-xl text-slate-300 animate-pulse">Loading Profile...</span>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-sm font-bold text-red-600">
            {loadError}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-label font-black text-slate-400 uppercase tracking-widest mb-3">Display Name</label>
                <input
                  value={profile.name}
                  onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/20"
                  required
                />
              </div>
              <div>
                <label className="block text-label font-black text-slate-400 uppercase tracking-widest mb-3">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/20"
                  required
                />
              </div>
              <div>
                <label className="block text-label font-black text-slate-400 uppercase tracking-widest mb-3">Phone</label>
                <input
                  value={profile.phone_number}
                  onChange={(event) => setProfile((prev) => ({ ...prev, phone_number: event.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <label className="block text-label font-black text-slate-400 uppercase tracking-widest mb-3">Company</label>
                <input
                  value={profile.company_name}
                  onChange={(event) => setProfile((prev) => ({ ...prev, company_name: event.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <label className="block text-label font-black text-slate-400 uppercase tracking-widest mb-3">Website URL</label>
                <input
                  type="url"
                  value={profile.website_url}
                  onChange={(event) => setProfile((prev) => ({ ...prev, website_url: event.target.value }))}
                  placeholder="https://example.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-label font-black text-slate-400 uppercase tracking-widest mb-3">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(event) => setProfile((prev) => ({ ...prev, bio: event.target.value }))}
                rows={4}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-brand text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-caps hover:bg-brand-hover transition-all disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </>
        )}
      </form>

      {/* Password Change */}
      <form onSubmit={handlePasswordChange} className="bg-white p-10 rounded-container border border-slate-100 shadow-premium space-y-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 shrink-0">
            <HiOutlineLockClosed className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight mb-1">Password Control.</h3>
            <p className="text-sm text-slate-400 font-medium">Update your login credentials.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-label font-black text-slate-400 uppercase tracking-widest mb-3">Current Password</label>
            <input
              type="password"
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, current_password: e.target.value }))}
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="block text-label font-black text-slate-400 uppercase tracking-widest mb-3">New Password</label>
            <input
              type="password"
              value={passwordForm.password}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))}
              required
              minLength={8}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="block text-label font-black text-slate-400 uppercase tracking-widest mb-3">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.password_confirmation}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, password_confirmation: e.target.value }))}
              required
              minLength={8}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isChangingPassword}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-caps hover:bg-slate-700 transition-all disabled:opacity-60"
        >
          {isChangingPassword ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {/* Deferred sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {deferredSections.map((section) => (
          <div key={section.title} className="group relative bg-white p-10 rounded-container border border-slate-100 shadow-premium overflow-hidden">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                <section.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-black text-slate-900 italic tracking-tight">{section.title}</h3>
                  <span className="text-micro font-black uppercase tracking-widest px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                    Coming soon
                  </span>
                </div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{section.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
