import { toReview } from './adapters';
import { apiRequest, buyerUrl, collectionData } from './apiClient';

export const fetchReviews = async () => {
  const payload = await apiRequest<any>(buyerUrl('/reviews'), { authenticated: true });
  return collectionData(payload).map(toReview);
};

export const createReview = async (data: {
  rating: number;
  comment: string;
  reviewable_id: number | string;
  reviewable_type: string;
}) => {
  const payload = await apiRequest<any>(buyerUrl('/reviews'), {
    method: 'POST',
    authenticated: true,
    body: JSON.stringify(data),
  });
  return toReview(payload?.review || payload);
};

export const updateReview = async (
  id: number,
  data: { rating: number; comment: string },
) => {
  await apiRequest(buyerUrl(`/reviews/${id}`), {
    method: 'PUT',
    authenticated: true,
    body: JSON.stringify(data),
  });
  return { id, ...data };
};

export const deleteReview = async (id: number) => {
  await apiRequest(buyerUrl(`/reviews/${id}`), {
    method: 'DELETE',
    authenticated: true,
  });
};
