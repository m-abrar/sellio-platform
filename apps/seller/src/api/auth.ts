import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = API_BASE_URL;

export const login = async (credentials: any) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.warn('Backend not reachable, falling back to mock login');
    // Mocking login for now since we don't have a real backend yet
    if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      const mockToken = 'mock-jwt-token';
      localStorage.setItem('token', mockToken);
      return { data: { token: mockToken, user: { name: 'Admin User', email: credentials.email } } };
    }
    throw new Error('Invalid credentials');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};
