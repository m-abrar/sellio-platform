import axios, { AxiosInstance } from 'axios';
import type { Product, Category, Theme, ApiResponse } from '@sellio/types';

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

  private async request<T>(url: string, options: any = {}): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, options);
    return response.data.data;
  }

  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/v1/products');
  }

  async getProductBySlug(slug: string): Promise<Product> {
    return this.request<Product>(`/v1/products/${slug}`);
  }

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/v1/categories');
  }

  async getThemes(): Promise<Theme[]> {
    return this.request<Theme[]>('/themes');
  }

  async getActiveTheme(key?: string): Promise<Theme> {
    const options = key ? { headers: { 'X-Theme-Key': key } } : {};
    return this.request<Theme>('/themes/active', options);
  }
}

export const api = new SellioAPI();
