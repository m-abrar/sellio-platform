import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronRight, 
  Search,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchBookings } from '../api/bookingApi';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageHeader';

interface ActivityItem {
  id: number;
  item_id: string;
  itemTitle: string;
  module: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  booking_date: string;
  created_at: string;
  review_id: number | null;
}

interface UserActivityViewProps {
  module?: string;
  type?: 'booking' | 'quote';
  title?: string;
}

export default function UserActivityView({ module, type = 'booking', title }: UserActivityViewProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    fetchBookings(type)
      .then(setActivities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type]);

  const filteredActivities = activities.filter(a => {
    const matchesStatus = filter === 'all' || a.status === filter;
    const matchesModule = !module || a.module === module;
    return matchesStatus && matchesModule;
  });

  const getStatusVariant = (status: string): any => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'completed': return <CheckCircle2 size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <PageHeader 
        breadcrumb={title || "Activity"}
        title={title || "My Activity"}
        description="Track your bookings, applications, and inquiries."
        action={
          <div className="flex bg-white p-1 rounded-2xl border border-zinc-200">
            {['all', 'pending', 'confirmed', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all",
                  filter === f ? "bg-zinc-900 text-white shadow-md" : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      <div className="px-3 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredActivities.map((activity, i) => (
            <motion.div
              key={activity.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="glass-surface p-6 flex flex-col md:flex-row md:items-center gap-6 group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="default" className="bg-zinc-100 text-zinc-500">
                    {activity.module}
                  </Badge>
                  <Badge variant={getStatusVariant(activity.status)} className="flex items-center gap-1.5">
                    {getStatusIcon(activity.status)}
                    {activity.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-[var(--primary-color)] transition-colors">
                  {activity.itemTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-zinc-500 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Scheduled: {new Date(activity.booking_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>Requested: {new Date(activity.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {activity.status === 'completed' && !activity.review_id && (
                  <Button 
                    size="sm" 
                    className="bg-amber-500 hover:bg-amber-600 text-white border-none"
                    onClick={() => window.location.href = '/reviews'}
                  >
                    Leave Review
                  </Button>
                )}
                {activity.status === 'pending' && (
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                )}
                <Button size="sm" variant="outline" rightIcon={<ChevronRight size={14} />}>
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredActivities.length === 0 && (
          <EmptyState 
            icon={Search}
            title="No activity found"
            description="You haven't made any bookings or applications in this category yet."
          />
        )}
      </div>
    </div>
  );
}
