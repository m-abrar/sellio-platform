import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Star, MessageSquare, Calendar, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { deleteReview, fetchReviews, updateReview } from '../api/reviewApi';
import { useUser } from '../context/UserContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { API_BASE_URL } from '../config/api';

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

const FALLBACK_CARD_IMAGE = `${API_ORIGIN}/images/fallbacks/default-card.jpg`;
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

export default function ReviewsView() {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateReview(editingReview.id, { rating: editRating, comment: editComment });
      setReviews(current =>
        current.map(item =>
          item.id === editingReview.id
            ? { ...item, rating: editRating, comment: editComment }
            : item
        )
      );
      setEditingReview(null);
    } catch {
      setError('Review could not be updated.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteReview(deletingId);
      setReviews(current => current.filter(review => review.id !== deletingId));
      setDeletingId(null);
    } catch {
      setError('Review could not be deleted.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Reviews"
        title="Reviews I've Written"
        description="View and manage the feedback you've shared about your experiences."
      />

      {error && (
        <div className="mx-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 px-3">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-surface p-6 lg:p-8"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-shrink-0 w-full lg:w-48 h-48 lg:h-auto relative rounded-2xl overflow-hidden group">
                <img
                  src={review.itemImage || FALLBACK_CARD_IMAGE}
                  alt={review.itemTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="default" className="bg-white/90 backdrop-blur-md text-zinc-900 capitalize">
                    {review.itemModule}
                  </Badge>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-1">{review.itemTitle}</h3>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <Calendar size={12} />
                      Reviewed on {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className={cn(idx < review.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200')}
                      />
                    ))}
                    <span className="ml-2 text-sm font-bold text-zinc-900">{review.rating}.0</span>
                  </div>
                </div>

                <div className="bg-zinc-50/50 border border-zinc-100 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={14} className="text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">My Feedback</span>
                  </div>
                  <p className="text-sm text-zinc-700 italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.avatar || FALLBACK_AVATAR}
                      alt={user?.name || 'You'}
                      className="w-6 h-6 rounded-full border border-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-medium text-zinc-500">Posted by you</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors"
                      onClick={() => openEditModal(review)}
                    >
                      Edit Review
                    </button>
                    <button
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                      onClick={() => setDeletingId(review.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {reviews.length === 0 && (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="You haven't shared any feedback yet. Complete a booking to leave your first review!"
        />
      )}

      {/* Edit Review Modal */}
      <AnimatePresence>
        {editingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative border border-zinc-100"
            >
              <button
                onClick={() => setEditingReview(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-bold text-zinc-900 mb-1">Edit Review</h3>
              <p className="text-xs text-zinc-500 mb-6">
                Updating your feedback for: <strong>{editingReview.itemTitle}</strong>
              </p>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={28}
                          className={cn(
                            star <= editRating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'
                          )}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm font-extrabold text-zinc-900">{editRating}.0 / 5.0</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Comment / Feedback
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    placeholder="Write your experience here..."
                    className="w-full bg-zinc-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-zinc-950 transition-all placeholder-zinc-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingReview(null)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={deletingId !== null}
        title="Delete Review"
        description="Are you sure you want to permanently delete this review? This cannot be undone."
        confirmLabel="Delete Review"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
