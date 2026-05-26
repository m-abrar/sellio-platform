import { API_BASE_URL } from "../config/api";

export const fetchItems = async (module: string) => {
  const response = await fetch(`${API_BASE_URL}/items?module=${module}`);
  if (!response.ok) throw new Error('Failed to fetch items');
  return response.json();
};

export const toggleFavorite = async (itemId: string) => {
  const response = await fetch(`${API_BASE_URL}/favorites/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId }),
  });
  if (!response.ok) throw new Error('Failed to toggle favorite');
  return response.json();
};

export const fetchFavorites = async () => {
  const response = await fetch(`${API_BASE_URL}/favorites`);
  if (!response.ok) throw new Error('Failed to fetch favorites');
  return response.json();
};
