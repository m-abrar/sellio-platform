import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Heart, CalendarCheck, MessageSquare, Settings } from 'lucide-react';
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-zinc-200/60 safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          const badgeValue = hasLoaded && item.badge ? (stats as any)[item.badge] : 0;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-3 py-1 rounded-xl transition-all duration-200 relative',
                isActive
                  ? 'text-[var(--primary-color)]'
                  : 'text-zinc-400 hover:text-zinc-700'
              )}
            >
              <div className="relative">
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                {badgeValue > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-1 bg-red-500 text-white text-[8px] font-extrabold flex items-center justify-center rounded-full border border-white">
                    {badgeValue > 9 ? '9+' : badgeValue}
                  </span>
                )}
              </div>
              <span className={cn('text-[9px] font-bold tracking-wide', isActive ? 'text-[var(--primary-color)]' : 'text-zinc-400')}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[var(--primary-color)] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
