import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineStar, HiStar, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { getReviews, replyToReview, toggleFeaturedReview } from '../../api/reviews';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../lib/apiErrorMessage';

interface VerticalMetadata {
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
}

const VERTICALS: Record<string, VerticalMetadata> = {
  All: { label: 'All Categories', shortLabel: 'All', icon: '⚡', color: '#6610f2', bg: 'bg-purple-50/50', border: 'border-purple-100' },
  Property: { label: 'Real Estate', shortLabel: 'Property', icon: '🏠', color: '#3b82f6', bg: 'bg-blue-50/50', border: 'border-blue-100' },
  Auto: { label: 'Automotive', shortLabel: 'Auto', icon: '🚗', color: '#f59e0b', bg: 'bg-amber-50/50', border: 'border-amber-100' },
  Product: { label: 'Market Products', shortLabel: 'Product', icon: '📦', color: '#f43f5e', bg: 'bg-rose-50/50', border: 'border-rose-100' },
  Event: { label: 'Event Bookings', shortLabel: 'Event', icon: '🎟️', color: '#10b981', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
  Service: { label: 'Client Services', shortLabel: 'Service', icon: '💼', color: '#06b6d4', bg: 'bg-cyan-50/50', border: 'border-cyan-100' },
  Job: { label: 'Job Openings', shortLabel: 'Job', icon: '🤝', color: '#6366f1', bg: 'bg-indigo-50/50', border: 'border-indigo-100' },
  Classified: { label: 'Classified Ads', shortLabel: 'Classified', icon: '🏷️', color: '#64748b', bg: 'bg-slate-50/50', border: 'border-slate-100' },
};

export default function ReviewsPage() {
  const [selectedVertical, setSelectedVertical] = useState<string>('All');
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{ currentPage: number; lastPage: number; total: number; perPage: number } | null>(null);

  const fetchReviews = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getReviews(page);
      setReviews(response.data.data);
      setPagination(response.data.meta);
      setCurrentPage(page);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to load reviews.'));
      console.error('Failed to fetch reviews', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
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

  const handleToggleFeatured = async (reviewId: number) => {
    try {
      const response = await toggleFeaturedReview(reviewId);
      setReviews((prev) => prev.map((review) => (review.id === reviewId ? response.data : review)));
      toast.success(
        response.data.isFeatured
          ? 'Featured review as testimonial!'
          : 'Removed review from featured testimonials.'
      );
    } catch (error) {
      console.error('Failed to toggle featured status', error);
      toast.error('Failed to update testimonial status.');
    }
  };

  // 1. Calculate live dynamic rating spread distributions
  const ratingSpread = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    let total = 0;

    const list = reviews.filter((r) => {
      if (selectedVertical === 'All') return true;
      const matchType = selectedVertical === 'Job' ? 'JobListing' : selectedVertical;
      return r.type === matchType;
    });

    list.forEach((r) => {
      const star = Math.max(1, Math.min(5, r.rating));
      counts[5 - star]++;
      total++;
    });

    const average = total > 0 ? (list.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : '0.0';

    return {
      counts,
      total,
      average,
    };
  }, [reviews, selectedVertical]);

  // 2. Filter reviews list dynamically based on category
  const filteredReviews = useMemo(() => {
    if (selectedVertical === 'All') return reviews;
    const matchType = selectedVertical === 'Job' ? 'JobListing' : selectedVertical;
    return reviews.filter((r) => r.type === matchType);
  }, [reviews, selectedVertical]);

  const activeMeta = VERTICALS[selectedVertical] ?? VERTICALS.All;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Feedback...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header with Reputation Brand */}
      <PageHeader badge="Reviews" title="Customer" subtitle="Reviews" />

      {/* Category Grid Slicer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5 w-full bg-slate-50/50 p-3 rounded-[2.5rem] border border-slate-100/75 shadow-xs">
        {Object.keys(VERTICALS).map((key) => {
          const meta = VERTICALS[key];
          const isActive = selectedVertical === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedVertical(key)}
              className={`px-3 py-4 sm:px-5 sm:py-4.5 rounded-[1.5rem] sm:rounded-[1.8rem] text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 border shadow-sm cursor-pointer ${
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.03] translate-y-[-1px]'
                  : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-900 hover:scale-[1.01]'
              }`}
            >
              <span className="text-xs sm:text-sm leading-none">{meta.icon}</span>
              <span className="leading-none text-center">{meta.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Rating Distribution HUD Panel */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-stretch gap-10 md:gap-14">
        {/* Left Side: Score Index */}
        <div className="flex flex-col justify-center items-center text-center md:border-r border-slate-100 pr-0 md:pr-14 shrink-0">
          <h2 className="text-6xl md:text-7xl font-black italic tracking-tighter text-slate-900 leading-none">
            {ratingSpread.average}
          </h2>
          <div className="flex gap-1.5 my-4">
            {[...Array(5)].map((_, i) => {
              const fullStars = Math.floor(Number(ratingSpread.average));
              return (
                <HiStar
                  key={i}
                  className={`w-5 h-5 ${i < fullStars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                />
              );
            })}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Out of {ratingSpread.total} ratings
          </p>
        </div>

        {/* Right Side: Progress Bars */}
        <div className="flex-1 space-y-4">
          {ratingSpread.counts.map((count, idx) => {
            const stars = 5 - idx;
            const percentage = ratingSpread.total > 0 ? (count / ratingSpread.total) * 100 : 0;
            return (
              <div key={idx} className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <span className="w-12 shrink-0 text-right uppercase text-[9px] font-black tracking-widest">{stars} Star</span>
                <div className="flex-1 h-3 bg-slate-50 rounded-full border border-slate-100/50 overflow-hidden relative shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: activeMeta.color,
                    }}
                  />
                </div>
                <span className="w-10 shrink-0 text-[10px] font-black text-slate-700 tracking-tighter">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overhauled Polymorphic Testimonial Cards */}
      <div className="space-y-8">
        {filteredReviews.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-20 text-center shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
              No reviews available in this category
            </span>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const reviewMeta = VERTICALS[review.type === 'JobListing' ? 'Job' : review.type] ?? VERTICALS.All;
            return (
              <div
                key={review.id}
                className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] group hover:border-slate-200/80 transition-all duration-300 relative overflow-hidden"
              >
                {/* Active Testimonial Corner Glow Indicator */}
                {review.isFeatured && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl" />
                )}

                {/* Top Card Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-slate-50 pb-6">
                  {/* Left: Customer Info */}
                  <div className="flex items-center gap-5">
                    {review.avatar_url ? (
                      <img
                        src={review.avatar_url}
                        className="w-14 h-14 rounded-[1.2rem] object-cover border border-slate-100 shadow-sm shrink-0"
                        alt="avatar"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-[1.2rem] bg-slate-50 flex items-center justify-center font-black text-slate-900 border border-slate-100 shrink-0 text-xl italic shadow-inner">
                        {review.customer.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xl font-black text-slate-900 italic tracking-tight leading-none group-hover:text-slate-950">
                        {review.customer}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2.5 mt-2.5 leading-none">
                        <span className={`text-[9px] font-black border px-3 py-1 rounded-full uppercase tracking-wider ${reviewMeta.bg} ${reviewMeta.border}`} style={{ color: reviewMeta.color }}>
                          {reviewMeta.icon} {review.type === 'JobListing' ? 'Job' : review.type}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          On: 
                          {review.asset_image ? (
                            <img src={review.asset_image} className="w-8 h-6 object-cover rounded-md border border-slate-100/50 shadow-xs shrink-0" alt="" />
                          ) : (
                            <span className="text-xs leading-none shrink-0">{reviewMeta.icon}</span>
                          )}
                          <span className="text-slate-600 font-medium normal-case">{review.asset}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Star Ratings and Feature Testimonial Toggler */}
                  <div className="flex items-center gap-5 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50">
                    <div className="flex gap-1 shrink-0">
                      {[...Array(5)].map((_, index) => (
                        <HiStar
                          key={index}
                          className={`w-5 h-5 ${index < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>

                    {/* Testimonial Star Toggle Button */}
                    <button
                      onClick={() => handleToggleFeatured(review.id)}
                      className={`flex items-center gap-2 border px-5 py-3 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xs transition-all duration-300 group cursor-pointer ${
                        review.isFeatured
                          ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-md shadow-amber-200/50 scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <HiStar className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${review.isFeatured ? 'fill-slate-950 text-slate-950 animate-pulse' : ''}`} />
                      <span>{review.isFeatured ? 'Featured' : 'Feature'}</span>
                    </button>
                  </div>
                </div>

                {/* Comment Body */}
                <div className="space-y-6">
                  <p className="text-slate-600 font-medium leading-relaxed italic text-md bg-slate-50/30 p-6 rounded-2xl border border-slate-100/50">
                    "{review.comment}"
                  </p>

                  {/* Existent Partner Reply Card */}
                  {review.partnerReply && (
                    <div className="p-6 bg-slate-950 text-white rounded-[1.8rem] shadow-xl shadow-slate-900/5 relative overflow-hidden group/reply transition-all duration-300">
                      <div className="relative z-10 flex flex-col gap-2 min-w-0">
                        <div className="flex items-baseline gap-2 min-w-0">
                          <p className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1 leading-none shrink-0">Partner Response</p>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6610f2] shrink-0" />
                        </div>
                        <p className="text-xs text-slate-200 font-medium leading-relaxed italic">
                          "{review.partnerReply}"
                        </p>
                      </div>
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#6610f2]/10 rounded-full blur-2xl group-hover/reply:bg-[#6610f2]/20 transition-all duration-500" />
                    </div>
                  )}

                  {/* Quick Response Control */}
                  <div className="pt-6 border-t border-slate-50 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#6610f2] bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100/50 flex items-center gap-1.5 shrink-0">
                        <HiOutlineChatBubbleLeftRight className="w-3.5 h-3.5" /> Quick Reply
                      </span>
                    </div>
                    <textarea
                      value={replyDrafts[review.id] ?? ''}
                      onChange={(event) => setReplyDrafts((prev) => ({ ...prev, [review.id]: event.target.value }))}
                      placeholder={review.partnerReply ? "Modify your public response..." : "Compose a professional response..."}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20 shadow-inner"
                    />
                    <button
                      onClick={() => handleReply(review.id)}
                      disabled={submittingId === review.id}
                      className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white hover:shadow-lg hover:shadow-slate-100/50 py-4 px-8 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 cursor-pointer active:scale-95 shrink-0"
                    >
                      {submittingId === review.id ? 'Submitting Response...' : (review.partnerReply ? 'Update Reply' : 'Post Reply')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Sleek Glassmorphic Pagination Controls */}
      {pagination && pagination.lastPage > 1 && (
        <div className="flex justify-between items-center bg-white border border-slate-100 p-5 rounded-[1.8rem] shadow-[0_20px_50px_rgba(0,0,0,0.015)] select-none">
          <button
            onClick={() => fetchReviews(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-6 py-3 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            Previous
          </button>
          
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Page <span className="text-slate-900 font-black">{currentPage}</span> of <span className="text-slate-900 font-black">{pagination.lastPage}</span>
          </span>

          <button
            onClick={() => fetchReviews(currentPage + 1)}
            disabled={currentPage === pagination.lastPage || isLoading}
            className="px-6 py-3 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
