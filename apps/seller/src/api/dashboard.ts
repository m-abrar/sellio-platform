import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/dashboard`;

export const getDashboardData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data');
    return { 
      data: { 
        stats: { activeInventory: 0, urgentAlerts: 0, marketViews: 0, totalRevenue: 0 },
        recentListings: [] 
      } 
    };
  }
};
