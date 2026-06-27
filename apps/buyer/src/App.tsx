import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  CalendarCheck,
  MessageSquare,
  Briefcase,
  Car,
  Clock,
  Wrench,
  Megaphone,
  Star,
  Settings as SettingsIcon,
  Bell,
  Menu,
  X,
  Rocket,
  ChevronDown,
  LogOut,
  User as UserIcon,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { API_BASE_URL } from './config/api';
import { ErrorBoundary } from './components/ErrorBoundary';

import DashboardOverview from './views/DashboardOverview';
import FavoritesView from './views/FavoritesView';
import MessagesView from './views/MessagesView';
import SettingsView from './views/SettingsView';
import UserActivityView from './views/UserActivityView';
import ActivityDetailView from './views/ActivityDetailView';
import PartnerView from './views/PartnerView';
import ReviewsView from './views/ReviewsView';
import LoginView from './views/LoginView';
import StorefrontRedirectView from './views/StorefrontRedirectView';
import NotFoundView from './views/NotFoundView';
import NotificationsView from './views/NotificationsView';
import { fetchNotifications } from './api/notificationApi';
import { StatsProvider, useStats } from './context/StatsContext';
import { UserProvider, useUser } from './context/UserContext';
import { useEchoClient } from './hooks/useEchoClient';
import { toast } from 'sonner';
import { getBrandSettings, BrandSettings } from './api/brandApi';
import { applyBrandToDocumentHead } from './lib/brandHead';
import SetupReminderBanner from './components/SetupReminderBanner';
import BottomNav from './components/BottomNav';
import { Toaster } from 'sonner';
import { resolvePortalBasePath } from './config/portalBase';

const PORTAL_BASE_PATH = resolvePortalBasePath();

const MAIN_NAV = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, badge: null, exact: true },
  { name: 'My Favorites', path: '/favorites', icon: Heart, badge: 'favoritesCount' },
  { name: 'My Bookings', path: '/bookings', icon: CalendarCheck, badge: 'bookingsCount' },
  { name: 'Messages', path: '/messages', icon: MessageSquare, badge: 'messagesCount' },
];

const ACTIVITY_NAV = [
  { name: 'Job Applications', path: '/applications', icon: Briefcase, badge: 'appsCount' },
  { name: 'Auto Inquiries', path: '/auto-inquiries', icon: Car, badge: 'inquiriesCount' },
  { name: 'Service Appointments', path: '/appointments', icon: Clock, badge: 'appointmentsCount' },
  { name: 'Service Quotes', path: '/quotes', icon: Wrench, badge: 'quotesCount' },
  { name: 'Classified Ads', path: '/classifieds-activity', icon: Megaphone, badge: 'classifiedsActivityCount' },
];

const FOOTER_NAV = [
  { name: 'My Reviews', path: '/reviews', icon: Star, badge: 'reviewsCount' },
  { name: 'Settings', path: '/settings', icon: SettingsIcon, badge: null },
];

const API_ORIGIN = (() => {
  try { return new URL(API_BASE_URL).origin; } catch { return ''; }
})();

const FALLBACK_AVATAR = `${API_ORIGIN}/images/fallbacks/default-avatar.png`;

function NavItem({ item, stats, statsLoaded, onClick }: { item: any; stats: any; statsLoaded: boolean; onClick?: () => void }) {
  const location = useLocation();
  const isActive = item.exact
    ? location.pathname === item.path
    : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  const badgeValue = statsLoaded && item.badge ? (stats as any)[item.badge] : 0;

  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group',
        isActive
          ? 'bg-[var(--primary-color)] text-white shadow-md shadow-[var(--primary-color)]/25'
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
      )}
    >
      <item.icon
        size={18}
        strokeWidth={isActive ? 2.5 : 1.75}
        className={cn(
          'shrink-0 transition-colors',
          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600',
        )}
      />
      <span className="truncate">{item.name}</span>
      {badgeValue > 0 && (
        <span
          className={cn(
            'ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-black',
            isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600',
          )}
        >
          {badgeValue > 99 ? '99+' : badgeValue}
        </span>
      )}
    </Link>
  );
}

