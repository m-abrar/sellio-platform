import { apiClient, extractListData, unwrapData } from '../lib/apiClient';
import { normalizeReview } from '../lib/reviewAdapter';

export const getReviews = async (page = 1) => {
  const response = await apiClient.get('/dashboard/partner/reviews/', {
    params: { page },
  });
  
  const payload = unwrapData<any>(response);
  const rawRecords = Array.isArray(payload) ? payload : (payload?.data ?? []);
  const meta = response.data.meta ?? null;

  return {
    data: {
      data: rawRecords.map(normalizeReview),
      meta: meta ? {
        currentPage: Number(meta.current_page ?? 1),
        lastPage: Number(meta.last_page ?? 1),
        total: Number(meta.total ?? 0),
        perPage: Number(meta.per_page ?? 10),
      } : null,
    },
  };
};

export const replyToReview = async (reviewId: number, reply: string) => {
  const response = await apiClient.post(`/dashboard/partner/reviews/${reviewId}/reply`, { reply });

  return {
    data: normalizeReview(unwrapData<Record<string, unknown>>(response)),
    message: response.data.message,
  };
};

export const toggleFeaturedReview = async (reviewId: number) => {
  const response = await apiClient.post(`/dashboard/partner/reviews/${reviewId}/toggle-featured`);

  return {
    data: normalizeReview(unwrapData<Record<string, unknown>>(response)),
    message: response.data.message,
  };
};
