import axios, { AxiosInstance } from 'axios';
import { Product, Category, Theme } from '@sellio/types';

export class SellioAPI {
  private client: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  async getProducts(): Promise<Product[]> {
    const response = await this.client.get('/products');
    return response.data;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.client.get('/categories');
    return response.data;
  }

  async getThemes(): Promise<Theme[]> {
    const response = await this.client.get('/themes');
    return response.data;
  }

  async getTheme(key: string): Promise<Theme> {
    const response = await this.client.get(`/themes/${key}`);
    return response.data;
  }
}

export const api = new SellioAPI();
