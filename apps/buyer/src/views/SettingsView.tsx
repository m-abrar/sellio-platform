import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { API_BASE_URL, IS_EXTERNAL_BACKEND, STOREFRONT_BASE_URL } from '../config/api';
import { fetchUserProfile, updateUserProfile, UserProfile } from '../api/userApi';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing' | 'developer'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                        src={profile.avatar || "https://picsum.photos/seed/user/200/200"} 
                        alt="Avatar" 
                        className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button type="button" className="absolute bottom-0 right-0 p-2 bg-zinc-900 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                        <Camera size={18} />
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

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <Shield className="text-amber-500" size={24} />
                  <div>
                    <p className="text-sm font-bold text-amber-900">Two-Factor Authentication is Off</p>
                    <p className="text-xs text-amber-700">Add an extra layer of security to your account.</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto bg-amber-500 text-white border-none hover:bg-amber-600">
                    Enable
                  </Button>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Change Password</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Current Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">New Password</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Confirm New Password</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </div>
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
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={!!profile.settings?.[item.id]} 
                          onChange={(e) => {
                            const newSettings = { ...profile.settings, [item.id]: e.target.checked };
                            setProfile({ ...profile, settings: newSettings });
                            updateUserProfile({ settings: newSettings });
                          }}
                        />
                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8">
                <div className="p-6 bg-zinc-900 rounded-3xl text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-8">Current Plan</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <h4 className="text-3xl font-extrabold mb-1">Premium Pro</h4>
                        <p className="text-sm text-white/70">Next billing date: Oct 12, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">$29.00</p>
                        <p className="text-xs text-white/50">per month</p>
                      </div>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[var(--primary-color)]/20 rounded-full blur-3xl" />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Payment Methods</h4>
                  <div className="p-4 border border-zinc-200 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-8 bg-zinc-100 rounded flex items-center justify-center font-bold text-[10px] text-zinc-400">VISA</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-zinc-900">Visa ending in 4242</p>
                      <p className="text-xs text-zinc-500">Expires 12/26</p>
                    </div>
                    <button className="text-xs font-bold text-[var(--primary-color)] hover:underline">Edit</button>
                  </div>
                  <button className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-2xl text-sm font-bold text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 transition-all">
                    + Add New Payment Method
                  </button>
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
      </div>
    </div>
  );
}
