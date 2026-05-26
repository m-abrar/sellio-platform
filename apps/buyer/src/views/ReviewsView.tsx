import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star, MessageSquare, ThumbsUp, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { deleteReview, fetchReviews, updateReview } from '../api/reviewApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = async (review: Review) => {
    const comment = window.prompt('Update your feedback:', review.comment);
    if (comment === null) return;

    const ratingInput = window.prompt('Rating from 1 to 5:', String(review.rating));
    if (ratingInput === null) return;

    const rating = Math.min(5, Math.max(1, Number(ratingInput) || review.rating));
    setError(null);

    try {
      const updated = await updateReview(review.id, { rating, comment });
      setReviews((current) =>
        current.map((item) => (item.id === review.id ? { ...item, ...updated } : item)),
      );
    } catch {
      setError('Review could not be updated.');
    }
  };

  const handleDelete = async (reviewId: number) => {
    setError(null);

    try {
      await deleteReview(reviewId);
      setReviews((current) => current.filter((review) => review.id !== reviewId));
    } catch {
      setError('Review could not be deleted.');
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
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={cn(
                          i < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-200"
                        )}
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
                      src={review.userAvatar || FALLBACK_AVATAR} 
                      alt={review.userName} 
                      className="w-6 h-6 rounded-full border border-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-medium text-zinc-500">Posted by you</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors"
                      onClick={() => handleEdit(review)}
                    >
                      Edit Review
                    </button>
                    <button
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                      onClick={() => handleDelete(review.id)}
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
    </div>
  );
}