function Sidebar({
  isOpen,
  setIsOpen,
  stats,
  statsLoaded,
  brand,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  stats: any;
  statsLoaded: boolean;
  brand: BrandSettings | null;
}) {
  const { user, logout } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isScrollable = el.scrollHeight > el.clientHeight;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
    setShowBottomFade(isScrollable && !atBottom);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    handleScroll();
    const obs = new ResizeObserver(handleScroll);
    obs.observe(el);
    return () => obs.disconnect();
  }, [stats]);

  const close = () => setIsOpen(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-[268px] bg-white border-r border-slate-200/70 z-50 flex flex-col',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
          <Link to="/" onClick={close} className="flex items-center gap-2.5">
            {brand?.site_logo ? (
              <img src={brand.site_logo} alt={brand.site_name} className="w-7 h-7 object-contain rounded-lg" />
            ) : (
              <div className="w-7 h-7 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                <Rocket size={15} className="text-white" />
              </div>
            )}
            <span className="font-black text-lg tracking-tight text-slate-900">
              {brand?.site_name || 'Sellio'}
            </span>
          </Link>
          <button
            onClick={close}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav scroll area */}
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto no-scrollbar py-4 px-3 space-y-6"
          >
            {/* Main */}
            <nav className="space-y-1">
              {MAIN_NAV.map((item) => (
                <NavItem key={item.path} item={item} stats={stats} statsLoaded={statsLoaded} onClick={close} />
              ))}
            </nav>

            {/* Activity */}
            <div className="space-y-1">
              <p className="section-label px-3 mb-2">My Activity</p>
              {ACTIVITY_NAV.map((item) => (
                <NavItem key={item.path} item={item} stats={stats} statsLoaded={statsLoaded} onClick={close} />
              ))}
            </div>

            {/* Footer */}
            <div className="space-y-1">
              <p className="section-label px-3 mb-2">Account</p>
              {FOOTER_NAV.map((item) => (
                <NavItem key={item.path} item={item} stats={stats} statsLoaded={statsLoaded} onClick={close} />
              ))}
            </div>

            {/* Partner mode CTA */}
            <div className="mx-1">
              <Link
                to="/partner"
                onClick={close}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white group hover:opacity-90 transition-opacity"
              >
                <Rocket size={16} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black leading-none">Switch to Partner</p>
                  <p className="text-[10px] text-white/70 mt-0.5 leading-none">Start selling on Sellio</p>
                </div>
                <ChevronRight size={14} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Bottom scroll fade */}
          <AnimatePresence>
            {showBottomFade && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>

        {/* User profile footer */}
        <div className="shrink-0 border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors group">
            <img
              src={user?.avatar || FALLBACK_AVATAR}
              alt={user?.name || 'User'}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate leading-tight">{user?.name || '—'}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">{user?.email || 'Buyer Account'}</p>
            </div>
            <button
              onClick={() => void logout()}
              title="Sign out"
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({
  setIsSidebarOpen,
  stats,
  statsLoaded,
  brand,
}: {
  setIsSidebarOpen: (v: boolean) => void;
  stats: any;
  statsLoaded: boolean;
  brand: BrandSettings | null;
}) {
  const { user, logout } = useUser();
  const location = useLocation();
  const [localUnreadCount, setLocalUnreadCount] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = async () => {
      try {
        const list = await fetchNotifications(true);
        setLocalUnreadCount(list.length);
      } catch {}
    };
    update();
    window.addEventListener('sellio_notifications_updated', update);
    return () => window.removeEventListener('sellio_notifications_updated', update);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const displayNotifCount = localUnreadCount !== null ? localUnreadCount : stats.notificationCount;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/favorites')) return 'My Favorites';
    if (path.startsWith('/bookings')) return 'My Bookings';
    if (path.startsWith('/messages')) return 'Messages';
    if (path.startsWith('/applications')) return 'Job Applications';
    if (path.startsWith('/auto-inquiries')) return 'Auto Inquiries';
    if (path.startsWith('/appointments')) return 'Service Appointments';
    if (path.startsWith('/quotes')) return 'Service Quotes';
    if (path.startsWith('/classifieds-activity')) return 'Classified Ads';
    if (path.startsWith('/reviews')) return 'My Reviews';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/notifications')) return 'Notifications';
    if (path.startsWith('/partner')) return 'Partner Program';
    return 'Buyer Portal';
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 -ml-1 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
        >
          <Menu size={20} />
        </button>
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden flex items-center gap-2 text-slate-900 shrink-0">
          {brand?.site_logo ? (
            <img src={brand.site_logo} alt={brand.site_name} className="w-6 h-6 object-contain rounded-md" />
          ) : (
            <div className="w-6 h-6 bg-[var(--primary-color)] rounded-md flex items-center justify-center">
              <Rocket size={13} className="text-white" />
            </div>
          )}
        </Link>
        {/* Page title on desktop */}
        <span className="hidden lg:block text-slate-900 font-bold text-base">{getPageTitle()}</span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <Link
          to="/notifications"
          className="relative p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell size={19} />
          {displayNotifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              {displayNotifCount > 9 ? '9+' : displayNotifCount}
            </span>
          )}
        </Link>

        {/* Messages */}
        <Link
          to="/messages"
          className="relative p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          title="Messages"
        >
          <MessageSquare size={19} />
          {statsLoaded && stats.messagesCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-amber-400 text-slate-900 text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              {stats.messagesCount > 9 ? '9+' : stats.messagesCount}
            </span>
          )}
        </Link>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <img
              src={user?.avatar || FALLBACK_AVATAR}
              alt={user?.name || 'User'}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border-2 border-[var(--primary-color)]/40 ring-1 ring-white"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name?.split(' ')[0] || '—'}</p>
            </div>
            <ChevronDown
              size={14}
              className={cn('text-slate-400 transition-transform duration-200', dropdownOpen && 'rotate-180')}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden z-50"
              >
                <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50">
                  <p className="text-sm font-black text-slate-900 truncate">{user?.name || '—'}</p>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{user?.email || 'Buyer Account'}</p>
                </div>
                <div className="py-1.5">
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[var(--primary-color)] transition-colors"
                  >
                    <UserIcon size={15} className="shrink-0" />
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[var(--primary-color)] transition-colors"
                  >
                    <SettingsIcon size={15} className="shrink-0" />
                    Settings
                  </Link>
                  <Link
                    to="/partner"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[var(--primary-color)] transition-colors"
                  >
                    <Briefcase size={15} className="shrink-0" />
                    Partner Mode
                  </Link>
                </div>
                <div className="py-1.5 border-t border-slate-100">
                  <button
                    onClick={() => { setDropdownOpen(false); void logout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} className="shrink-0" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <UserProvider>
      <StatsProvider>
        <Toaster position="top-right" richColors closeButton />
        <AppContent />
      </StatsProvider>
    </UserProvider>
  );
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useUser();
  const { stats, hasLoaded: statsLoaded } = useStats();
  const [brand, setBrand] = useState<BrandSettings | null>(null);

  useEchoClient();

  useEffect(() => {
    const handler = (e: Event) => {
      const { title, message, type } = (e as CustomEvent).detail ?? {};
      const fn =
        type === 'success' ? toast.success
        : type === 'error'   ? toast.error
        : type === 'warning' ? toast.warning
        : toast.info;
      fn(title ?? 'Notification', { description: message });
    };
    window.addEventListener('sellio:notification', handler);
    return () => window.removeEventListener('sellio:notification', handler);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBrandSettings();
        if (data) { setBrand(data); applyBrandToDocumentHead(data); }
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setIsSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex flex-col">
        <SetupReminderBanner />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-6 select-none">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-[var(--primary-color)]/20 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="relative w-16 h-16 rounded-2xl bg-[var(--primary-color)] flex items-center justify-center shadow-xl shadow-[var(--primary-color)]/30">
                <Rocket size={28} className="text-white" />
              </div>
            </div>
            <div className="w-40 h-1 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full rounded-full bg-[var(--primary-color)]" style={{ animation: 'buyer-load-bar 1.6s ease-in-out infinite' }} />
            </div>
            <p className="text-[11px] font-black tracking-[0.25em] uppercase text-slate-400">Loading your portal</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <Router basename={PORTAL_BASE_PATH}>
      <div className="min-h-screen font-sans selection:bg-[var(--primary-color)] selection:text-white">
        <SetupReminderBanner />
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} stats={stats} statsLoaded={statsLoaded} brand={brand} />

        <div className="lg:pl-[268px] flex flex-col min-h-screen">
          <Header setIsSidebarOpen={setIsSidebarOpen} stats={stats} statsLoaded={statsLoaded} brand={brand} />

          <main className="flex-1 p-4 lg:p-7 pb-24 lg:pb-8 max-w-[1280px] mx-auto w-full">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/favorites" element={<FavoritesView />} />
                <Route path="/messages" element={<MessagesView />} />
                <Route path="/messages/:id" element={<MessagesView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="/notifications" element={<NotificationsView />} />

                <Route path="/properties" element={<StorefrontRedirectView module="properties" />} />
                <Route path="/events" element={<StorefrontRedirectView module="events" />} />
                <Route path="/autos" element={<StorefrontRedirectView module="autos" />} />
                <Route path="/services" element={<StorefrontRedirectView module="services" />} />
                <Route path="/jobs" element={<StorefrontRedirectView module="jobs" />} />
                <Route path="/classifieds" element={<StorefrontRedirectView module="classifieds" />} />
                <Route path="/products" element={<StorefrontRedirectView module="products" />} />

                <Route path="/bookings" element={<UserActivityView title="My Bookings" />} />
                <Route path="/bookings/:id" element={<ActivityDetailView />} />
                <Route path="/applications" element={<UserActivityView module="jobs" title="Job Applications" />} />
                <Route path="/applications/:id" element={<ActivityDetailView />} />
                <Route path="/auto-inquiries" element={<UserActivityView module="autos" title="Auto Inquiries" />} />
                <Route path="/auto-inquiries/:id" element={<ActivityDetailView />} />
                <Route path="/appointments" element={<UserActivityView module="services" title="Service Appointments" />} />
                <Route path="/appointments/:id" element={<ActivityDetailView />} />
                <Route path="/quotes" element={<UserActivityView module="services" title="Service Quotes" type="quote" />} />
                <Route path="/quotes/:id" element={<ActivityDetailView />} />
                <Route path="/classifieds-activity" element={<UserActivityView module="classifieds" title="Classified Ads" />} />
                <Route path="/classifieds-activity/:id" element={<ActivityDetailView />} />
                <Route path="/reviews" element={<ReviewsView />} />
                <Route path="/partner" element={<PartnerView />} />
                <Route path="*" element={<NotFoundView />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}
