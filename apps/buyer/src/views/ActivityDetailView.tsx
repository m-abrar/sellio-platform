import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Hash,
  Star,
  CheckCircle2,
  X,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { cancelBooking } from '../api/bookingApi';
import { createReview } from '../api/reviewApi';
import { storefrontListingUrl } from '../config/api';

interface ActivityDetail {
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

const STATUS_VARIANT: Record<string, any> = {
  confirmed: 'success',
  pending: 'warning',
  completed: 'info',
  cancelled: 'danger',
};

function statusIcon(status: string) {
  if (status === 'confirmed' || status === 'completed') return <CheckCircle2 size={13} />;
  if (status === 'cancelled') return <XCircle size={13} />;
  return <AlertCircle size={13} />;
}

export default function ActivityDetailView() {
  const location = useLocation();
  const navigate = useNavigate();

  const { activity: initialActivity, activityType, parentTitle = 'Activity' } = (location.state || {}) as {
    activity?: ActivityDetail;
    activityType?: string;
    parentTitle?: string;
  };

  const [activity, setActivity] = useState<ActivityDetail | null>(initialActivity || null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelBooking(activity!.id, activity!.module, activityType);
      setActivity(prev => prev ? { ...prev, status: 'cancelled' } : prev);
      setShowCancelConfirm(false);
    } catch (err: any) {
      alert(err?.message || 'Failed to cancel');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity) return;
    setIsSubmittingReview(true);
    try {
      const reviewableId = activity.reviewable_id ?? activity.item_id;
      const savedReview = await createReview({
        rating: reviewRating,
        comment: reviewComment,
        reviewable_id: reviewableId,
        reviewable_type: activity.module,
      });
      setReviewSuccess(true);
      setActivity(prev => prev ? { ...prev, review_id: savedReview.id } : prev);
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSuccess(false);
      }, 1500);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!activity) {
    return (
      <div className="space-y-8">
        <div className="px-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 text-sm font-bold transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
        <div className="px-3 text-center py-20">
          <p className="text-zinc-400 mb-4">No detail data available. Please navigate from your activity list.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Back nav */}
      <div className="px-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 text-sm font-bold transition-colors"
        >
          <ArrowLeft size={16} /> {parentTitle}
        </button>
      </div>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-3 rounded-3xl overflow-hidden border border-zinc-200/80 bg-white shadow-sm"
      >
        {/* Image */}
        <div className="relative h-48 sm:h-64 overflow-hidden bg-zinc-100">
          <img
            src={activity.itemImage}
            alt={activity.itemTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="bg-white/20 text-white backdrop-blur-sm border-none text-[10px] capitalize">
                {activity.module}
              </Badge>
              <Badge variant={STATUS_VARIANT[activity.status]} className="flex items-center gap-1 text-[10px] capitalize">
                {statusIcon(activity.status)}
                {activity.status}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {activity.itemTitle}
            </h1>
          </div>
        </div>

        {/* Info grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reference</p>
            <p className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
              <Hash size={13} className="text-zinc-400" />#{activity.id}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Scheduled For</p>
            <p className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
              <Calendar size={13} className="text-zinc-400" />
              {new Date(activity.booking_date).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date Requested</p>
            <p className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
              <Clock size={13} className="text-zinc-400" />
              {new Date(activity.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action bar */}
        <div className="px-6 pb-6 flex flex-wrap gap-3 border-t border-zinc-100 pt-5">
          <a
            href={storefrontListingUrl(activity.item_id, activity.module)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-bold hover:bg-zinc-50 transition-colors"
          >
            <ExternalLink size={14} /> View Listing
          </a>

          {(activity.status === 'pending' || activity.status === 'confirmed') && (
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => setShowCancelConfirm(true)}
            >
              Cancel
            </Button>
          )}

          {activity.status === 'completed' && !activity.review_id && (
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white border-none"
              leftIcon={<Star size={14} />}
              onClick={() => { setReviewRating(5); setReviewComment(''); setShowReviewModal(true); }}
            >
              Leave Review
            </Button>
          )}
        </div>
      </motion.div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
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

              <h3 className="text-xl font-bold text-zinc-900 mb-1">Leave a Review</h3>
              <p className="text-xs text-zinc-500 mb-6">
                Share your experience for: <strong>{activity.itemTitle}</strong>
              </p>

              {reviewSuccess ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-6 text-center">
                  <CheckCircle2 className="mx-auto w-12 h-12 text-emerald-500 mb-2" />
                  <p className="text-sm font-bold text-emerald-800">Review submitted successfully!</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
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
                              star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'
                            )}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-sm font-extrabold text-zinc-900">{reviewRating}.0 / 5.0</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Comment / Feedback
                    </label>
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
                    <Button type="submit" isLoading={isSubmittingReview}>
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
        isOpen={showCancelConfirm}
        title="Cancel Activity"
        description="Are you sure you want to cancel this activity? This action cannot be undone."
        confirmLabel="Yes, Cancel It"
        isLoading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
}
