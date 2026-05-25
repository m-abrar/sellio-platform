import { apiClient, extractListData, unwrapData } from '../lib/apiClient';
import { normalizeReview } from '../lib/reviewAdapter';

export const getReviews = async () => {
  const response = await apiClient.get('/dashboard/partner/reviews/');
  const records = extractListData<Record<string, unknown>>(response);

  return {
    data: {
      data: records.map(normalizeReview),
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
