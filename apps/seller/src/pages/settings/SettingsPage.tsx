import React from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineShieldCheck, HiOutlineUserCircle, HiOutlineLockClosed, HiOutlineBellAlert } from 'react-icons/hi2';

export default function SettingsPage() {
  const sections = [
    { title: 'Profile Identity', icon: HiOutlineUserCircle, description: 'Manage your studio avatar, display name, and public bio.' },
    { title: 'Security & Access', icon: HiOutlineShieldCheck, description: 'Two-factor authentication and session management.' },
    { title: 'Password Control', icon: HiOutlineLockClosed, description: 'Update your credentials and recovery options.' },
    { title: 'Alert Preferences', icon: HiOutlineBellAlert, description: 'Configure how you receive system and market alerts.' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Configuration" title="Studio" subtitle="Settings" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, i) => (
          <div key={i} className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden transition-all hover:shadow-2xl hover:shadow-purple-100/20">
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

      <div className="bg-slate-900 p-12 rounded-[2.5rem] text-center relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="relative z-10">
          <h4 className="text-2xl font-black text-white italic tracking-tight mb-4">Advanced Studio Controls.</h4>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed mb-8">
            We are currently engineering a suite of advanced security and profile customization tools to give you total control over your marketplace presence.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Development in progress</span>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#6610f2]/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
