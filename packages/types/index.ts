export type Vertical = 'real_estate' | 'automotive' | 'ecommerce' | 'services' | 'jobs' | 'events' | 'classifieds';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'partner' | 'user' | 'super-admin';
  avatar?: string;
}

export interface Application {
  id: number;
  app_key: string;
  vertical: Vertical;
  title: string;
  is_active: boolean;
  variables: Record<string, any>; // Visual styling (colors, fonts)
  config: Record<string, any>;    // Operational config (features enabled, etc.)
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: number;
  title: string;
  slug: string;
  description: string;
  price?: number;
  currency?: string;
  status: 'active' | 'pending' | 'sold' | 'rented';
  images: string[];
  user_id: number;
  type_id: number;
  category_id: number;
  location_id?: number;
  created_at: string;
}

export interface Property extends Listing {
  bedrooms: number;
  bathrooms: number;
  area: number;
  area_unit: string;
  property_type: string;
}

export interface Auto extends Listing {
  make: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  fuel_type: string;
}

export interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
}
