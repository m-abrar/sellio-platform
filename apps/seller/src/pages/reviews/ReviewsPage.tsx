import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineStar, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { getReviews, replyToReview } from '../../api/reviews';
import { toast } from 'sonner';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const fetchReviews = async () => {
    try {
      const response = await getReviews();
      setReviews(response.data.data);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReply = async (reviewId: number) => {
    const reply = replyDrafts[reviewId]?.trim();
    if (!reply) {
      toast.error('Please enter a reply.');
      return;
    }

    setSubmittingId(reviewId);
    try {
      const response = await replyToReview(reviewId, reply);
      setReviews((prev) => prev.map((review) => (review.id === reviewId ? response.data : review)));
      setReplyDrafts((prev) => ({ ...prev, [reviewId]: '' }));
      toast.success(response.message || 'Reply posted.');
    } catch (error) {
      console.error('Failed to reply to review', error);
      toast.error('Failed to post reply.');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Reputation" title="Asset" subtitle="Reviews" />

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Feedback...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No reviews yet</span>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium group hover:border-[#6610f2]/20 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-[#6610f2] border border-slate-100">
                    {review.customer.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 italic tracking-tight">{review.customer}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      Reviewed: <span className="text-[#6610f2]">{review.asset}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <HiOutlineStar key={index} className={`w-5 h-5 ${index < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed italic">"{review.comment}"</p>

              {review.partnerReply && (
                <div className="mt-6 p-6 bg-purple-50 rounded-2xl border border-purple-100">
                  <p className="text-[10px] font-black text-[#6610f2] uppercase tracking-widest mb-2">Your Reply</p>
                  <p className="text-sm text-slate-700 font-medium">{review.partnerReply}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{review.date}</span>
                  <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-[#6610f2]" />
                </div>
                <textarea
                  value={replyDrafts[review.id] ?? ''}
                  onChange={(event) => setReplyDrafts((prev) => ({ ...prev, [review.id]: event.target.value }))}
                  placeholder="Write a public reply..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20"
                />
                <button
                  onClick={() => handleReply(review.id)}
                  disabled={submittingId === review.id}
                  className="flex items-center gap-2 text-[10px] font-black text-[#6610f2] uppercase tracking-widest hover:translate-x-1 transition-transform disabled:opacity-50"
                >
                  {submittingId === review.id ? 'Posting...' : 'Reply to Review'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
