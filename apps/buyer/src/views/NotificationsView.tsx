import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCircle,
  Trash2,
  ShoppingBag,
  Calendar,
  MessageSquare,
  Clock,
  Heart,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationApi,
  NotificationItem,
} from '../api/notificationApi';
import { toast } from 'sonner';

const TYPE_CONFIG: Record<string, { icon: React.ElementType; bg: string; text: string }> = {
  order:       { icon: ShoppingBag,  bg: 'bg-indigo-50',  text: 'text-indigo-600' },
  booking:     { icon: Calendar,     bg: 'bg-violet-50',  text: 'text-violet-600' },
  message:     { icon: MessageSquare,bg: 'bg-amber-50',   text: 'text-amber-600' },
  favorite:    { icon: Heart,        bg: 'bg-rose-50',    text: 'text-rose-600' },
  appointment: { icon: Clock,        bg: 'bg-sky-50',     text: 'text-sky-600' },
  system:      { icon: Sparkles,     bg: 'bg-purple-50',  text: 'text-purple-600' },
};

export default function NotificationsView() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  const dispatch = () => window.dispatchEvent(new Event('sellio_notifications_updated'));

  useEffect(() => {
    setLoading(true);
    fetchNotifications()
      .then(setNotifications)
      .catch(() => toast.error('Failed to load notifications.'))
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id).catch(console.error);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    dispatch();
  };

  const markAllAsRead = async () => {
    await markAllNotificationsAsRead().catch(console.error);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    dispatch();
  };

  const remove = async (id: string) => {
    await deleteNotificationApi(id).catch(console.error);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    dispatch();
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header card */}
      <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--primary-light)] text-[var(--primary-color)] rounded-2xl flex items-center justify-center shadow-sm">
            <Bell size={22} />
          </div>
          <div>
            <p className="section-label text-[var(--primary-color)]">Alert Center</p>
            <h1 className="text-xl font-black text-slate-800 leading-tight">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2.5 px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full align-middle">
                  {unreadCount} new
                </span>
              )}
            </h1>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors shrink-0"
        >
          <ArrowLeft size={13} />
          Dashboard
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all',
                filter === f ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800',
              )}
            >
              {f === 'all' ? 'All' : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-[var(--primary-color)] text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Check size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/70 p-5 flex gap-4 animate-pulse">
              <div className="w-11 h-11 rounded-xl bg-slate-100 shrink-0" />
              <div className="flex-1 space-y-2.5 pt-1">
                <div className="h-3.5 w-2/5 bg-slate-100 rounded-full" />
                <div className="h-3 w-4/5 bg-slate-100 rounded-full" />
                <div className="h-3 w-3/5 bg-slate-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200"
              >
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bell size={24} className="text-slate-400" strokeWidth={1.5} />
                </div>
                <p className="font-black text-slate-700 text-sm">All caught up</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium">No notifications under this filter.</p>
              </motion.div>
            ) : (
              filtered.map((n) => {
                const cfg = TYPE_CONFIG[n.type] ?? { icon: Bell, bg: 'bg-slate-100', text: 'text-slate-500' };
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, scale: 0.97 }}
                    className={cn(
                      'bg-white rounded-2xl border p-5 flex items-start gap-4 transition-all group',
                      n.read
                        ? 'border-slate-200/60 opacity-80'
                        : 'border-[var(--primary-color)]/20 shadow-sm shadow-[var(--primary-color)]/5',
                    )}
                  >
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
                      <Icon size={20} className={cfg.text} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h4 className={cn('text-sm font-black text-slate-800 leading-tight flex items-center gap-1.5', !n.read && 'text-slate-900')}>
                          {n.title}
                          {!n.read && (
                            <span className="w-2 h-2 bg-[var(--primary-color)] rounded-full inline-block shrink-0" />
                          )}
                        </h4>
                        <span className="section-label shrink-0">{n.date}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{n.message}</p>
                      <div className="flex gap-2">
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-[var(--primary-color)] hover:text-white rounded-lg text-[10px] font-bold text-slate-600 transition-all"
                          >
                            <CheckCircle size={10} />
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => remove(n.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-red-500 hover:text-white rounded-lg text-[10px] font-bold text-slate-500 transition-all"
                        >
                          <Trash2 size={10} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
