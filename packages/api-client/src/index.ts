import axios, { AxiosInstance } from 'axios';
import type { Product, Category, Theme, ApiResponse, Property, Location, Vehicle, JobListing, ServiceListing, EventListing } from '@sellio/types';

export class SellioAPI {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    let resolvedURL = baseURL || process.env.NEXT_PUBLIC_API_URL;
    
    if (!resolvedURL) {
      if (typeof window !== 'undefined') {
        // In the browser, dynamically match localhost/127.0.0.1 to avoid CORS or origin confusion
        let host = window.location.hostname;
        if (host === 'localhost') {
          host = '127.0.0.1';
        }
        resolvedURL = `http://${host}:8000/api`;
      } else {
        // On the server side, default to 127.0.0.1
        resolvedURL = 'http://127.0.0.1:8000/api';
      }
    }

    this.client = axios.create({
      baseURL: resolvedURL,
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

  // === Property Vertical Endpoints ===

  async getProperties(params?: Record<string, any>): Promise<{
    data: Property[];
    meta?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    sidebar?: {
      categories: Category[];
      locations: Location[];
      amenities: Record<number, string>;
      features: Record<number, string>;
      tags: any[];
      max_allowed_price: number;
      number_of_nights: number | null;
    };
  }> {
    const response = await this.client.get('/v1/properties', { params });
    return response.data;
  }

  async getPropertyBySlug(slug: string): Promise<Property> {
    return this.request<Property>(`/v1/properties/${slug}`);
  }

  async getPropertyDetails(slug: string): Promise<{
    success: boolean;
    message: string | null;
    data: Property;
    related_properties?: Property[];
    bookings?: any[];
  }> {
    const response = await this.client.get(`/v1/properties/${slug}`);
    return response.data;
  }

  async calculateLodgingPrice(propertyId: number, checkIn: string, checkOut: string): Promise<{
    total_nights: number;
    estimated_lodging_total: string;
  }> {
    const response = await this.client.post(`/v1/properties/${propertyId}/calculate-lodging-price`, {
      check_in: checkIn,
      check_out: checkOut,
    });
    return response.data.data;
  }

  // === Vehicle Vertical Endpoints ===

  async getVehicles(params?: Record<string, any>): Promise<{
    data: Vehicle[];
    meta?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    sidebar?: {
      categories: Category[];
      locations: Location[];
      types: any[];
      tags: any[];
      brands: any[];
      transaction_types: any[];
      transmission_options: string[];
    };
  }> {
    const response = await this.client.get('/v1/vehicles', { params });
    return response.data;
  }

  async getVehicleBySlug(slug: string): Promise<Vehicle> {
    return this.request<Vehicle>(`/v1/vehicles/${slug}`);
  }

  async getVehicleDetails(slug: string): Promise<{
    success: boolean;
    message: string | null;
    data: Vehicle;
    related_vehicles?: Vehicle[];
  }> {
    const response = await this.client.get(`/v1/vehicles/${slug}`);
    return response.data;
  }

  // === Job Vertical Endpoints ===

  async getJobs(params?: Record<string, any>): Promise<{
    data: JobListing[];
    meta?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    sidebar?: {
      categories: Category[];
      locations: Location[];
      types: any[];
      tags: any[];
      experience_levels: string[];
      workplace_types: string[];
    };
  }> {
    const response = await this.client.get('/v1/jobs', { params });
    return response.data;
  }

  async getJobBySlug(slug: string): Promise<JobListing> {
    return this.request<JobListing>(`/v1/jobs/${slug}`);
  }

  async getJobDetails(slug: string): Promise<{
    success: boolean;
    message: string | null;
    data: JobListing;
    related_jobs?: JobListing[];
  }> {
    const response = await this.client.get(`/v1/jobs/${slug}`);
    return response.data;
  }

  // === Service Vertical Endpoints ===

  async getServices(params?: Record<string, any>): Promise<{
    data: ServiceListing[];
    meta?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    sidebar?: {
      categories: Category[];
      locations: Location[];
      types: any[];
      tags: any[];
      expertise_levels: Record<number, string>;
    };
  }> {
    const response = await this.client.get('/v1/services', { params });
    return response.data;
  }

  async getServiceBySlug(slug: string): Promise<ServiceListing> {
    return this.request<ServiceListing>(`/v1/services/${slug}`);
  }

  // === Event Vertical Endpoints ===

  async getEvents(params?: Record<string, any>): Promise<{
    data: EventListing[];
    meta?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    sidebar?: {
      categories: Category[];
      locations: Location[];
      types: any[];
      tags: any[];
      event_genres?: string[];
    };
  }> {
    const response = await this.client.get('/v1/events', { params });
    return response.data;
  }

  async getEventBySlug(slug: string): Promise<EventListing> {
    return this.request<EventListing>(`/v1/events/${slug}`);
  }

  async getEventDetails(slug: string): Promise<{
    success: boolean;
    message: string | null;
    data: EventListing;
    related_events?: EventListing[];
  }> {
    const response = await this.client.get(`/v1/events/${slug}`);
    return response.data;
  }
}


export const api = new SellioAPI();
