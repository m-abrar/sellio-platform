import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Heart, MessageSquare, CalendarCheck, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStats } from '../context/StatsContext';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Home', exact: true, badge: null },
  { to: '/favorites', icon: Heart, label: 'Saved', exact: false, badge: 'favoritesCount' },
  { to: '/messages', icon: MessageSquare, label: 'Messages', exact: false, badge: 'messagesCount' },
  { to: '/bookings', icon: CalendarCheck, label: 'Bookings', exact: false, badge: 'bookingsCount' },
  { to: '/settings', icon: Settings, label: 'Settings', exact: false, badge: null },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const { stats, hasLoaded } = useStats();

  return (
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
              {/* Active pill background */}
              {isActive && (
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 w-full max-w-[52px] mx-auto bg-[var(--primary-light)] rounded-2xl" />
              )}

              <div className="relative z-10">
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  className={cn(
                    'transition-colors',
                    isActive ? 'text-[var(--primary-color)]' : 'text-slate-400',
                  )}
                />
                {badgeValue > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-1 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                    {badgeValue > 9 ? '9+' : badgeValue}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  'relative z-10 text-[9px] font-bold transition-colors leading-none',
                  isActive ? 'text-[var(--primary-color)]' : 'text-slate-400',
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
