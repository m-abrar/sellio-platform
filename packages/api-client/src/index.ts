import axios, { AxiosInstance } from 'axios';
import type {
  Product,
  Category,
  Theme,
  ThemeContentResponse,
  Testimonial,
  ApiResponse,
  Property,
  Location,
  Vehicle,
  JobListing,
  ServiceListing,
  EventListing,
  ClassifiedListing,
  Menu,
  MenuMap,
  MenuLocationKey,
  AuthSession,
  Cart,
  CheckoutContext,
  CheckoutPaymentResult,
  Order,
  PaymentGatewayOption,
  PropertyBookingBreakdown,
  PropertyBookingPaymentContext,
  PropertyBookingPaymentResult,
  PropertyBookingRecord,
  PropertyLeadRecord,
  AutoInquiryRecord,
  JobApplicationRecord,
  ServiceConsultationRecord,
  EventBookingPaymentContext,
  EventBookingPaymentResult,
  EventBookingRecord,
  EventTicketDataMap,
  User,
} from '@sellio/types';

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
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  setAuthToken(token: string | null): void {
    if (token) {
      this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
      return;
    }

    delete this.client.defaults.headers.common.Authorization;
  }

  private unwrap<T>(response: { data: ApiResponse<T> }): T {
    return response.data.data;
  }

  private async request<T>(url: string, options: Record<string, unknown> = {}): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, options);
    return this.unwrap(response);
  }

  private async post<T>(url: string, body?: Record<string, unknown>, options: Record<string, unknown> = {}): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, body, options);
    return this.unwrap(response);
  }

  private async patch<T>(url: string, body?: Record<string, unknown>): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, body);
    return this.unwrap(response);
  }

  private async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return this.unwrap(response);
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

  async getMenu(locationKey: MenuLocationKey | string, themeKey?: string): Promise<Menu> {
    const options = themeKey ? { headers: { 'X-Theme-Key': themeKey } } : {};
    return this.request<Menu>(`/v1/menus/${locationKey}`, options);
  }

  async getMenus(locations: MenuLocationKey[] | string[], themeKey?: string): Promise<MenuMap> {
    const options = {
      params: { locations: locations.join(',') },
      ...(themeKey ? { headers: { 'X-Theme-Key': themeKey } } : {}),
    };
    return this.request<MenuMap>('/v1/menus', options);
  }

  async getTestimonials(themeKey?: string, limit = 6): Promise<Testimonial[]> {
    const options = {
      params: { limit, ...(themeKey ? { theme_key: themeKey } : {}) },
      ...(themeKey ? { headers: { 'X-Theme-Key': themeKey } } : {}),
    };

    return this.request<Testimonial[]>('/v1/testimonials', options);
  }

  async getThemeContent(themeKey: string, page: string): Promise<ThemeContentResponse> {
    return this.request<ThemeContentResponse>('/v1/theme-content', {
      params: { theme_key: themeKey, page },
      headers: { 'X-Theme-Key': themeKey },
    });
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

  async createVehicleInquiry(
    autoId: number,
    payload: {
      full_name: string;
      email: string;
      phone?: string;
      message?: string;
      preferred_date?: string;
      preferred_time?: 'AM' | 'PM' | 'Anytime';
    },
  ): Promise<AutoInquiryRecord> {
    return this.post<AutoInquiryRecord>(`/v1/vehicles/${autoId}/inquiries`, payload);
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

  async createJobApplication(
    slug: string,
    payload: {
      cover_letter: string;
      portfolio_url?: string;
    },
  ): Promise<JobApplicationRecord> {
    return this.post<JobApplicationRecord>(`/v1/jobs/${slug}/applications`, payload);
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
      experience_levels: Record<number, string>;
    };
  }> {
    const response = await this.client.get('/v1/services', { params });
    return response.data;
  }

  async getServiceBySlug(slug: string): Promise<ServiceListing> {
    return this.request<ServiceListing>(`/v1/services/${slug}`);
  }

  async createServiceConsultation(
    serviceId: number,
    payload: {
      full_name: string;
      email: string;
      phone?: string;
      preferred_date?: string;
      requirements?: string;
      topic?: string;
    },
  ): Promise<ServiceConsultationRecord> {
    return this.post<ServiceConsultationRecord>(`/v1/services/${serviceId}/consultations`, payload);
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
    meta?: { ticket_data?: EventTicketDataMap };
  }> {
    const response = await this.client.get(`/v1/events/${slug}`);
    return response.data;
  }

  // === Classifieds Vertical Endpoints ===

  async getClassifieds(params?: Record<string, any>): Promise<{
    data: ClassifiedListing[];
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
    };
  }> {
    const response = await this.client.get('/v1/classifieds', { params });
    return response.data;
  }

  async getClassifiedBySlug(slug: string): Promise<ClassifiedListing> {
    return this.request<ClassifiedListing>(`/v1/classifieds/${slug}`);
  }

  async getClassifiedDetails(slug: string): Promise<{
    success: boolean;
    message: string | null;
    data: ClassifiedListing;
    related_classifieds?: ClassifiedListing[];
  }> {
    const response = await this.client.get(`/v1/classifieds/${slug}`);
    return response.data;
  }

  // === Auth ===

  async login(email: string, password: string): Promise<AuthSession> {
    return this.post<AuthSession>('/v1/auth/login', { email, password });
  }

  async register(name: string, email: string, password: string, password_confirmation: string): Promise<AuthSession> {
    return this.post<AuthSession>('/v1/auth/register', {
      name,
      email,
      password,
      password_confirmation,
      role: 'user',
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/v1/auth/me');
  }

  async logout(): Promise<null> {
    return this.post<null>('/v1/auth/logout');
  }

  // === Cart ===

  async getCart(): Promise<Cart> {
    return this.request<Cart>('/v1/cart');
  }

  async addToCart(productId: number, quantity = 1): Promise<Cart> {
    return this.post<Cart>(`/v1/cart/add/${productId}`, { quantity });
  }

  async updateCartItem(itemId: number, quantity: number): Promise<Cart> {
    return this.patch<Cart>(`/v1/cart/${itemId}`, { quantity });
  }

  async removeCartItem(itemId: number): Promise<Cart> {
    return this.delete<Cart>(`/v1/cart/${itemId}`);
  }

  // === Checkout ===

  async getPaymentGateways(): Promise<PaymentGatewayOption[]> {
    return this.request<PaymentGatewayOption[]>('/v1/payment-gateways');
  }

  async getCheckoutContext(): Promise<CheckoutContext> {
    return this.request<CheckoutContext>('/v1/checkout/context');
  }

  async processCheckout(
    gateway: string,
    payload: {
      shipping_name: string;
      shipping_address: string;
      shipping_city: string;
      shipping_state?: string;
      shipping_zip: string;
      shipping_country: string;
      payment_method: string;
      payment_token?: string;
      return_url?: string;
    },
  ): Promise<CheckoutPaymentResult> {
    return this.post<CheckoutPaymentResult>(`/v1/checkout/process/${gateway}`, payload);
  }

  async confirmCheckoutPayment(
    gateway: string,
    orderId: number,
    paymentIntent: string,
  ): Promise<CheckoutPaymentResult> {
    return this.post<CheckoutPaymentResult>(`/v1/checkout/confirm/${gateway}/${orderId}`, {
      payment_intent: paymentIntent,
    });
  }

  async getOrder(orderNumber: string): Promise<Order> {
    return this.request<Order>(`/v1/orders/${orderNumber}`);
  }

  // === Property bookings & inquiries ===

  async previewPropertyBooking(
    propertyId: number,
    payload: { check_in: string; check_out: string; guests: number },
  ): Promise<PropertyBookingBreakdown> {
    return this.post<PropertyBookingBreakdown>(`/v1/properties/${propertyId}/booking-preview`, payload);
  }

  async createPropertyBooking(
    propertyId: number,
    payload: {
      check_in: string;
      check_out: string;
      guests: number;
      full_name: string;
      email: string;
      phone?: string;
      message?: string;
    },
  ): Promise<PropertyBookingRecord> {
    return this.post<PropertyBookingRecord>(`/v1/properties/${propertyId}/bookings`, payload);
  }

  async getPropertyBooking(bookingId: number): Promise<PropertyBookingRecord> {
    return this.request<PropertyBookingRecord>(`/v1/property-bookings/${bookingId}`);
  }

  async getPropertyBookingPaymentContext(bookingId: number): Promise<PropertyBookingPaymentContext> {
    return this.request<PropertyBookingPaymentContext>(`/v1/property-bookings/${bookingId}/payment-context`);
  }

  async payPropertyBooking(
    bookingId: number,
    gateway: string,
    payload: {
      payment_method: string;
      payment_token?: string;
      return_url?: string;
    },
  ): Promise<PropertyBookingPaymentResult> {
    return this.post<PropertyBookingPaymentResult>(`/v1/property-bookings/${bookingId}/pay/${gateway}`, payload);
  }

  async confirmPropertyBookingPayment(
    bookingId: number,
    gateway: string,
    paymentIntent: string,
  ): Promise<PropertyBookingPaymentResult> {
    return this.post<PropertyBookingPaymentResult>(`/v1/property-bookings/${bookingId}/confirm/${gateway}`, {
      payment_intent: paymentIntent,
    });
  }

  async createPropertyInquiry(
    propertyId: number,
    payload: {
      full_name: string;
      email: string;
      phone?: string;
      message?: string;
      check_in?: string;
      check_out?: string;
    },
  ): Promise<PropertyLeadRecord> {
    return this.post<PropertyLeadRecord>(`/v1/properties/${propertyId}/inquiries`, payload);
  }

  async createEventBooking(
    eventId: number,
    payload: {
      event_occurrence_id: number;
      event_ticket_type_id: number;
      quantity: number;
      name?: string;
      email?: string;
      phone?: string;
    },
  ): Promise<EventBookingRecord> {
    return this.post<EventBookingRecord>(`/v1/events/${eventId}/bookings`, payload);
  }

  async getEventBooking(bookingId: number): Promise<EventBookingRecord> {
    return this.request<EventBookingRecord>(`/v1/event-bookings/${bookingId}`);
  }

  async getEventBookingPaymentContext(bookingId: number): Promise<EventBookingPaymentContext> {
    return this.request<EventBookingPaymentContext>(`/v1/event-bookings/${bookingId}/payment-context`);
  }

  async payEventBooking(
    bookingId: number,
    gateway: string,
    payload: {
      payment_method: string;
      payment_token?: string;
      return_url?: string;
    },
  ): Promise<EventBookingPaymentResult> {
    return this.post<EventBookingPaymentResult>(`/v1/event-bookings/${bookingId}/pay/${gateway}`, payload);
  }

  async confirmEventBookingPayment(
    bookingId: number,
    gateway: string,
    paymentIntent: string,
  ): Promise<EventBookingPaymentResult> {
    return this.post<EventBookingPaymentResult>(`/v1/event-bookings/${bookingId}/confirm/${gateway}`, {
      payment_intent: paymentIntent,
    });
  }
}

export const api = new SellioAPI();
