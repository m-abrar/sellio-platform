import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Star, MessageSquare, Calendar, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { deleteReview, fetchReviews, updateReview } from '../api/reviewApi';
import { useUser } from '../context/UserContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { API_BASE_URL } from '../config/api';

const API_ORIGIN = (() => { try { return new URL(API_BASE_URL).origin; } catch { return ''; } })();
const FALLBACK_CARD = `${API_ORIGIN}/images/fallbacks/default-card.jpg`;
const FALLBACK_AVATAR = `${API_ORIGIN}/images/fallbacks/default-avatar.png`;

interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  itemTitle: string;
  itemImage: string;
  itemModule: string;
  created_at: string;
}

function StarRating({ rating, onChange, size = 24 }: { rating: number; onChange?: (r: number) => void; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          className={cn('transition-transform', onChange ? 'hover:scale-110 cursor-pointer' : 'cursor-default')}
        >
          <Star
            size={size}
            className={cn(s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200')}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsView() {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .catch(() => setError('Could not load your reviews.'))
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditSuccess(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateReview(editingReview.id, { rating: editRating, comment: editComment });
      setReviews((prev) =>
        prev.map((r) => r.id === editingReview.id ? { ...r, rating: editRating, comment: editComment } : r),
      );
      setEditSuccess(true);
      setTimeout(() => setEditingReview(null), 1400);
    } catch {
      setError('Could not update review.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    setIsDeleting(true);
    try {
      await deleteReview(deletingId);
      setReviews((prev) => prev.filter((r) => r.id !== deletingId));
      setDeletingId(null);
    } catch {
      setError('Could not delete review.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="Reviews"
        title="My Reviews"
        description="Feedback you've shared about your experiences."
        icon={Star}
        iconColor="text-amber-500"
        iconBg="bg-amber-50"
      />

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">{error}</div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Listing image */}
                <div className="relative w-full sm:w-44 h-36 sm:h-auto shrink-0 overflow-hidden">
                  <img
                    src={review.itemImage || FALLBACK_CARD}
                    alt={review.itemTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-slate-700 capitalize shadow-sm">
                      {review.itemModule}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-black text-slate-900 text-base leading-snug">{review.itemTitle}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <StarRating rating={review.rating} size={15} />
                        <span className="text-xs font-black text-slate-900">{review.rating}.0</span>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Calendar size={11} />
                          {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <MessageSquare size={12} className="text-slate-400" />
                      <span className="section-label">Your Feedback</span>
                    </div>
                    <p className="text-sm text-slate-700 italic leading-relaxed">"{review.comment}"</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={user?.avatar || FALLBACK_AVATAR}
                        alt={user?.name || 'You'}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full border border-slate-200 object-cover"
                      />
                      <span className="text-xs text-slate-500 font-medium">Posted by you</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(review)}
                        className="text-xs font-bold text-slate-400 hover:text-[var(--primary-color)] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingId(review.id)}
                        className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {reviews.length === 0 && (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Complete a booking to share your first review!"
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        />
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingReview && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              className="bg-white rounded-3xl p-7 w-full max-w-md shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Edit Review</h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[260px]">{editingReview.itemTitle}</p>
                </div>
                <button
                  onClick={() => setEditingReview(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {editSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={28} className="text-emerald-500" />
                  </div>
                  <p className="font-black text-slate-900">Review updated!</p>
                </div>
              ) : (
                <form onSubmit={handleEditSubmit} className="space-y-5">
                  <div>
                    <p className="section-label mb-3">Rating</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={editRating} onChange={setEditRating} size={28} />
                      <span className="text-sm font-black text-slate-900 ml-1">{editRating}.0</span>
                    </div>
                  </div>

                  <div>
                    <p className="section-label mb-2">Feedback</p>
                    <textarea
                      required
                      rows={4}
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] transition-all placeholder-slate-400 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-1">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingReview(null)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" isLoading={isSaving}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={deletingId !== null}
        title="Delete Review"
        description="Are you sure you want to permanently delete this review?"
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
