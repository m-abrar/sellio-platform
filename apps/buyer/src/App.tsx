/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  ChevronRight,
  ChevronDown,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { API_BASE_URL } from './config/api';
import { ErrorBoundary } from './components/ErrorBoundary';

// Views
import DashboardOverview from './views/DashboardOverview';
import FavoritesView from './views/FavoritesView';
import MessagesView from './views/MessagesView';
import SettingsView from './views/SettingsView';
import UserActivityView from './views/UserActivityView';
import PartnerView from './views/PartnerView';
import ReviewsView from './views/ReviewsView';
import LoginView from './views/LoginView';
import StorefrontRedirectView from './views/StorefrontRedirectView';
import NotFoundView from './views/NotFoundView';
import NotificationsView from './views/NotificationsView';
import { StatsProvider, useStats } from './context/StatsContext';
import { UserProvider, useUser } from './context/UserContext';

const MAIN_NAV = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, badge: 'totalItemsCount' },
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
  { name: 'Reviews', path: '/reviews', icon: Star, badge: 'reviewsCount' },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

const FALLBACK_AVATAR = `${API_ORIGIN}/images/fallbacks/default-avatar.png`;

function Sidebar({ isOpen, setIsOpen, stats }: { isOpen: boolean; setIsOpen: (v: boolean) => void; stats: any }) {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const isScrollable = el.scrollHeight > el.clientHeight;
    
    // Show top indicator if we've scrolled down slightly
    setShowTopIndicator(isScrollable && el.scrollTop > 10);

    // Show bottom indicator if we haven't reached the bottom
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
      
      // Observe children to capture dynamic content shifts (e.g. stats loading)
      if (el.firstElementChild) {
        observer.observe(el.firstElementChild as HTMLElement);
      }
      
      return () => observer.disconnect();
    }
  }, [stats]);

  const NavItem = ({ item }: { item: any }) => {
    const isActive = location.pathname === item.path;
    const badgeValue = item.badge ? (stats as any)[item.badge] : 0;

    return (
      <Link
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
          isActive 
            ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-bold" 
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
        )}
      >
        {isActive && (
          <motion.div 
            layoutId="sidebar-active-indicator"
            className="absolute left-0 top-3 bottom-3 w-1 bg-[var(--primary-color)] rounded-r-full"
          />
        )}
        <item.icon size={20} className={cn(isActive ? "text-[var(--primary-color)]" : "text-zinc-400 group-hover:text-zinc-750")} />
        <span className="text-sm">{item.name}</span>
        {badgeValue > 0 && (
          <span className={cn(
            "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full",
            isActive ? "bg-[var(--primary-color)] text-white" :
            item.name === 'My Favorites' ? "bg-red-500 text-white" : 
            item.name === 'Messages' ? "bg-amber-400 text-zinc-900" : "bg-zinc-100 text-zinc-500"
          )}>
            {badgeValue}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : -280) 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-white border-r border-zinc-200/80 z-50 lg:translate-x-0",
          !isOpen && "hidden lg:block"
        )}
      >
        <div className="flex flex-col h-full p-4 relative">
          <div className="h-16 flex items-center px-4 mb-4">
            <Link to="/" className="flex items-center gap-2 text-zinc-900">
              <Rocket size={24} className="fill-[var(--primary-light)] text-[var(--primary-color)]" />
              <span className="font-extrabold text-xl tracking-tight text-zinc-900">Sellio</span>
            </Link>
            <button onClick={() => setIsOpen(false)} className="ml-auto p-2 lg:hidden text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl">
              <X size={20} />
            </button>
          </div>

          {/* Pinned Quick-Links Dock */}
          <div className="px-4 pb-5 flex-shrink-0 flex items-center justify-between gap-2 border-b border-zinc-100">
            {[
              { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
              { to: '/messages', icon: MessageSquare, label: 'Messages' },
              { to: '/favorites', icon: Heart, label: 'Favorites' },
              { to: '/bookings', icon: CalendarCheck, label: 'Bookings' },
              { to: '/settings', icon: SettingsIcon, label: 'Settings' }
            ].map((item, idx) => {
              const isActive = item.exact 
                ? location.pathname === item.to 
                : location.pathname.startsWith(item.to);
              return (
                <Link 
                  key={idx}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  title={item.label}
                  className={cn(
                    "w-[42px] h-[42px] rounded-xl flex items-center justify-center border transition-all duration-300 relative group cursor-pointer",
                    isActive 
                      ? "bg-[var(--primary-color)] border-[var(--primary-color)] text-white shadow-md shadow-[var(--primary-color)]/20" 
                      : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:bg-zinc-100 hover:text-[var(--primary-color)] hover:border-zinc-200 hover:shadow-xs"
                  )}
                >
                  <item.icon size={18} className="transition-transform group-hover:scale-110" />
                  {/* CSS Tooltip */}
                  <span className="absolute bottom-full mb-2 scale-0 group-hover:scale-100 transition-all duration-200 origin-bottom bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg whitespace-nowrap shadow-md pointer-events-none z-50">
                    {item.label}
                  </span>
                  <span className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 transition-all duration-200 origin-bottom border-4 border-transparent border-t-zinc-900 pointer-events-none z-50" />
                </Link>
              );
            })}
          </div>

          {/* Top scroll gradient overlay */}
          <AnimatePresence>
            {showTopIndicator && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-20 left-4 right-4 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"
              />
            )}
          </AnimatePresence>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto no-scrollbar space-y-6"
          >
            <nav className="space-y-1">
              {MAIN_NAV.map((item) => <NavItem key={item.name} item={item} />)}
            </nav>

            <div className="px-4">
              <hr className="border-zinc-200/60" />
            </div>

            <div className="space-y-1">
              <p className="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">My Activity</p>
              {ACTIVITY_NAV.map((item) => <NavItem key={item.name} item={item} />)}
            </div>

            <div className="px-4">
              <hr className="border-zinc-200/60" />
            </div>

            <nav className="space-y-1">
              {FOOTER_NAV.map((item) => <NavItem key={item.name} item={item} />)}
            </nav>
          </div>

          {/* Bottom scroll bounce indicator */}
          <AnimatePresence>
            {showBottomIndicator && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute bottom-4 left-4 right-4 h-16 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none z-10 flex items-end justify-center pb-1"
              >
                <button
                  onClick={scrollDown}
                  className="flex flex-col items-center gap-0.5 text-zinc-400 pointer-events-auto hover:text-[var(--primary-color)] transition-colors cursor-pointer border-none bg-transparent p-0 focus:outline-none"
                >
                  <ChevronDown size={14} className="animate-bounce" />
                  <span className="text-[8px] font-extrabold uppercase tracking-widest leading-none">More Options</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}

