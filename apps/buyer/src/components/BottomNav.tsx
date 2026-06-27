import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  CalendarCheck,
  MoreHorizontal,
  Briefcase,
  Car,
  Clock,
  Wrench,
  Megaphone,
  Star,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStats } from '../context/StatsContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Home', exact: true, badge: null },
  { to: '/favorites', icon: Heart, label: 'Saved', exact: false, badge: 'favoritesCount' },
  { to: '/messages', icon: MessageSquare, label: 'Messages', exact: false, badge: 'messagesCount' },
  { to: '/bookings', icon: CalendarCheck, label: 'Bookings', exact: false, badge: 'bookingsCount' },
] as const;

const MORE_ITEMS = [
  { to: '/applications',         icon: Briefcase, label: 'Job Applications',     badge: 'appsCount' },
  { to: '/appointments',         icon: Clock,     label: 'Service Appointments', badge: 'appointmentsCount' },
  { to: '/quotes',               icon: Wrench,    label: 'Service Quotes',       badge: 'quotesCount' },
  { to: '/auto-inquiries',       icon: Car,       label: 'Auto Inquiries',       badge: 'inquiriesCount' },
  { to: '/classifieds-activity', icon: Megaphone, label: 'Classified Ads',       badge: 'classifiedsActivityCount' },
  { to: '/reviews',              icon: Star,      label: 'My Reviews',           badge: 'reviewsCount' },
  { to: '/settings',             icon: Settings,  label: 'Settings',             badge: null },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const { stats, hasLoaded } = useStats();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isMoreActive = MORE_ITEMS.some((item) => location.pathname.startsWith(item.to));
  const moreActivityCount = hasLoaded
    ? (stats.appsCount ?? 0) + (stats.appointmentsCount ?? 0) + (stats.quotesCount ?? 0) + (stats.inquiriesCount ?? 0)
    : 0;

  return (
    <>
      {/* More sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-3xl shadow-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-slate-200" />
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">More</p>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="px-4 py-3 pb-6 grid grid-cols-2 gap-2">
                {MORE_ITEMS.map((item) => {
                  const badgeVal = hasLoaded && item.badge ? (stats as any)[item.badge] ?? 0 : 0;
                  const isActive = location.pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setSheetOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all',
                        isActive
                          ? 'bg-[var(--primary-color)] text-white shadow-md shadow-[var(--primary-color)]/25'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100',
                      )}
                    >
                      <item.icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 1.75}
                        className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-400')}
                      />
                      <span className="text-sm font-semibold truncate">{item.label}</span>
                      {badgeVal > 0 && (
                        <span className={cn(
                          'ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-black shrink-0',
                          isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600',
                        )}>
                          {badgeVal > 99 ? '99+' : badgeVal}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/70 safe-bottom shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const badgeValue = hasLoaded && item.badge ? (stats as any)[item.badge] : 0;

            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative flex flex-col items-center justify-center gap-1 min-w-[52px] min-h-[52px] px-2"
              >
                {isActive && (
                  <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 w-full max-w-[52px] mx-auto bg-[var(--primary-light)] rounded-2xl" />
                )}
                <div className="relative z-10">
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.75}
                    className={cn('transition-colors', isActive ? 'text-[var(--primary-color)]' : 'text-slate-400')}
                  />
                  {badgeValue > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-1 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                      {badgeValue > 9 ? '9+' : badgeValue}
                    </span>
                  )}
                </div>
                <span className={cn('relative z-10 text-[9px] font-bold transition-colors leading-none', isActive ? 'text-[var(--primary-color)]' : 'text-slate-400')}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More tab */}
          <button
            onClick={() => setSheetOpen(true)}
            className="relative flex flex-col items-center justify-center gap-1 min-w-[52px] min-h-[52px] px-2"
          >
            {(isMoreActive || sheetOpen) && (
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 w-full max-w-[52px] mx-auto bg-[var(--primary-light)] rounded-2xl" />
            )}
            <div className="relative z-10">
              <MoreHorizontal
                size={20}
                strokeWidth={(isMoreActive || sheetOpen) ? 2.5 : 1.75}
                className={cn('transition-colors', (isMoreActive || sheetOpen) ? 'text-[var(--primary-color)]' : 'text-slate-400')}
              />
              {moreActivityCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-1 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {moreActivityCount > 9 ? '9+' : moreActivityCount}
                </span>
              )}
            </div>
            <span className={cn('relative z-10 text-[9px] font-bold transition-colors leading-none', (isMoreActive || sheetOpen) ? 'text-[var(--primary-color)]' : 'text-slate-400')}>
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
