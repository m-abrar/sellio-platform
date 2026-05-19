export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AppSettings {
  site_name: string;
  site_logo: string;
  hide_site_name: string;
}

export interface Theme {
  id: number;
  theme_key: string;
  vertical?: string | null;
  title: string;
  is_active: boolean;
  variables?: Record<string, string>;
  config?: Record<string, any> | null;
  app_settings?: AppSettings;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: number;
  media?: {
    featured_image?: string | null;
    video_url?: string | null;
  } | null;
  pricing?: {
    base_price: number;
    sale_price: number;
    current_price: number;
    formatted: string;
    currency_symbol: string;
  } | null;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'customer';
}
