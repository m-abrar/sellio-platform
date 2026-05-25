import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/categories`;

const mockCategories = [
  { id: 1, title: 'Furniture' },
  { id: 2, title: 'Electronics' },
  { id: 3, title: 'Apparel' },
  { id: 4, title: 'Home Decor' }
];

export const getCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock categories');
    return mockCategories;
  }
};
