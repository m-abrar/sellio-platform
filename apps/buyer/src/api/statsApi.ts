import { API_BASE_URL } from "../config/api";

export const fetchUserStats = async () => {
  const response = await fetch(`${API_BASE_URL}/user/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};
