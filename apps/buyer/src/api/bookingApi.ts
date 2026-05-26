import { API_BASE_URL } from "../config/api";

export const fetchBookings = async (type: string = 'booking') => {
  const response = await fetch(`${API_BASE_URL}/bookings?type=${type}`);
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return response.json();
};
