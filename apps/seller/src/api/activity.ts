import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/activities`;

export const getActivities = async (module?: string, type?: string) => {
  try {
    const response = await axios.get(API_URL, { params: { module, type } });
    return response.data;
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data');
    return { data: { data: [] } };
  }
};

export const getActivityById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock data');
    return null;
  }
};
