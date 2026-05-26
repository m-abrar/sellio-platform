import { API_BASE_URL } from "../config/api";

export const fetchReviews = async () => {
  const response = await fetch(`${API_BASE_URL}/reviews`);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
};
