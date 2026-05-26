import { toReview } from './adapters';
import { apiRequest, buyerUrl, collectionData } from './apiClient';

export const fetchReviews = async () => {
  const payload = await apiRequest<any>(buyerUrl('/reviews'), { authenticated: true });
  return collectionData(payload).map(toReview);
};

export const createReview = async (data: {
  item_id: string;
  booking_id?: number;
  rating: number;
  comment: string;
}) => {
  throw new Error('Review creation must be submitted from an eligible Laravel booking context.');
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
