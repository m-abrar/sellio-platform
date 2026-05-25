import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/wallet`;

export const getWallet = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch wallet', error);
    throw error;
  }
};

export const withdrawFunds = async (amount: number, method: string) => {
  try {
    const response = await axios.post(`${API_URL}/withdraw`, { amount, method });
    return response.data;
  } catch (error) {
    console.error('Withdrawal failed', error);
    throw error;
  }
};