function Header({ setIsSidebarOpen, stats }: { setIsSidebarOpen: (v: boolean) => void; stats: any }) {
  const { user, logout } = useUser();
  const [localUnreadCount, setLocalUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem('sellio_buyer_notifications');
      if (stored) {
        try {
          const list = JSON.parse(stored);
          const count = list.filter((n: any) => !n.read).length;
          setLocalUnreadCount(count);
        } catch {}
      }
    };
    updateCount();
    window.addEventListener('sellio_notifications_updated', updateCount);
    return () => window.removeEventListener('sellio_notifications_updated', updateCount);
  }, []);

  const displayNotifCount = localUnreadCount !== null ? localUnreadCount : stats.notificationCount;

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-zinc-200/50 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 lg:hidden text-zinc-500 hover:bg-zinc-100 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="lg:hidden flex items-center gap-2 text-[var(--primary-color)]">
          <Rocket size={20} className="fill-current" />
          <span className="font-extrabold text-lg tracking-tight">Sellio</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <Link 
          to="/partner" 
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[var(--primary-light)] text-[var(--primary-color)] rounded-full text-xs font-bold hover:opacity-80 transition-opacity"
        >
          <Briefcase size={14} />
          Switch to Partner Mode
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/notifications" className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl relative cursor-pointer" title="Notifications">
            <Bell size={20} />
            {displayNotifCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[8px] font-extrabold flex items-center justify-center rounded-full border border-white shadow-2xs">
                {displayNotifCount > 9 ? '9+' : displayNotifCount}
              </span>
            )}
          </Link>
          <Link to="/messages" className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-xl relative cursor-pointer" title="Inbox">
            <MessageSquare size={20} />
            {stats.messagesCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-amber-400 text-zinc-900 text-[8px] font-extrabold flex items-center justify-center rounded-full border border-white shadow-2xs">
                {stats.messagesCount > 9 ? '9+' : stats.messagesCount}
              </span>
            )}
          </Link>
        </div>

        <div className="h-8 w-px bg-zinc-200 mx-1" />

        <div className="group relative">
          <button className="flex items-center gap-2 p-1 hover:bg-zinc-100 rounded-xl transition-colors">
            <img 
              src={user?.avatar || FALLBACK_AVATAR} 
              alt="User" 
              className="w-8 h-8 rounded-full border-2 border-[var(--primary-color)]"
              referrerPolicy="no-referrer"
            />
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
            <div className="px-4 py-2 border-b border-zinc-50 mb-1">
              <p className="text-sm font-bold text-zinc-900">{user?.name || 'Loading...'}</p>
              <p className="text-[10px] text-zinc-500">Premium Member</p>
            </div>
            <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-[var(--primary-color)]">
              <UserIcon size={16} /> My Profile
            </Link>
            <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-[var(--primary-color)]">
              <SettingsIcon size={16} /> Settings
            </Link>
            <hr className="my-1 border-zinc-50" />
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
              onClick={() => void logout()}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <UserProvider>
      <StatsProvider>
        <AppContent />
      </StatsProvider>
    </UserProvider>
  );
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useUser();
  const { stats } = useStats();

  React.useEffect(() => {
    // Handle window resize for sidebar
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8f5] text-sm font-bold text-zinc-500">
        Loading buyer panel...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <Router>
      <div className="min-h-screen font-sans selection:bg-[var(--primary-color)] selection:text-white">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} stats={stats} />
        
        <div className="lg:pl-[280px] flex flex-col min-h-screen">
          <Header setIsSidebarOpen={setIsSidebarOpen} stats={stats} />
          
          <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/favorites" element={<FavoritesView />} />
                <Route path="/messages" element={<MessagesView />} />
                <Route path="/messages/:id" element={<MessagesView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="/notifications" element={<NotificationsView />} />
                
                {/* Discovery belongs in the storefront; buyer routes stay activity-focused. */}
                <Route path="/properties" element={<StorefrontRedirectView module="properties" />} />
                <Route path="/events" element={<StorefrontRedirectView module="events" />} />
                <Route path="/autos" element={<StorefrontRedirectView module="autos" />} />
                <Route path="/services" element={<StorefrontRedirectView module="services" />} />
                <Route path="/jobs" element={<StorefrontRedirectView module="jobs" />} />
                <Route path="/classifieds" element={<StorefrontRedirectView module="classifieds" />} />
                <Route path="/products" element={<StorefrontRedirectView module="products" />} />

                {/* Activity routes */}
                <Route path="/bookings" element={<UserActivityView title="My Bookings" />} />
                <Route path="/applications" element={<UserActivityView module="jobs" title="Job Applications" />} />
                <Route path="/auto-inquiries" element={<UserActivityView module="autos" title="Auto Inquiries" />} />
                <Route path="/appointments" element={<UserActivityView module="services" title="Service Appointments" />} />
                <Route path="/quotes" element={<UserActivityView module="services" title="Service Quotes" type="quote" />} />
                <Route path="/classifieds-activity" element={<UserActivityView module="classifieds" title="Classified Ads" />} />
                <Route path="/reviews" element={<ReviewsView />} />
                <Route path="/partner" element={<PartnerView />} />
                <Route path="*" element={<NotFoundView />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </Router>
  );
}
