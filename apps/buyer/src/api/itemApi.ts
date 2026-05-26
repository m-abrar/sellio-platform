import { toFavoriteItem } from './adapters';
import { apiRequest, buyerUrl, collectionData } from './apiClient';

export const toggleFavorite = async (itemId: string) => {
  await apiRequest(buyerUrl(`/favorites/${itemId}`), {
    method: 'DELETE',
    authenticated: true,
  });
  return { status: 'removed' };
};

export const fetchFavorites = async () => {
  const payload = await apiRequest<any>(buyerUrl('/favorites'), { authenticated: true });
  return collectionData(payload).map(toFavoriteItem);
};
