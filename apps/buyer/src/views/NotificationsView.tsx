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
  ArrowLeft 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Notification {
  id: string;
  type: 'order' | 'booking' | 'message' | 'favorite' | 'appointment' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'order': return ShoppingBag;
    case 'booking': return Calendar;
    case 'message': return MessageSquare;
    case 'favorite': return Heart;
    case 'appointment': return Clock;
    case 'system': return Sparkles;
    default: return Bell;
  }
};

const getColorClass = (type: string) => {
  switch (type) {
    case 'order': return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30';
    case 'booking': return 'bg-purple-50 text-purple-600 dark:bg-purple-950/30';
    case 'message': return 'bg-amber-50 text-amber-600 dark:bg-amber-950/30';
    case 'favorite': return 'bg-rose-50 text-rose-650 dark:bg-rose-950/30';
    case 'appointment': return 'bg-blue-50 text-blue-600 dark:bg-blue-950/30';
    case 'system': return 'bg-purple-100 text-[var(--primary-color)] dark:bg-purple-950/50';
    default: return 'bg-zinc-100 text-zinc-500';
  }
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'booking',
    title: 'Booking Confirmed!',
    message: 'Your booking request for "Cozy Mountain Chalet" has been approved by the host! Get ready for your trip starting next Friday.',
    date: 'Today, 10:24 AM',
    read: false
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'New Inbox Message',
    message: 'You received a new message from Sarah Connor regarding your inquiry on "Tesla Model S". Open your inbox to reply.',
    date: 'Today, 8:15 AM',
    read: false
  },
  {
    id: 'notif-3',
    type: 'favorite',
    title: 'Price Drop Alert!',
    message: 'Great news! "Minimalist Leather Sofa" in your Favorites list has dropped by 15%. Grab it now while stock lasts.',
    date: 'Yesterday',
    read: false
  },
  {
    id: 'notif-4',
    type: 'appointment',
    title: 'Service Appointment Scheduled',
    message: 'Your upcoming service appointment for "Premium Brake System Maintenance" is scheduled for June 5, 2026 at 10:00 AM.',
    date: 'May 28, 2026',
    read: true
  },
  {
    id: 'notif-5',
    type: 'system',
    title: 'Buyer Portal Redesigned!',
    message: 'Welcome to the premium Sellio Buyer Dashboard! Enjoy 1-click quick-shortcut docks, date-grouped real-time chats, and highly fluid layouts.',
    date: 'May 26, 2026',
    read: true
  }
];

export default function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage or set defaults
    const stored = localStorage.getItem('sellio_buyer_notifications');
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } else {
      setNotifications(INITIAL_NOTIFICATIONS);
      localStorage.setItem('sellio_buyer_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const saveToStorage = (newNotifs: Notification[]) => {
    setNotifications(newNotifs);
    localStorage.setItem('sellio_buyer_notifications', JSON.stringify(newNotifs));
    
    // Dispatch custom event to notify App header to update notification badges
    window.dispatchEvent(new Event('sellio_notifications_updated'));
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveToStorage(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveToStorage(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveToStorage(updated);
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto px-1">
      {/* Header card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-zinc-200/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[var(--primary-light)] text-[var(--primary-color)] rounded-xl flex items-center justify-center shadow-xs">
            <Bell size={24} className="animate-swing" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[var(--primary-color)] uppercase tracking-wider">Alert Center</span>
            <h1 className="text-xl font-extrabold text-zinc-800 leading-tight">Notifications</h1>
          </div>
        </div>

        <Link
          to="/"
          className="px-4 py-2 bg-white border border-zinc-200 text-zinc-650 hover:text-zinc-900 rounded-xl hover:shadow-xs transition-all flex items-center justify-center gap-1.5 text-xs font-bold shrink-0 self-start md:self-auto cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      {/* Filter tab bar */}
      <div className="flex items-center justify-between border-b border-zinc-200/60 pb-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer",
              filter === 'all' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-450 hover:text-zinc-800'
            )}
          >
            All Alerts
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer",
              filter === 'unread' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-450 hover:text-zinc-800'
            )}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 bg-zinc-900 hover:bg-[var(--primary-color)] text-white rounded-xl text-xs font-bold hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle size={14} /> Mark All Read
          </button>
        )}
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300 animate-pulse">Syncing alerts...</span>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filteredNotifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20 bg-white/70 backdrop-blur-xs rounded-2xl border border-zinc-200/40 shadow-xs max-w-md mx-auto"
              >
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-300 border border-zinc-200/10 shadow-2xs">
                  <Bell size={28} />
                </div>
                <h4 className="font-extrabold text-zinc-800 text-sm mb-1">Pristine Notification Center</h4>
                <p className="text-zinc-500 text-xs leading-relaxed px-6">
                  You are all caught up! No notifications found under this filter.
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((n) => {
                const IconComponent = getIcon(n.type);
                return (
                  <motion.div 
                    key={n.id} 
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className={cn(
                      "group relative bg-white/90 backdrop-blur-md p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 shadow-2xs",
                      n.read ? "border-zinc-200/45 opacity-75" : "border-purple-200/60 shadow-xs shadow-purple-500/3"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-colors shadow-2xs",
                      getColorClass(n.type)
                    )}>
                      <IconComponent size={22} className="transition-transform group-hover:scale-105" />
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h4 className={cn(
                          "font-extrabold text-xs sm:text-sm tracking-tight transition-colors",
                          n.read ? "text-zinc-600" : "text-zinc-800"
                        )}>
                          {n.title}
                          {!n.read && <span className="inline-block w-2 h-2 bg-[var(--primary-color)] rounded-full ml-2 animate-pulse" />}
                        </h4>
                        <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider shrink-0">
                          {n.date}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed mb-3.5 max-w-3xl">
                        {n.message}
                      </p>
                      
                      <div className="flex gap-2">
                        {!n.read && (
                          <button 
                            onClick={() => markAsRead(n.id)}
                            className="px-3.5 py-1.5 bg-zinc-50 hover:bg-[var(--primary-color)] hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-wider text-zinc-600 hover:shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle size={11} /> Mark Read
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(n.id)}
                          className="px-3.5 py-1.5 bg-zinc-50 hover:bg-red-500 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-wider text-zinc-650 hover:shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={11} /> Delete
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
