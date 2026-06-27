import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Star,
  X,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchBookings, cancelBooking } from '../api/bookingApi';
import { createReview } from '../api/reviewApi';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

interface ActivityItem {
  id: number;
  item_id: string;
  reviewable_id: number | string | null;
  itemTitle: string;
  itemImage: string;
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

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; strip: string; pill: string }> = {
  confirmed: { label: 'Confirmed', icon: CheckCircle2, strip: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700' },
  pending:   { label: 'Pending',   icon: Clock,        strip: 'bg-amber-400',  pill: 'bg-amber-50 text-amber-700' },
  completed: { label: 'Completed', icon: CheckCircle2, strip: 'bg-sky-500',    pill: 'bg-sky-50 text-sky-700' },
  cancelled: { label: 'Cancelled', icon: XCircle,      strip: 'bg-rose-400',   pill: 'bg-rose-50 text-rose-700' },
};

const FILTERS = ['all', 'pending', 'confirmed', 'completed'] as const;
type Filter = typeof FILTERS[number];

export default function UserActivityView({ module, type = 'booking', title }: UserActivityViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [pendingCancel, setPendingCancel] = useState<{ id: number; module: string } | null>(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewActivity, setReviewActivity] = useState<ActivityItem | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setActivities([]);
    fetchBookings(type, module)
      .then(setActivities)
      .catch(() => setError('Could not load activity. Please try again.'))
      .finally(() => setLoading(false));
  }, [module, type]);

  const handleCancel = async (id: number, moduleName: string) => {
    setCancellingId(id);
    try {
      await cancelBooking(id, moduleName, type);
      setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)));
      setPendingCancel(null);
    } catch (err: any) {
      alert(err?.message || 'Failed to cancel');
    } finally {
      setCancellingId(null);
    }
  };

  const openReview = (activity: ActivityItem) => {
    setReviewActivity(activity);
    setReviewRating(5);
    setReviewComment('');
    setReviewSuccess(false);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewActivity) return;
    setIsSubmittingReview(true);
    try {
      const reviewableId = reviewActivity.reviewable_id ?? reviewActivity.item_id;
      const saved = await createReview({
        rating: reviewRating,
        comment: reviewComment,
        reviewable_id: reviewableId,
        reviewable_type: reviewActivity.module,
      });
      setReviewSuccess(true);
      setActivities((prev) =>
        prev.map((a) => (a.id === reviewActivity.id ? { ...a, review_id: saved.id } : a)),
      );
      setTimeout(() => { setShowReviewModal(false); setReviewActivity(null); }, 1500);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredActivities = activities.filter((a) => {
    const matchStatus = filter === 'all' || a.status === filter;
    const matchModule = !module || a.module === module;
    return matchStatus && matchModule;
  });

  const counts = FILTERS.reduce<Record<string, number>>((acc, f) => {
    acc[f] = f === 'all' ? activities.length : activities.filter((a) => a.status === f).length;
    return acc;
  }, {});

  if (loading) return (
    <div className="space-y-6">
      <div className="h-10 w-48 bg-slate-100 rounded-2xl animate-pulse" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="activity-row animate-pulse">
            <div className="w-1 shrink-0 bg-slate-100" />
            <div className="flex-1 flex items-center gap-4 p-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0 hidden sm:block" />
              <div className="flex-1 space-y-2.5">
                <div className="flex gap-2">
                  <div className="h-4 w-16 bg-slate-100 rounded-full" />
                  <div className="h-4 w-20 bg-slate-100 rounded-full" />
                </div>
                <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
                <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
              </div>
              <div className="h-8 w-20 bg-slate-100 rounded-xl shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        breadcrumb={title || 'Activity'}
        title={title || 'My Activity'}
        description="Track your bookings, applications, and inquiries."
        action={
          <div className="flex items-center gap-2 min-w-0">
            <SlidersHorizontal size={14} className="text-slate-400 shrink-0" />
            <div className="flex bg-white border border-slate-200 p-1 rounded-2xl gap-1 overflow-x-auto scrollbar-none">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all whitespace-nowrap shrink-0',
                    filter === f ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800',
                  )}
                >
                  {f}
                  {counts[f] > 0 && filter !== f && (
                    <span className="ml-1 text-[9px] font-black text-slate-400">({counts[f]})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600 flex items-center gap-3">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredActivities.map((activity, i) => {
            const cfg = STATUS_CONFIG[activity.status] ?? STATUS_CONFIG.pending;
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04 }}
                className="activity-row group"
              >
                {/* Left status strip */}
                <div className={cn('w-1 shrink-0', cfg.strip)} />

                {/* Content */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                  {/* Image thumbnail */}
                  {activity.itemImage && (
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 hidden sm:block">
                      <img
                        src={activity.itemImage}
                        alt={activity.itemTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wide capitalize">
                        {activity.module}
                      </span>
                      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide', cfg.pill)}>
                        <StatusIcon size={10} />
                        {cfg.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-[var(--primary-color)] transition-colors">
                      {activity.itemTitle}
                    </h3>

                    <div className="flex flex-wrap gap-3 mt-1.5 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(activity.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        Requested {new Date(activity.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {(activity.status === 'pending' || activity.status === 'confirmed') && (
                      <button
                        onClick={() => setPendingCancel({ id: activity.id, module: activity.module })}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-500 text-xs font-bold hover:bg-rose-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    {activity.status === 'completed' && !activity.review_id && (
                      <button
                        onClick={() => openReview(activity)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 text-white text-xs font-bold hover:bg-amber-500 transition-colors flex items-center gap-1"
                      >
                        <Star size={11} />
                        Review
                      </button>
                    )}
                    <button
                      onClick={() =>
                        navigate(`${location.pathname}/${activity.id}`, {
                          state: { activity, activityType: type, parentTitle: title || 'Activity' },
                        })
                      }
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      Details
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredActivities.length === 0 && !loading && (
          <EmptyState
            icon={Search}
            title="Nothing here yet"
            description="You haven't made any bookings or applications in this category yet."
          />
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && reviewActivity && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              className="bg-white rounded-3xl p-7 w-full max-w-md shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Leave a Review</h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[260px]">{reviewActivity.itemTitle}</p>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {reviewSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                    <CheckCircle2 size={28} className="text-emerald-500" />
                  </div>
                  <p className="font-black text-slate-900">Review submitted!</p>
                  <p className="text-xs text-slate-500 mt-1">Thank you for sharing your feedback.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Your Rating</p>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            size={30}
                            className={cn(star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200')}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-black text-slate-900">{reviewRating}.0</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Your Feedback</p>
                    <textarea
                      required
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] transition-all placeholder-slate-400 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-1">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowReviewModal(false)} disabled={isSubmittingReview}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" isLoading={isSubmittingReview}>
                      Submit Review
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={pendingCancel !== null}
        title="Cancel Activity"
        description="Are you sure you want to cancel? This action cannot be undone."
        confirmLabel="Yes, Cancel"
        isLoading={cancellingId !== null}
        onConfirm={() => pendingCancel && handleCancel(pendingCancel.id, pendingCancel.module)}
        onCancel={() => setPendingCancel(null)}
      />
    </div>
  );
}
