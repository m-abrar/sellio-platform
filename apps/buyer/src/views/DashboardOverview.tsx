import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  CheckCircle, 
  Mail, 
  Bookmark, 
  FileText, 
  Clock, 
  Wrench, 
  MessageCircle,
  HelpCircle,
  CalendarCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useStats } from '../context/StatsContext';
import { useUser } from '../context/UserContext';
import { PageHeader } from '../components/PageHeader';
import { fetchBookings } from '../api/bookingApi';

const STAT_CARD_DEFS = [
  { label: 'Upcoming Bookings', key: 'bookingsCount' as const, icon: Calendar, color: 'text-emerald-500' },
  { label: 'All Active Bookings', key: 'bookingsCount' as const, icon: CheckCircle, color: 'text-[var(--primary-color)]' },
  { label: 'Unread Messages', key: 'messagesCount' as const, icon: Mail, color: 'text-amber-500' },
  { label: 'Saved Listings', key: 'favoritesCount' as const, icon: Bookmark, color: 'text-rose-500' },
  { label: 'Applications Sent', key: 'appsCount' as const, icon: FileText, color: 'text-sky-500' },
  { label: 'Appointments', key: 'appointmentsCount' as const, icon: Clock, color: 'text-zinc-900' },
  { label: 'Quotes Requested', key: 'quotesCount' as const, icon: Wrench, color: 'text-zinc-600' },
  { label: 'Inquiries Sent', key: 'inquiriesCount' as const, icon: MessageCircle, color: 'text-zinc-400' },
];

function StatsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 px-3"
      aria-busy="true"
      aria-label="Loading dashboard stats"
    >
      {STAT_CARD_DEFS.map((stat) => (
        <div key={stat.label} className="glass-surface p-6 flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-zinc-200" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-24 rounded-full bg-zinc-200" />
            <div className="h-8 w-12 rounded-xl bg-zinc-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const { stats, isLoading, hasLoaded } = useStats();
  const { isLoading: authLoading } = useUser();
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [nextEventLoading, setNextEventLoading] = useState(true);

  useEffect(() => {
    fetchBookings()
      .then((items) => {
        const next = items.find((item: any) => item.status === 'confirmed') || items[0] || null;
        setNextEvent(next);
      })
      .catch(console.error)
      .finally(() => setNextEventLoading(false));
  }, []);

  const statCards = STAT_CARD_DEFS.map((def) => ({
    ...def,
    value: stats[def.key],
  }));

  const showSkeleton = authLoading || isLoading || !hasLoaded;

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard Overview" />

      {showSkeleton ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 px-3">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-surface p-6 flex items-center gap-4"
            >
              <div className={cn("stat-icon-wrapper", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-extrabold text-zinc-900 leading-none">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="px-3">
        <h2 className="text-xl font-bold text-zinc-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookings Widget */}
          <div className="glass-surface p-8 flex flex-col justify-between min-h-[300px]">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Your Next Event</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="p-4 bg-[var(--primary-light)] rounded-2xl text-[var(--primary-color)]">
                <CalendarCheck size={48} />
              </div>
              <div>
                {nextEventLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-40 rounded-full bg-zinc-200" />
                    <div className="h-3 w-28 rounded-full bg-zinc-200" />
                  </div>
                ) : nextEvent ? (
                  <>
                    <p className="text-lg font-bold text-zinc-900">{nextEvent.itemTitle}</p>
                    <p className="text-sm text-zinc-500">Scheduled for {new Date(nextEvent.booking_date).toLocaleDateString()}</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold text-zinc-900">No Upcoming Events</p>
                    <p className="text-sm text-zinc-500">You don't have any confirmed bookings scheduled.</p>
                  </>
                )}
              </div>
            </div>
            <Link 
              to="/bookings" 
              className="w-full py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded-full text-center font-bold hover:bg-[var(--primary-color)] hover:text-white transition-all"
            >
              Manage Bookings ({showSkeleton ? '…' : stats.bookingsCount})
            </Link>
          </div>

          {/* Favorites Widget */}
          <div className="glass-surface p-8 flex flex-col justify-between min-h-[300px]">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Saved Listings</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="p-4 bg-rose-50 rounded-2xl text-rose-500">
                <Bookmark size={48} />
              </div>
              <div>
                {showSkeleton ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-40 rounded-full bg-zinc-200" />
                    <div className="h-3 w-28 rounded-full bg-zinc-200" />
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-bold text-zinc-900">{stats.favoritesCount} Listings Saved</p>
                    <p className="text-sm text-zinc-500">Quickly revisit the properties, events, or services you love.</p>
                  </>
                )}
              </div>
            </div>
            <Link
              to="/favorites"
              className="w-full py-3 border-2 border-rose-500 text-rose-500 rounded-full text-center font-bold hover:bg-rose-500 hover:text-white transition-all"
            >
              View Saved Listings
            </Link>
          </div>

          {/* Messages Widget */}
          <div className="glass-surface p-8 flex flex-col justify-between min-h-[300px]">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">My Messages</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="p-4 bg-amber-50 rounded-2xl text-amber-500">
                <MessageCircle size={48} />
              </div>
              <div>
                {showSkeleton ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-40 rounded-full bg-zinc-200" />
                    <div className="h-3 w-28 rounded-full bg-zinc-200" />
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-bold text-zinc-900">{stats.messagesCount} New Messages</p>
                    <p className="text-sm text-zinc-500">Reply to partners about your quotes, applications, or inquiries.</p>
                  </>
                )}
              </div>
            </div>
            <Link
              to="/messages"
              className="w-full py-3 border-2 border-amber-500 text-amber-500 rounded-full text-center font-bold hover:bg-amber-500 hover:text-white transition-all"
            >
              Go to Inbox
            </Link>
          </div>

          {/* Activity Widget */}
          <div className="glass-surface p-8 flex flex-col justify-between min-h-[300px]">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Activity Status</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="p-4 bg-sky-50 rounded-2xl text-sky-500">
                <HelpCircle size={48} />
              </div>
              <div>
                {showSkeleton ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-40 rounded-full bg-zinc-200" />
                    <div className="h-3 w-28 rounded-full bg-zinc-200" />
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-bold text-zinc-900">{stats.appsCount + stats.appointmentsCount + stats.quotesCount} Pending Items</p>
                    <p className="text-sm text-zinc-500">Applications, quotes, or inquiries awaiting a response.</p>
                  </>
                )}
              </div>
            </div>
            <Link 
              to="/applications" 
              className="w-full py-3 border-2 border-sky-500 text-sky-500 rounded-full text-center font-bold hover:bg-sky-500 hover:text-white transition-all"
            >
              View My Activity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
