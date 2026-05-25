import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineShieldCheck, HiOutlineUserCircle, HiOutlineLockClosed, HiOutlineBellAlert } from 'react-icons/hi2';
import { getProfile, updateProfile } from '../../api/profile';
import { toast } from 'sonner';

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile({
          name: response.data.name ?? '',
          email: response.data.email ?? '',
          phone_number: response.data.phone ?? '',
          company_name: '',
          website_url: '',
          bio: '',
        });
      } catch (error) {
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

  const sections = [
    { title: 'Profile Identity', icon: HiOutlineUserCircle, description: 'Manage your studio avatar, display name, and public bio.' },
    { title: 'Security & Access', icon: HiOutlineShieldCheck, description: 'Two-factor authentication and session management.' },
    { title: 'Password Control', icon: HiOutlineLockClosed, description: 'Update your credentials and recovery options.' },
    { title: 'Alert Preferences', icon: HiOutlineBellAlert, description: 'Configure how you receive system and market alerts.' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Configuration" title="Studio" subtitle="Settings" />

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium space-y-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900 italic tracking-tight mb-2">Profile Settings.</h3>
          <p className="text-sm text-slate-400 font-medium">Update your partner account details synced with the Laravel API.</p>
        </div>

        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Loading Profile...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Display Name</label>
                <input
                  value={profile.name}
                  onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Phone</label>
                <input
                  value={profile.phone_number}
                  onChange={(event) => setProfile((prev) => ({ ...prev, phone_number: event.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Company</label>
                <input
                  value={profile.company_name}
                  onChange={(event) => setProfile((prev) => ({ ...prev, company_name: event.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(event) => setProfile((prev) => ({ ...prev, bio: event.target.value }))}
                rows={4}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#6610f2] text-white px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#7b2dfd] transition-all disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.slice(1).map((section) => (
          <div key={section.title} className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden transition-all hover:shadow-2xl hover:shadow-purple-100/20">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-purple-50 group-hover:text-[#6610f2] transition-all">
                <section.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-900 italic tracking-tight mb-2">{section.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{section.description}</p>
              </div>
            </div>

            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6610f2] bg-white px-6 py-3 rounded-full shadow-xl border border-purple-100">Coming Soon</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
