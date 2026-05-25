import React, { useState, useEffect } from 'react';
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
  HiOutlineStar 
} from 'react-icons/hi2';
import { toast } from 'sonner';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification as deleteNotificationApi } from '../../api/notifications';

const getIcon = (type: string) => {
  switch (type) {
    case 'order': return HiOutlineShoppingBag;
    case 'booking': return HiOutlineCalendar;
    case 'inquiry': return HiOutlineChatBubbleLeftRight;
    case 'payout': return HiOutlineBanknotes;
    case 'system': return HiOutlineShieldCheck;
    case 'review': return HiOutlineStar;
    default: return HiOutlineBell;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case 'order': return 'bg-indigo-50 text-indigo-600';
    case 'booking': return 'bg-purple-50 text-purple-600';
    case 'inquiry': return 'bg-blue-50 text-blue-600';
    case 'payout': return 'bg-emerald-50 text-emerald-600';
    case 'system': return 'bg-amber-50 text-amber-600';
    case 'review': return 'bg-pink-50 text-pink-600';
    default: return 'bg-slate-50 text-slate-600';
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
        console.error("Failed to fetch notifications", error);
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
    } catch (error) {
      console.error('Failed to mark notification as read', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteNotificationApi(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification', error);
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader 
        badge="Alerts" 
        title="Notification" 
        subtitle="Center"
      >
        <div className="flex gap-3">
          <button 
            onClick={markAllAsRead}
            className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <HiOutlineCheckCircle className="w-4 h-4" /> Mark All Read
          </button>
        </div>
      </PageHeader>

      <div className="flex gap-4 border-b border-slate-100 pb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
        >
          All Notifications
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${filter === 'unread' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Alerts...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-100">
              <HiOutlineBell className="w-12 h-12 text-slate-100 mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const Icon = getIcon(n.type);
              return (
                <div 
                  key={n.id} 
                  className={`group relative bg-white p-6 rounded-[2rem] border transition-all duration-300 flex items-start gap-6 ${n.read ? 'border-slate-100 opacity-75' : 'border-purple-100 shadow-sm shadow-purple-50'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${getColor(n.type)}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-black tracking-tight ${n.read ? 'text-slate-600' : 'text-slate-900'}`}>
                        {n.title}
                        {!n.read && <span className="inline-block w-2 h-2 bg-purple-500 rounded-full ml-2 animate-pulse" />}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{n.message}</p>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {!n.read && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-purple-500 hover:text-white transition-all"
                        title="Mark as read"
                      >
                        <HiOutlineCheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(n.id)}
                      className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      title="Delete"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
