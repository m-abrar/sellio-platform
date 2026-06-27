import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
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
import { getBrandSettings } from '../api/brand';

export default function Sidebar({ user }: any) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [counts, setCounts] = useState<any>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [brand, setBrand] = useState<any>(null);

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const data = await getBrandSettings();
        setBrand(data);
      } catch (error) {
        console.error('Failed to load brand settings in sidebar:', error);
      }
    };
    loadBrand();
  }, []);
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);
  const [activeTab, setActiveTab] = useState<'operations' | 'management'>('operations');
  const [isActivityExpanded, setIsActivityExpanded] = useState(false);
  const [isInventoryExpanded, setIsInventoryExpanded] = useState(false);
  const [isRelationsExpanded, setIsRelationsExpanded] = useState(false);
  const [isFinanceExpanded, setIsFinanceExpanded] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const isScrollable = el.scrollHeight > el.clientHeight;
    setShowTopIndicator(isScrollable && el.scrollTop > 10);

    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
    setShowBottomIndicator(isScrollable && !isAtBottom);
  };

  const scrollDown = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      top: 150,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      handleScroll();
      const observer = new ResizeObserver(handleScroll);
      observer.observe(el);
      if (el.firstElementChild) {
        observer.observe(el.firstElementChild as HTMLElement);
      }
      return () => observer.disconnect();
    }
  }, [counts]);

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
    { label: 'Transactions', to: '/dashboard/transactions', icon: HiOutlineCreditCard },
    { label: 'Memberships', to: '/dashboard/memberships', icon: HiOutlineShieldCheck, count: counts.memberships },
    { label: 'Analytics', to: '/dashboard/analytics', icon: HiOutlineChartBar, count: counts.analytics },
    { label: 'Settings', to: '/dashboard/settings', icon: HiOutlineCog6Tooth },
  ];

  useEffect(() => {
    const path = location.pathname;
    
    // Check if the current route belongs to Management tab
    const isManagementRoute = 
      // 1. Inventory paths: exact match or subpaths
      modules.some(mod => path === `/dashboard/${mod.slug}` || path.startsWith(`/dashboard/${mod.slug}/`)) ||
      // 2. Finance & Admin paths
      ['wallet', 'transactions', 'memberships', 'analytics', 'settings'].some(key => path.startsWith(`/dashboard/${key}`));

    if (isManagementRoute) {
      setActiveTab('management');
      // Auto-expand Inventory group if active path matches an inventory child or its subpaths
      const isActiveInventory = modules.some(mod => path === `/dashboard/${mod.slug}` || path.startsWith(`/dashboard/${mod.slug}/`));
      if (isActiveInventory) {
        setIsInventoryExpanded(true);
      }
      // Auto-expand Finance group if active path matches a finance/setup child
      const isActiveFinance = ['wallet', 'transactions', 'memberships', 'analytics', 'settings'].some(key => path.startsWith(`/dashboard/${key}`));
      if (isActiveFinance) {
        setIsFinanceExpanded(true);
      }
    } else {
      setActiveTab('operations');
      // Auto-expand Activity group if active path matches an activity child
      const isActiveActivity = modules.some(mod => path === `/dashboard/${mod.slug}/${mod.type.toLowerCase()}`);
      if (isActiveActivity) {
        setIsActivityExpanded(true);
      }
      // Auto-expand Relations group if active path matches a relations child
      const isActiveRelations = ['customers', 'reviews', 'messages', 'notifications'].some(key => path.startsWith(`/dashboard/${key}`));
      if (isActiveRelations) {
        setIsRelationsExpanded(true);
      }
    }
  }, [location.pathname]);

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
    <h6 className="px-4 mb-3 text-micro font-semibold uppercase tracking-caps text-slate-400 mt-7 first:mt-0">
      {children}
    </h6>
  );

  const CollapsibleHeader = ({
    label,
    isExpanded,
    onToggle
  }: {
    label: string;
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 mb-3 text-micro font-semibold uppercase tracking-caps text-slate-400 hover:text-slate-600 transition-colors mt-7 first:mt-0 outline-none focus:outline-none group"
    >
      <span>{label}</span>
      <motion.div
        animate={isExpanded ? {
          rotate: 180,
          y: 0,
          scale: 1
        } : {
          rotate: 0,
          y: [0, -5, 0],
          scale: [1, 1.15, 1]
        }}
        transition={isExpanded ? {
          rotate: { duration: 0.2 }
        } : {
          rotate: { duration: 0.2 },
          y: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' },
          scale: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' }
        }}
        className="text-slate-400 group-hover:text-slate-600"
      >
        <HiChevronDown className="w-4 h-4" />
      </motion.div>
    </button>
  );

  return (
    <>
      {/* 1. MOBILE FULL-SCREEN COMMAND CENTER (UNTOUCHED) */}
      <div className={`fixed inset-0 z-[4000] bg-[#fbfcfd] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${isMobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}>
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between px-8 pt-12 pb-6 flex-shrink-0">
            <div className="flex items-center">
              {brand?.site_logo ? (
                <img src={brand.site_logo} alt={brand.site_name} className="w-10 h-10 object-contain rounded-xl" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-brand to-[#8b5cf6] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-200">S</div>
              )}
              <div className="flex flex-col ms-3 min-w-0">
                <span className="text-lg font-black text-slate-900 tracking-tighter leading-none">{brand?.site_name || 'Sellio.'}</span>
                <span className="text-tiny font-black text-purple-500 uppercase tracking-caps mt-1">Seller Panel</span>
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
                <NavLink key={i} to={`/dashboard/${mod.slug}/${mod.type.toLowerCase()}`} className="relative bg-white p-5 rounded-card-lg border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm active:scale-95 transition-all">
                  <div className={`w-12 h-12 ${mod.color} rounded-2xl flex items-center justify-center mb-3`}><mod.icon className="w-6 h-6" /></div>
                  <span className="text-xs font-black text-slate-900">{mod.label}</span>
                  {mod.count > 0 && <div className="absolute top-3 right-3 bg-red-500 text-white text-micro font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">{mod.count}</div>}
                </NavLink>
              ))}
            </div>

            <NavGroupHeader>Media & Inventory</NavGroupHeader>
            <div className="grid grid-cols-1 gap-2 mb-6">
              {Array.from(new Set(modules.map(m => m.slug))).map((slug) => {
                const count = counts[slug === 'joblistings' ? 'jobs' : slug] || 0;
                const moduleItem = modules.find(m => m.slug === slug);
                const displayName = moduleItem ? moduleItem.name : (slug === 'joblistings' ? 'Jobs' : slug);
                return (
                  <NavLink key={slug} to={`/dashboard/${slug}`} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 text-slate-600 font-bold text-sm active:bg-slate-50">
                    <div className="flex items-center">
                      <HiOutlineFolder className="w-5 h-5 mr-4 text-slate-300" /> Manage {displayName}
                    </div>
                    {count > 0 && (
                      <span className="bg-slate-100 text-slate-600 text-micro font-black px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <NavGroupHeader>Operations</NavGroupHeader>
            <div className="grid grid-cols-1 gap-2">
              {backOfficeLinks.map((item, idx) => (
                <NavLink key={idx} to={item.to} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 text-slate-600 font-bold text-sm active:bg-slate-50">
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-4 text-slate-300" /> {item.label}
                  </div>
                  {item.count > 0 && (
                    <span className="bg-red-500 text-white text-micro font-black px-2 py-0.5 rounded-full">
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
              <div className="min-w-0"><p className="text-label font-black text-slate-400 uppercase truncate leading-none">{user?.email}</p></div>
            </div>
            <button onClick={handleLogout} className="px-5 py-3 bg-red-50 text-red-500 rounded-xl text-label font-black uppercase tracking-widest">Sign Out</button>
          </footer>
        </div>
      </div>

      {/* 2. DESKTOP SIDEBAR (UPDATED FONTS) */}
      <aside className="hidden lg:flex flex-col sticky top-5 h-[90dvh] w-[300px] bg-white border border-slate-100 rounded-card-lg shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_4px_32px_rgba(0,0,0,0.04)] overflow-hidden relative">

        <div className="px-8 pt-10 pb-5 flex-shrink-0">
          <NavLink aria-current="page" className="flex items-center no-underline group active" to="/dashboard">
            {brand?.site_logo ? (
              <img src={brand.site_logo} alt={brand.site_name} className="w-12 h-12 object-contain rounded-2xl group-hover:rotate-6 transition-transform" />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-brand to-[#8b5cf6] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-purple-200 group-hover:rotate-6 transition-transform">S</div>
            )}
            <div className="flex flex-col ms-4 min-w-0">
              <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">{brand?.site_name || 'Sellio.'}</span>
              <span className="text-label font-black text-purple-500 uppercase tracking-label-caps mt-1.5">Seller Portal</span>
            </div>
          </NavLink>
        </div>

        {/* Main Link - Dashboard Overview */}
        <div className="px-6 pb-4 flex-shrink-0">
          <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center py-3.5 px-5 rounded-2xl text-nav font-bold transition-all duration-200 ${isActive ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <HiOutlineSquares2X2 className="w-5 h-5 mr-3" /> Dashboard
          </NavLink>
        </div>

        {/* Pinned Quick-Links Dock */}
        <div className="px-6 pb-5 flex-shrink-0 flex items-center justify-between gap-1.5 border-b border-slate-50">
          {[
            { to: '/dashboard/properties', icon: HiOutlineHome, label: 'Properties' },
            { to: '/dashboard/messages', icon: HiOutlineChatBubbleLeftRight, label: 'Messages' },
            { to: '/dashboard/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
            { to: '/dashboard/settings', icon: HiOutlineCog6Tooth, label: 'Settings' },
            { to: '/dashboard/events', icon: HiOutlineCalendar, label: 'Events' }
          ].map((item, idx) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={idx}
                to={item.to}
                title={item.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 relative group cursor-pointer ${
                  isActive
                    ? 'bg-brand border-brand text-white shadow-md shadow-brand/20'
                    : 'bg-slate-50 border-slate-100/80 text-slate-400 hover:bg-slate-100 hover:text-slate-600 hover:border-slate-200'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {/* Tooltip */}
                <span className="absolute bottom-full mb-2 scale-0 group-hover:scale-100 transition-all duration-150 origin-bottom bg-slate-900 text-white text-micro font-semibold tracking-wide py-1 px-2.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none z-50">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* Segmented nav switcher */}
        <div className="px-6 pb-5 flex-shrink-0">
          <div className="bg-slate-50/80 p-1 rounded-interactive flex border border-slate-100/80 relative">
            <button
              type="button"
              onClick={() => setActiveTab('operations')}
              className={`flex-1 py-2 text-caption font-semibold rounded-xl transition-all duration-200 relative z-10 flex items-center justify-center gap-1.5 ${
                activeTab === 'operations' ? 'text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {activeTab === 'operations' && (
                <motion.div
                  layoutId="active-segment-bg"
                  className="absolute inset-0 bg-brand rounded-xl shadow-sm shadow-brand/25"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                />
              )}
              <HiOutlineChartBar className="w-3.5 h-3.5" />
              Operations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('management')}
              className={`flex-1 py-2 text-caption font-semibold rounded-xl transition-all duration-200 relative z-10 flex items-center justify-center gap-1.5 ${
                activeTab === 'management' ? 'text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {activeTab === 'management' && (
                <motion.div
                  layoutId="active-segment-bg"
                  className="absolute inset-0 bg-brand rounded-xl shadow-sm shadow-brand/25"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                />
              )}
              <HiOutlineCog6Tooth className="w-3.5 h-3.5" />
              Management
            </button>
          </div>
        </div>

        {/* Top scroll gradient overlay */}
        <AnimatePresence>
          {showTopIndicator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[264px] left-6 right-6 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"
            />
          )}
        </AnimatePresence>

        <nav
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 px-6 overflow-y-auto scrollbar-hide pb-10"
        >

          {activeTab === 'operations' ? (
            <>
              <CollapsibleHeader
                label="Activity"
                isExpanded={isActivityExpanded}
                onToggle={() => setIsActivityExpanded(!isActivityExpanded)}
              />
              <AnimatePresence initial={false}>
                {isActivityExpanded && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{
                      open: {
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.25, ease: 'easeInOut' },
                          opacity: { duration: 0.2 },
                          staggerChildren: 0.04,
                          delayChildren: 0.05
                        }
                      },
                      closed: {
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.2, ease: 'easeInOut' },
                          opacity: { duration: 0.15 }
                        }
                      }
                    }}
                    className="overflow-hidden space-y-1.5 mb-6 px-1"
                  >
                    {modules.map((mod, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
                          closed: { opacity: 0, x: -10 }
                        }}
                      >
                        <NavLink to={`/dashboard/${mod.slug}/${mod.type.toLowerCase()}`} className={({ isActive }) => `flex items-center justify-between py-2.5 px-4 rounded-xl text-nav font-medium transition-all duration-200 ${isActive ? 'bg-white text-slate-900 shadow-nav-active border border-slate-100/80' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/70'}`}>
                          {({ isActive }) => (
                            <>
                              <div className="flex items-center min-w-0"><mod.icon className="w-4 h-4 mr-2.5 shrink-0 opacity-55" /><span className="truncate">{mod.label}</span></div>
                              {mod.count > 0 && <span className={`text-micro px-2 py-0.5 rounded-full font-bold shrink-0 ml-2 ${isActive ? 'bg-brand text-white' : 'bg-red-500 text-white'}`}>{mod.count}</span>}
                            </>
                          )}
                        </NavLink>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <CollapsibleHeader
                label="Customers"
                isExpanded={isRelationsExpanded}
                onToggle={() => setIsRelationsExpanded(!isRelationsExpanded)}
              />
              <AnimatePresence initial={false}>
                {isRelationsExpanded && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{
                      open: {
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.25, ease: 'easeInOut' },
                          opacity: { duration: 0.2 },
                          staggerChildren: 0.04,
                          delayChildren: 0.05
                        }
                      },
                      closed: {
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.2, ease: 'easeInOut' },
                          opacity: { duration: 0.15 }
                        }
                      }
                    }}
                    className="overflow-hidden space-y-1.5 mb-6 px-1"
                  >
                    {backOfficeLinks.slice(0, 4).map((link, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
                          closed: { opacity: 0, x: -10 }
                        }}
                      >
                        <NavLink to={link.to} className={({ isActive }) => `flex items-center justify-between py-2.5 px-4 rounded-xl text-nav font-medium transition-all duration-200 ${isActive ? 'bg-white text-slate-900 shadow-nav-active border border-slate-100/80' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/70'}`}>
                          <div className="flex items-center min-w-0">
                            <link.icon className="w-4 h-4 mr-2.5 shrink-0 opacity-55" /><span className="truncate">{link.label}</span>
                          </div>
                          {link.count > 0 && (
                            <span className="bg-red-500 text-white text-micro font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                              {link.count}
                            </span>
                          )}
                        </NavLink>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <>
              <CollapsibleHeader
                label="Inventory"
                isExpanded={isInventoryExpanded}
                onToggle={() => setIsInventoryExpanded(!isInventoryExpanded)}
              />
              <AnimatePresence initial={false}>
                {isInventoryExpanded && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{
                      open: {
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.25, ease: 'easeInOut' },
                          opacity: { duration: 0.2 },
                          staggerChildren: 0.04,
                          delayChildren: 0.05
                        }
                      },
                      closed: {
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.2, ease: 'easeInOut' },
                          opacity: { duration: 0.15 }
                        }
                      }
                    }}
                    className="overflow-hidden space-y-1.5 mb-6 px-1"
                  >
                    {Array.from(new Set(modules.map(m => m.slug))).map((slug) => {
                      const count = counts[slug === 'joblistings' ? 'jobs' : slug] || 0;
                      const moduleItem = modules.find(m => m.slug === slug);
                      const displayName = moduleItem ? moduleItem.name : (slug === 'joblistings' ? 'Jobs' : slug);
                      return (
                        <motion.div
                          key={slug}
                          variants={{
                            open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
                            closed: { opacity: 0, x: -10 }
                          }}
                        >
                          <NavLink to={`/dashboard/${slug}`} className={({ isActive }) => `flex items-center justify-between py-2.5 px-4 rounded-xl text-nav font-medium transition-all duration-200 ${isActive ? 'bg-white text-slate-900 shadow-nav-active border border-slate-100/80' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/70'}`}>
                            <div className="flex items-center min-w-0">
                              <HiOutlineFolder className="w-4 h-4 mr-2.5 shrink-0 opacity-55" /><span className="truncate">{displayName}</span>
                            </div>
                            {count > 0 && (
                              <span className="bg-slate-200 text-slate-600 text-micro font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                                {count}
                              </span>
                            )}
                          </NavLink>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              <CollapsibleHeader
                label="Finance & Setup"
                isExpanded={isFinanceExpanded}
                onToggle={() => setIsFinanceExpanded(!isFinanceExpanded)}
              />
              <AnimatePresence initial={false}>
                {isFinanceExpanded && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{
                      open: {
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.25, ease: 'easeInOut' },
                          opacity: { duration: 0.2 },
                          staggerChildren: 0.04,
                          delayChildren: 0.05
                        }
                      },
                      closed: {
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.2, ease: 'easeInOut' },
                          opacity: { duration: 0.15 }
                        }
                      }
                    }}
                    className="overflow-hidden space-y-1.5 mb-6 px-1"
                  >
                    {backOfficeLinks.slice(4).map((link, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
                          closed: { opacity: 0, x: -10 }
                        }}
                      >
                        <NavLink to={link.to} className={({ isActive }) => `flex items-center justify-between py-2.5 px-4 rounded-xl text-nav font-medium transition-all duration-200 ${isActive ? 'bg-white text-slate-900 shadow-nav-active border border-slate-100/80' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/70'}`}>
                          <div className="flex items-center min-w-0">
                            <link.icon className="w-4 h-4 mr-2.5 shrink-0 opacity-55" /><span className="truncate">{link.label}</span>
                          </div>
                          {link.count > 0 && (
                            <span className="bg-slate-200 text-slate-600 text-micro font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                              {link.count}
                            </span>
                          )}
                        </NavLink>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </nav>

        {/* Bottom scroll bounce indicator */}
        <AnimatePresence>
          {showBottomIndicator && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-[108px] left-6 right-6 h-16 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none z-10 flex items-end justify-center pb-1"
            >
              <button
                onClick={scrollDown}
                className="flex flex-col items-center gap-0.5 text-slate-400 pointer-events-auto hover:text-brand transition-colors cursor-pointer border-none bg-transparent p-0 focus:outline-none"
              >
                <HiChevronDown size={14} className="animate-bounce" />
                <span className="text-tiny font-extrabold uppercase tracking-widest leading-none">More Options</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-5 pb-5 pt-4 border-t border-slate-50/80 flex-shrink-0">
          <div className="flex items-center gap-3 bg-slate-50/60 px-4 py-3.5 rounded-2xl border border-slate-100/80">
            <div className="relative shrink-0">
              <img
                src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'S')}&background=6610f2&color=fff&size=80`}
                className="w-9 h-9 rounded-badge object-cover border-2 border-white shadow-sm"
                alt="avatar"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                {user?.name || user?.email?.split('@')[0] || 'Seller'}
              </p>
              <p className="text-micro font-medium text-slate-400 tracking-wide mt-0.5">Active Seller</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all shrink-0"
              title="Sign out"
            >
              <HiOutlinePower className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* 3. MOBILE BOTTOM NAV (UNTOUCHED) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 h-[85px] z-[3000] flex items-center select-none shadow-2xl">
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${isActive ? 'text-brand' : 'text-slate-300'}`}>
          <HiOutlineSquares2X2 className="w-6 h-6" /><span className="text-tiny font-black uppercase">Home</span>
        </NavLink>
        <NavLink to="/dashboard/messages" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${isActive ? 'text-brand' : 'text-slate-300'}`}>
          <HiOutlineChatBubbleLeftRight className="w-6 h-6" /><span className="text-tiny font-black uppercase">Chat</span>
        </NavLink>
        <div className="flex-1 flex justify-center h-full items-center">
          <button onClick={() => setIsMobileOpen(true)} className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-200 active:scale-90 transition-transform -mt-10 border-[6px] border-white">
            <HiBars3BottomLeft className="w-8 h-8" />
          </button>
        </div>
        <NavLink to="/dashboard/wallet" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${isActive ? 'text-brand' : 'text-slate-300'}`}>
          <HiOutlineWallet className="w-6 h-6" /><span className="text-tiny font-black uppercase">Wallet</span>
        </NavLink>
        <NavLink to="/dashboard/settings" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${isActive ? 'text-brand' : 'text-slate-300'}`}>
          <HiOutlineCog6Tooth className="w-6 h-6" /><span className="text-tiny font-black uppercase">Setup</span>
        </NavLink>
      </nav>
    </>
  );
}
