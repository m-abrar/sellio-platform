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
  Search,
  Star,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchBookings, cancelBooking } from '../api/bookingApi';
import { createReview } from '../api/reviewApi';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
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

export default function UserActivityView({ module, type = 'booking', title }: UserActivityViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [pendingCancel, setPendingCancel] = useState<{ id: number; module: string } | null>(null);

  // Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewActivity, setReviewActivity] = useState<ActivityItem | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setActivities([]);
    fetchBookings(type, module)
      .then(setActivities)
      .catch(() => setError('Activity could not be loaded.'))
      .finally(() => setLoading(false));
  }, [module, type]);

  const handleCancel = async (id: number, moduleName: string) => {
    setCancellingId(id);
    try {
      await cancelBooking(id, moduleName, type);
      setActivities(prev => prev.map(act => act.id === id ? { ...act, status: 'cancelled' } : act));
      setPendingCancel(null);
    } catch (err: any) {
      alert(err?.message || 'Failed to cancel activity');
    } finally {
      setCancellingId(null);
    }
  };

  const handleLeaveReviewClick = (activity: ActivityItem) => {
    setReviewActivity(activity);
    setReviewRating(5);
    setReviewComment('');
    setReviewSuccessMessage(null);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewActivity) return;

    setIsSubmittingReview(true);
    try {
      const reviewableId = reviewActivity.reviewable_id ?? reviewActivity.item_id;

      const savedReview = await createReview({
        rating: reviewRating,
        comment: reviewComment,
        reviewable_id: reviewableId,
        reviewable_type: reviewActivity.module,
      });

      setReviewSuccessMessage('Review submitted successfully!');
      
      // Update local activity state so the Leave Review button disappears
      setActivities(prev =>
        prev.map(act =>
          act.id === reviewActivity.id ? { ...act, review_id: savedReview.id } : act
        )
      );

      // Close modal after a brief delay
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewActivity(null);
      }, 1500);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

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

      {error && (
        <div className="mx-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

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
                {(activity.status === 'pending' || activity.status === 'confirmed') && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setPendingCancel({ id: activity.id, module: activity.module })}
                  >
                    Cancel
                  </Button>
                )}
                {activity.status === 'completed' && !activity.review_id && (
                  <Button 
                    size="sm" 
                    className="bg-amber-500 hover:bg-amber-600 text-white border-none"
                    onClick={() => handleLeaveReviewClick(activity)}
                  >
                    Leave Review
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  rightIcon={<ChevronRight size={14} />}
                  onClick={() => navigate(`${location.pathname}/${activity.id}`, {
                    state: { activity, activityType: type, parentTitle: title || 'Activity' },
                  })}
                >
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

      {/* Create Review Modal */}
      <AnimatePresence>
        {showReviewModal && reviewActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative border border-zinc-100"
            >
              <button 
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-bold text-zinc-955 mb-1">Leave a Review</h3>
              <p className="text-xs text-zinc-500 mb-6">Share your experience for: <strong>{reviewActivity.itemTitle}</strong></p>

              {reviewSuccessMessage ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-6 text-center">
                  <CheckCircle2 className="mx-auto w-12 h-12 text-emerald-500 mb-2" />
                  <p className="text-sm font-bold text-emerald-800">{reviewSuccessMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  {/* Stars Rating Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star 
                            size={28} 
                            className={cn(
                              star <= reviewRating 
                                ? "text-amber-400 fill-amber-400" 
                                : "text-zinc-200"
                            )}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-sm font-extrabold text-zinc-900">{reviewRating}.0 / 5.0</span>
                    </div>
                  </div>

                  {/* Comment Textarea */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Comment / Feedback</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your experience here..."
                      className="w-full bg-zinc-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-zinc-950 transition-all placeholder-zinc-400"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowReviewModal(false)}
                      disabled={isSubmittingReview}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      isLoading={isSubmittingReview}
                    >
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
        description="Are you sure you want to cancel this activity? This action cannot be undone."
        confirmLabel="Yes, Cancel It"
        isLoading={cancellingId !== null}
        onConfirm={() => pendingCancel && handleCancel(pendingCancel.id, pendingCancel.module)}
        onCancel={() => setPendingCancel(null)}
      />
    </div>
  );
}
