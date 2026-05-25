import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineStar, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { getReviews } from '../../api/reviews';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviews();
        setReviews(response.data.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Reputation" title="Asset" subtitle="Reviews" />
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Feedback...</span>
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
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Reviewed: <span className="text-[#6610f2]">{review.asset}</span></p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <HiOutlineStar key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed italic">"{review.comment}"</p>
              <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{review.date}</span>
                <button className="flex items-center gap-2 text-[10px] font-black text-[#6610f2] uppercase tracking-widest hover:translate-x-1 transition-transform">
                  <HiOutlineChatBubbleLeftRight className="w-4 h-4" /> Reply to Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
