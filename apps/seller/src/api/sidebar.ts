import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const getSidebarCounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sidebar-counts`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch sidebar counts:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received. Request:', error.request);
    }
    return { data: {} };
  }
};
