export type Vertical = 'real_estate' | 'automotive' | 'ecommerce' | 'services' | 'jobs' | 'events' | 'classifieds';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'partner' | 'user' | 'super-admin';
  avatar?: string;
  phone?: string;
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

export interface Media {
  id: number;
  url: string;
  thumbnail?: string;
  hero?: string;
  name?: string;
  order?: number;
}

export interface Taxonomy {
  id: number;
  title: string;
  slug?: string;
  logo?: string;
}

export interface Pricing {
  base_price: number;
  sale_price?: number;
  current_price: number;
  formatted: string;
  currency_symbol: string;
  on_sale?: boolean;
}

export interface BaseModel {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Product extends BaseModel {
  sku: string;
  pricing: Pricing;
  inventory: {
    in_stock: boolean;
    stock_quantity: number;
    manage_stock: boolean;
  };
  specs: {
    weight?: string;
    dimensions?: string;
    type?: string;
    features: Array<{ id: number; title: string, icon?: string }>;
  };
  media: {
    featured_image: string;
    gallery: Media[];
    video_url?: string;
  };
  taxonomy: {
    category: Taxonomy;
    brand?: Taxonomy;
    tags: string[];
  };
  vendor: {
    id: number;
    name: string;
    avatar?: string;
  };
  status: {
    is_published: boolean;
    is_featured: boolean;
    is_new: boolean;
    rating: number;
    review_count: number;
  };
}

export interface Property extends BaseModel {
  pricing: Pricing & {
    price_per_night?: number;
    hoa?: number;
    hoa_formatted?: string;
  };
  specs: {
    bedrooms: number;
    bathrooms: number;
    max_guests?: number;
    area_sq_ft?: number;
    area_formatted?: string;
    year_built?: number;
    property_type?: string;
    category?: string;
  };
  location: {
    title?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  media: {
    featured_image: string;
    gallery: Media[];
    video_url?: string;
    virtual_tour?: string;
  };
  amenities: Array<{ id: number; title: string; icon?: string }>;
}
