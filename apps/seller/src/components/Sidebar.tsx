import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  HiOutlineSquares2X2, HiOutlineChartBar, HiOutlineBell,
  HiOutlineFolder, HiChevronDown, HiOutlineHome, HiOutlineCalendar,
  HiOutlineTruck, HiOutlineBriefcase, HiOutlineShoppingBag,
  HiOutlineRectangleStack, HiOutlinePower, HiOutlineWallet,
  HiOutlineBanknotes, HiOutlineCog6Tooth, HiOutlineCreditCard,
  HiOutlineChatBubbleLeftRight, HiOutlineStar, HiOutlineUsers,
  HiOutlineWrenchScrewdriver, HiXMark, HiBars3BottomLeft, HiOutlineShieldCheck,
  HiOutlineTag
} from 'react-icons/hi2';

import { getSidebarCounts } from '../api/sidebar';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ user }: any) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [counts, setCounts] = useState<any>({});

  const prevCounts = useRef<Record<string, number>>({});
  const isFirstMount = useRef(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const response = await getSidebarCounts();
      if (response && response.data) {
        setCounts(response.data);
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileOpen]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const modules = [
    { name: 'Properties', label: 'Property Bookings', slug: 'properties', icon: HiOutlineHome, type: 'Bookings', count: counts.activity_properties || 0, color: 'bg-blue-50 text-blue-600' },
    { name: 'Events', label: 'Event Bookings', slug: 'events', icon: HiOutlineCalendar, type: 'Bookings', count: counts.activity_events || 0, color: 'bg-purple-50 text-purple-600' },
    { name: 'Autos', label: 'Auto Inquiries', slug: 'autos', icon: HiOutlineTruck, type: 'Inquiries', count: counts.activity_autos || 0, color: 'bg-orange-50 text-orange-600' },
    { name: 'Jobs', label: 'Job Applications', slug: 'joblistings', icon: HiOutlineBriefcase, type: 'Applications', count: counts.activity_joblistings || 0, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Services', label: 'Service Inquiries', slug: 'services', icon: HiOutlineWrenchScrewdriver, type: 'Inquiries', count: counts.activity_services || 0, color: 'bg-pink-50 text-pink-600' },
    { name: 'Products', label: 'Product Orders', slug: 'products', icon: HiOutlineShoppingBag, type: 'Orders', count: counts.activity_products || 0, color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Classifieds', label: 'Classified Inquiries', slug: 'classifieds', icon: HiOutlineTag, type: 'Inquiries', count: counts.activity_classifieds || 0, color: 'bg-amber-50 text-amber-600' },
  ];

  const backOfficeLinks = [
    { label: 'Customers', to: '/dashboard/customers', icon: HiOutlineUsers, count: counts.customers },
    { label: 'Reviews', to: '/dashboard/reviews', icon: HiOutlineStar, count: counts.reviews },
    { label: 'Messages', to: '/dashboard/messages', icon: HiOutlineChatBubbleLeftRight, count: counts.messages },
    { label: 'Notifications', to: '/dashboard/notifications', icon: HiOutlineBell, count: counts.notifications },
    { label: 'Wallet', to: '/dashboard/wallet', icon: HiOutlineWallet, count: counts.wallet },
    { label: 'Payouts', to: '/dashboard/payouts', icon: HiOutlineBanknotes, count: counts.payouts },
    { label: 'Memberships', to: '/dashboard/memberships', icon: HiOutlineShieldCheck, count: counts.memberships },
    { label: 'Analytics', to: '/dashboard/analytics', icon: HiOutlineChartBar, count: counts.analytics },
    { label: 'Settings', to: '/dashboard/settings', icon: HiOutlineCog6Tooth },
  ];

  useEffect(() => {
    if (isFirstMount.current) {
      modules.forEach(mod => { prevCounts.current[`${mod.slug}-${mod.type}`] = mod.count; });
      isFirstMount.current = false;
      return;
    }
    modules.forEach(mod => {
      const key = `${mod.slug}-${mod.type}`;
      if (mod.count > (prevCounts.current[key] || 0)) {
        toast.success(`New Activity`, { description: `New ${mod.type} for ${mod.name}.` });
      }
      prevCounts.current[key] = mod.count;
    });
  }, [user]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const toastId = toast.loading('Signing out...');
    try {
      await logout();
      toast.dismiss(toastId);
      window.location.href = '/login';
    } catch (e) {
      toast.dismiss(toastId);
      window.location.href = '/login';
    }
  };

  const NavGroupHeader = ({ children }: { children: React.ReactNode }) => (
    <h6 className="px-5 mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mt-8 first:mt-0">
      {children}
    </h6>
  );

  return (
    <>
      {/* 1. MOBILE FULL-SCREEN COMMAND CENTER (UNTOUCHED) */}
      <div className={`fixed inset-0 z-[4000] bg-[#fbfcfd] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${isMobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}>
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between px-8 pt-12 pb-6 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6610f2] to-[#8b5cf6] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-200">S</div>
              <div className="flex flex-col ms-3 min-w-0">
                <span className="text-lg font-black text-slate-900 tracking-tighter leading-none">Sellio.</span>
                <span className="text-[8px] font-black text-purple-500 uppercase tracking-[0.2em] mt-1">Studio Partner</span>
              </div>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="w-10 h-10 rounded-xl bg-white shadow-md text-slate-900 flex items-center justify-center border border-slate-100 active:scale-90 transition-transform">
              <HiXMark className="w-5 h-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 pb-40 custom-scrollbar">
            <NavGroupHeader>Live Activity</NavGroupHeader>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {modules.map((mod, i) => (
                <NavLink key={i} to={`/dashboard/${mod.slug}/${mod.type.toLowerCase()}`} className="relative bg-white p-5 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm active:scale-95 transition-all">
                  <div className={`w-12 h-12 ${mod.color} rounded-2xl flex items-center justify-center mb-3`}><mod.icon className="w-6 h-6" /></div>
                  <span className="text-xs font-black text-slate-900">{mod.label}</span>
                  {mod.count > 0 && <div className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">{mod.count}</div>}
                </NavLink>
              ))}
            </div>

            <NavGroupHeader>Media & Inventory</NavGroupHeader>
            <div className="grid grid-cols-1 gap-2 mb-6">
              {Array.from(new Set(modules.map(m => m.slug))).map((slug) => {
                const count = counts[slug === 'joblistings' ? 'jobs' : slug] || 0;
                return (
                  <NavLink key={slug} to={`/dashboard/${slug}`} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 text-slate-600 font-bold text-sm active:bg-slate-50">
                    <div className="flex items-center">
                      <HiOutlineFolder className="w-5 h-5 mr-4 text-slate-300" /> Manage {slug === 'joblistings' ? 'Jobs' : slug}
                    </div>
                    {count > 0 && (
                      <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <NavGroupHeader>Operations & Studio</NavGroupHeader>
            <div className="grid grid-cols-1 gap-2">
              {backOfficeLinks.map((item, idx) => (
                <NavLink key={idx} to={item.to} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 text-slate-600 font-bold text-sm active:bg-slate-50">
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-4 text-slate-300" /> {item.label}
                  </div>
                  {item.count > 0 && (
                    <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          <footer className="p-8 bg-white border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=6610f2&color=fff`} className="w-10 h-10 rounded-xl object-cover" alt="user" />
              <div className="min-w-0"><p className="text-[10px] font-black text-slate-400 uppercase truncate leading-none">{user?.email}</p></div>
            </div>
            <button onClick={handleLogout} className="px-5 py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Sign Out</button>
          </footer>
        </div>
      </div>

      {/* 2. DESKTOP SIDEBAR (UPDATED FONTS) */}
      <aside className="hidden lg:flex flex-col sticky top-6 ml-6 h-[94dvh] w-[320px] bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">

        <div className="px-10 pt-12 pb-10">
          <NavLink aria-current="page" className="flex items-center no-underline group active" to="/dashboard">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6610f2] to-[#8b5cf6] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-purple-200 group-hover:rotate-6 transition-transform">S</div>
            <div className="flex flex-col ms-4 min-w-0">
              <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">Sellio.</span>
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.25em] mt-1.5">Partner Studio</span>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-10">
          {/* Main Link - Increased to 15px */}
          <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center py-4 px-6 mb-8 rounded-2xl text-[15px] font-black transition-all ${isActive ? 'bg-[#6610f2] text-white shadow-xl shadow-purple-100' : 'text-slate-600 hover:bg-slate-50'}`}>
            <HiOutlineSquares2X2 className="w-6 h-6 mr-3" /> Studio Overview
          </NavLink>

          <NavGroupHeader>Activity & Bookings</NavGroupHeader>
          <div className="space-y-1.5 mb-8">
            {modules.map((mod, i) => (
              <NavLink key={i} to={`/dashboard/${mod.slug}/${mod.type.toLowerCase()}`} className={({ isActive }) => `flex items-center justify-between py-3 px-6 rounded-xl text-[14px] font-bold transition-all ${isActive ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>
                {({ isActive }) => (
                  <>
                    <div className="flex items-center"><mod.icon className="w-5 h-5 mr-3 opacity-70" /> {mod.label}</div>
                    {mod.count > 0 && <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>{mod.count}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <NavGroupHeader>Inventory & Spatie Media</NavGroupHeader>
          <div className="space-y-1.5 mb-8">
            {Array.from(new Set(modules.map(m => m.slug))).map((slug) => {
              const count = counts[slug === 'joblistings' ? 'jobs' : slug] || 0;
              return (
                <NavLink key={slug} to={`/dashboard/${slug}`} className={({ isActive }) => `flex items-center justify-between py-3 px-6 rounded-xl text-[14px] font-bold transition-all ${isActive ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900'}`}>
                  <div className="flex items-center">
                    <HiOutlineFolder className="w-5 h-5 mr-3 opacity-70" /> Manage {slug === 'joblistings' ? 'Jobs' : slug}
                  </div>
                  {count > 0 && (
                    <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          <NavGroupHeader>Relations & Growth</NavGroupHeader>
          <div className="space-y-1.5 mb-8">
            {backOfficeLinks.slice(0, 4).map((link, i) => (
              <NavLink key={i} to={link.to} className={({ isActive }) => `flex items-center justify-between py-3 px-6 rounded-xl text-[14px] font-bold transition-all ${isActive ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900'}`}>
                <div className="flex items-center">
                  <link.icon className="w-5 h-5 mr-3 opacity-70" /> {link.label}
                </div>
                {link.count > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                    {link.count}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <NavGroupHeader>Finance & Setup</NavGroupHeader>
          <div className="space-y-1.5">
            {backOfficeLinks.slice(4).map((link, i) => (
              <NavLink key={i} to={link.to} className={({ isActive }) => `flex items-center justify-between py-3 px-6 rounded-xl text-[14px] font-bold transition-all ${isActive ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900'}`}>
                <div className="flex items-center">
                  <link.icon className="w-5 h-5 mr-3 opacity-70" /> {link.label}
                </div>
                {link.count > 0 && (
                  <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-full">
                    {link.count}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-5 bg-white border-t border-slate-50 flex-shrink-0">
          <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=6610f2&color=fff`} className="w-10 h-10 rounded-xl border border-white shadow-sm object-cover" alt="avatar" />
              <div className="min-w-0">
                <p className="text-[12px] font-black text-slate-900 truncate uppercase tracking-tighter leading-none mb-1">{user?.name?.split(' ')[0]}</p>
                <p className="text-[9px] font-bold text-green-500 uppercase tracking-wider">{user?.name || 'Seller User'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
              <HiOutlinePower className={`w-6 h-6 ${isLoggingOut ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* 3. MOBILE BOTTOM NAV (UNTOUCHED) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 h-[85px] z-[3000] flex items-center select-none shadow-2xl">
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${isActive ? 'text-[#6610f2]' : 'text-slate-300'}`}>
          <HiOutlineSquares2X2 className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Home</span>
        </NavLink>
        <NavLink to="/dashboard/messages" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${isActive ? 'text-[#6610f2]' : 'text-slate-300'}`}>
          <HiOutlineChatBubbleLeftRight className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Chat</span>
        </NavLink>
        <div className="flex-1 flex justify-center h-full items-center">
          <button onClick={() => setIsMobileOpen(true)} className="w-16 h-16 bg-[#6610f2] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-200 active:scale-90 transition-transform -mt-10 border-[6px] border-white">
            <HiBars3BottomLeft className="w-8 h-8" />
          </button>
        </div>
        <NavLink to="/dashboard/wallet" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${isActive ? 'text-[#6610f2]' : 'text-slate-300'}`}>
          <HiOutlineWallet className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Wallet</span>
        </NavLink>
        <NavLink to="/dashboard/settings" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${isActive ? 'text-[#6610f2]' : 'text-slate-300'}`}>
          <HiOutlineCog6Tooth className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Setup</span>
        </NavLink>
      </nav>
    </>
  );
}
