import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarCheck,
  MessageSquare,
  Heart,
  Briefcase,
  Clock,
  Wrench,
  Car,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useStats } from '../context/StatsContext';
import { useUser } from '../context/UserContext';
import { fetchBookings } from '../api/bookingApi';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

const PRIMARY_STATS = [
  {
    key: 'bookingsCount' as const,
    label: 'Active Bookings',
    link: '/bookings',
    icon: CalendarCheck,
    gradient: 'from-violet-500 to-indigo-500',
    lightBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    ringColor: 'ring-violet-100',
  },
  {
    key: 'messagesCount' as const,
    label: 'Unread Messages',
    link: '/messages',
    icon: MessageSquare,
    gradient: 'from-amber-400 to-orange-400',
    lightBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    ringColor: 'ring-amber-100',
  },
  {
    key: 'favoritesCount' as const,
    label: 'Saved Listings',
    link: '/favorites',
    icon: Heart,
    gradient: 'from-rose-400 to-pink-500',
    lightBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    ringColor: 'ring-rose-100',
  },
  {
    key: '_pendingTotal' as any,
    label: 'Pending Actions',
    link: '/applications',
    icon: Zap,
    gradient: 'from-emerald-400 to-teal-500',
    lightBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    ringColor: 'ring-emerald-100',
  },
];

const SECONDARY_STATS = [
  { key: 'appsCount' as const, label: 'Applications', icon: Briefcase, link: '/applications', color: 'text-rose-500', bg: 'bg-rose-50' },
  { key: 'appointmentsCount' as const, label: 'Appointments', icon: Clock, link: '/appointments', color: 'text-sky-500', bg: 'bg-sky-50' },
  { key: 'quotesCount' as const, label: 'Quotes', icon: Wrench, link: '/quotes', color: 'text-violet-500', bg: 'bg-violet-50' },
  { key: 'inquiriesCount' as const, label: 'Auto Inquiries', icon: Car, link: '/auto-inquiries', color: 'text-teal-500', bg: 'bg-teal-50' },
  { key: 'classifiedsActivityCount' as const, label: 'Classifieds', icon: Megaphone, link: '/classifieds-activity', color: 'text-orange-500', bg: 'bg-orange-50' },
];

function StatSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="stat-card p-5 animate-pulse">
          <div className="h-1 w-full bg-slate-100 mb-4 rounded-t" />
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-2.5 w-3/4 bg-slate-100 rounded-full" />
              <div className="h-7 w-1/2 bg-slate-100 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const { stats, isLoading, hasLoaded } = useStats();
  const { user, isLoading: authLoading } = useUser();
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [nextEventLoading, setNextEventLoading] = useState(true);

  useEffect(() => {
    fetchBookings()
      .then((items) => {
        const next = items.find((item: any) => item.status === 'confirmed' || item.status === 'pending') || items[0] || null;
        setNextEvent(next);
      })
      .catch(console.error)
      .finally(() => setNextEventLoading(false));
  }, []);

  const showSkeleton = authLoading || isLoading || !hasLoaded;

  const pendingTotal = stats.appsCount + stats.appointmentsCount + stats.quotesCount + stats.inquiriesCount;

  const primaryStatValues = PRIMARY_STATS.map((s) => ({
    ...s,
    value: s.key === '_pendingTotal' ? pendingTotal : (stats as any)[s.key] ?? 0,
  }));

  const statusColor = (s: string) => ({
    confirmed: 'text-emerald-600 bg-emerald-50',
    pending: 'text-amber-600 bg-amber-50',
    completed: 'text-sky-600 bg-sky-50',
    cancelled: 'text-red-600 bg-red-50',
  }[s] ?? 'text-slate-500 bg-slate-100');

  return (
    <div className="space-y-6">
      {/* ── Welcome Banner ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-slate-900 p-7 sm:p-8 text-white"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-[var(--primary-color)]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-0.5">{getGreeting()} 👋</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {authLoading ? (
                <span className="inline-block w-36 h-7 bg-white/10 rounded-xl animate-pulse" />
              ) : (
                user?.name || 'Welcome back'
              )}
            </h2>
            <p className="text-slate-500 text-sm mt-1.5 font-medium">{formatDate()}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/bookings"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <CalendarCheck size={14} />
              Bookings
            </Link>
            <Link
              to="/favorites"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Heart size={14} />
              Favorites
            </Link>
            <Link
              to="/messages"
              className="px-4 py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] rounded-xl text-white text-xs font-bold shadow-lg shadow-[var(--primary-color)]/30 transition-all flex items-center gap-1.5"
            >
              <MessageSquare size={14} />
              Messages
              {stats.messagesCount > 0 && (
                <span className="bg-white text-[var(--primary-color)] text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                  {stats.messagesCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Primary Stats ────────────────────────────────── */}
      {showSkeleton ? (
        <StatSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {primaryStatValues.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={stat.link} className="stat-card block group">
                <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="section-label mb-2.5 truncate">{stat.label}</p>
                      <p className="text-3xl sm:text-4xl font-black text-slate-900 leading-none tabular-nums">
                        {stat.value}
                      </p>
                    </div>
                    <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ring-4', stat.lightBg, stat.iconColor, stat.ringColor)}>
                      <stat.icon size={20} strokeWidth={2} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-[var(--primary-color)] transition-colors">
                    View all
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Bottom Section ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Next Booking + Activity breakdown */}
        <div className="lg:col-span-2 space-y-5">
          {/* Next Booking */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="widget-card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
                  <CalendarCheck size={18} className="text-violet-600" />
                </div>
                <div>
                  <p className="section-label">Upcoming</p>
                  <h3 className="text-sm font-black text-slate-800 leading-tight">Your Next Booking</h3>
                </div>
              </div>
              <Link
                to="/bookings"
                className="text-[11px] font-bold text-[var(--primary-color)] hover:underline flex items-center gap-1"
              >
                All Bookings <ArrowRight size={11} />
              </Link>
            </div>

            {nextEventLoading ? (
              <div className="flex items-center gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-3/4 bg-slate-100 rounded-full" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                  <div className="h-5 w-24 bg-slate-100 rounded-full" />
                </div>
              </div>
            ) : nextEvent ? (
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                  {nextEvent.itemImage && (
                    <img src={nextEvent.itemImage} alt={nextEvent.itemTitle} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate text-sm">{nextEvent.itemTitle}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 capitalize">{nextEvent.module}</p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide capitalize', statusColor(nextEvent.status))}>
                      {nextEvent.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(nextEvent.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 py-2">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0">
                  <CalendarCheck size={20} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">No upcoming bookings</p>
                  <p className="text-xs text-slate-400 mt-0.5">Browse listings to make your first booking.</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Activity At a Glance */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="widget-card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <TrendingUp size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="section-label">Summary</p>
                  <h3 className="text-sm font-black text-slate-800 leading-tight">Activity At a Glance</h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {SECONDARY_STATS.map((s, i) => (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <Link
                    to={s.link}
                    className={cn('flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:shadow-sm transition-all group border border-transparent hover:border-slate-100', showSkeleton ? 'animate-pulse' : '')}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}>
                      <s.icon size={18} className={cn(s.color)} strokeWidth={2} />
                    </div>
                    <p className="text-2xl font-black text-slate-900 leading-none tabular-nums">
                      {showSkeleton ? '—' : (stats as any)[s.key]}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 text-center leading-tight">{s.label}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Quick cards */}
        <div className="space-y-4">
          {/* Messages card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Link to="/messages" className="block widget-card p-5 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shadow-md shadow-amber-200">
                  <MessageSquare size={18} className="text-white" />
                </div>
                <div>
                  <p className="section-label">Inbox</p>
                  <p className="text-sm font-black text-slate-800 leading-tight">Messages</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-black text-slate-900 tabular-nums">{showSkeleton ? '—' : stats.messagesCount}</p>
                <p className="text-sm text-slate-400 mb-1 font-medium">unread</p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-amber-500 group-hover:gap-2 transition-all">
                Open inbox <ArrowRight size={11} />
              </div>
            </Link>
          </motion.div>

          {/* Favorites card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.42 }}
          >
            <Link to="/favorites" className="block widget-card p-5 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-md shadow-rose-200">
                  <Heart size={18} className="text-white" />
                </div>
                <div>
                  <p className="section-label">Wishlist</p>
                  <p className="text-sm font-black text-slate-800 leading-tight">Saved Listings</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-black text-slate-900 tabular-nums">{showSkeleton ? '—' : stats.favoritesCount}</p>
                <p className="text-sm text-slate-400 mb-1 font-medium">saved</p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-rose-500 group-hover:gap-2 transition-all">
                View wishlist <ArrowRight size={11} />
              </div>
            </Link>
          </motion.div>

          {/* Quick links grid */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.48 }}
            className="widget-card p-5"
          >
            <p className="section-label mb-3.5">Quick Access</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Bookings', to: '/bookings', icon: CalendarCheck, color: 'bg-violet-50 text-violet-600 hover:bg-violet-100' },
                { label: 'Applications', to: '/applications', icon: Briefcase, color: 'bg-rose-50 text-rose-600 hover:bg-rose-100' },
                { label: 'Appointments', to: '/appointments', icon: Clock, color: 'bg-sky-50 text-sky-600 hover:bg-sky-100' },
                { label: 'Reviews', to: '/reviews', icon: TrendingUp, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn('flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-colors', item.color)}
                >
                  <item.icon size={15} strokeWidth={2} />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
