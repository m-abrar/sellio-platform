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
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useStats } from '../context/StatsContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageHeader';
import { API_BASE_URL } from '../config/api';

export default function DashboardOverview() {
  const { stats } = useStats();
  const [nextEvent, setNextEvent] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/user/next-booking`)
      .then(res => res.json())
      .then(setNextEvent)
      .catch(console.error);
  }, []);

  const statCards = stats ? [
    { label: 'Upcoming Bookings', value: stats.bookingsCount, icon: Calendar, color: 'text-emerald-500' },
    { label: 'All Active Bookings', value: stats.bookingsCount, icon: CheckCircle, color: 'text-[var(--primary-color)]' },
    { label: 'Unread Messages', value: stats.messagesCount, icon: Mail, color: 'text-amber-500' },
    { label: 'Saved Listings', value: stats.favoritesCount, icon: Bookmark, color: 'text-rose-500' },
    { label: 'Applications Sent', value: stats.appsCount, icon: FileText, color: 'text-sky-500' },
    { label: 'Appointments', value: stats.appointmentsCount, icon: Clock, color: 'text-zinc-900' },
    { label: 'Quotes Requested', value: stats.quotesCount, icon: Wrench, color: 'text-zinc-600' },
    { label: 'Inquiries Sent', value: stats.inquiriesCount, icon: MessageCircle, color: 'text-zinc-400' },
  ] : [];

  if (!stats) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard Overview" />

      {/* Stats Grid */}
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
                {nextEvent ? (
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
              Manage Bookings ({stats.bookingsCount})
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
                <p className="text-lg font-bold text-zinc-900">{stats.favoritesCount} Listings Saved</p>
                <p className="text-sm text-zinc-500">Quickly revisit the properties, events, or services you love.</p>
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
                <p className="text-lg font-bold text-zinc-900">{stats.messagesCount} New Messages</p>
                <p className="text-sm text-zinc-500">Reply to partners about your quotes, applications, or inquiries.</p>
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
                <p className="text-lg font-bold text-zinc-900">{stats.appsCount + stats.appointmentsCount + stats.quotesCount} Pending Items</p>
                <p className="text-sm text-zinc-500">Applications, quotes, or inquiries awaiting a response.</p>
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
