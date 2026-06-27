import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiOutlineCalendar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBanknotes,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineArrowLeft,
} from 'react-icons/hi2';
import { toast } from 'sonner';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationApi,
} from '../../api/notifications';
import { getApiErrorMessage } from '../../lib/apiErrorMessage';

const getIcon = (type: string) => {
  switch (type) {
    case 'order':   return HiOutlineShoppingBag;
    case 'booking': return HiOutlineCalendar;
    case 'inquiry': return HiOutlineChatBubbleLeftRight;
    case 'payout':  return HiOutlineBanknotes;
    case 'system':  return HiOutlineShieldCheck;
    case 'review':  return HiOutlineStar;
    default:        return HiOutlineBell;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case 'order':   return 'bg-indigo-50 text-indigo-600';
    case 'booking': return 'bg-violet-50 text-violet-600';
    case 'inquiry': return 'bg-blue-50 text-blue-600';
    case 'payout':  return 'bg-emerald-50 text-emerald-600';
    case 'system':  return 'bg-amber-50 text-amber-600';
    case 'review':  return 'bg-pink-50 text-pink-600';
    default:        return 'bg-slate-50 text-slate-500';
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response.data.data);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load notifications.'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteNotificationApi(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications =
    filter === 'all' ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader badge="Alerts" title="Notifications" subtitle="">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-caption font-semibold uppercase tracking-wider text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-xs"
        >
          <HiOutlineArrowLeft className="w-4 h-4" /> Back
        </Link>
      </PageHeader>

      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 bg-slate-50/80 p-1 rounded-interactive border border-slate-100/80">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-caption font-semibold uppercase tracking-wider transition-all duration-200 ${
                filter === f
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-100/80'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f === 'all' ? 'All' : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-caption font-semibold uppercase tracking-wider hover:bg-brand transition-all"
          >
            <HiOutlineCheckCircle className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-label font-semibold uppercase tracking-caps-wide text-slate-300 animate-pulse">
            Loading alerts…
          </span>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-card border border-slate-100">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
            <HiOutlineBell className="w-6 h-6 text-slate-200" />
          </div>
          <p className="text-label font-semibold uppercase tracking-label-caps text-slate-300">
            No notifications found
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((n) => {
            const Icon = getIcon(n.type);
            return (
              <div
                key={n.id}
                className={`group relative bg-white rounded-card-sm border transition-all duration-200 flex items-start gap-5 p-5 md:p-6 ${
                  n.read
                    ? 'border-slate-100 opacity-70 hover:opacity-100'
                    : 'border-brand/15 shadow-sm shadow-violet-50/80'
                }`}
              >
                {/* Unread indicator bar */}
                {!n.read && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-brand rounded-r-full" />
                )}

                <div className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center ${getColor(n.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h4 className={`text-nav font-semibold leading-snug ${n.read ? 'text-slate-600' : 'text-slate-900'}`}>
                      {n.title}
                      {!n.read && (
                        <span className="inline-block w-1.5 h-1.5 bg-brand rounded-full ml-2 align-middle" />
                      )}
                    </h4>
                    <span className="text-micro font-medium text-slate-400 uppercase tracking-wider shrink-0 mt-0.5">
                      {n.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl mb-3">{n.message}</p>

                  <div className="flex gap-2">
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-brand hover:text-white text-label font-semibold uppercase tracking-wider text-slate-500 transition-all"
                      >
                        <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-red-500 hover:text-white text-label font-semibold uppercase tracking-wider text-slate-500 transition-all"
                    >
                      <HiOutlineTrash className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
