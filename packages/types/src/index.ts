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
  is_property?: boolean;
  properties_count?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'customer' | 'partner';
}

export interface Amenity {
  id: number;
  title: string;
  slug: string;
  is_property?: boolean;
}

export interface PropertyFeature {
  id: number;
  title: string;
  slug: string;
  pivot?: {
    value: string;
  };
}

export interface Location {
  id: number;
  title: string;
  slug: string;
  state?: string | null;
  country?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  is_property?: boolean;
  properties_count?: number;
}

export interface Property {
  id: number;
  user_id: number;
  category_id: number;
  type_id: number;
  brand_id?: number | null;
  location_id: number;
  title: string;
  slug: string;
  description: string;
  base_price: string | number;
  price_per_night?: string | number | null;
  sale_price?: string | number | null;
  number_of_bedrooms: number;
  number_of_bathrooms: number;
  maximum_guests: number;
  minimum_rental_days: number;
  maximum_rental_days: number;
  area_sq_ft: number;
  area_sq_m: number;
  number_of_parking_spots: number;
  hoa: string | number;
  rules?: string | null;
  policies?: string | null;
  year_built: number;
  video?: string | null;
  virtual_tour?: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  status: string | any;
  is_published: boolean;
  is_featured: boolean;
  is_rental: boolean;
  is_sale: boolean;
  approved_at?: string | null;
  created_at: string;
  updated_at: string;

  // Rich API Formatted Fields
  pricing?: {
    base_price?: string | number;
    sale_price?: string | number | null;
    price_per_night?: string | number | null;
    active_price?: string | number | null;
    price_formatted?: string;
    price_formatted_k?: string;
    hoa?: string | number | null;
    hoa_formatted?: string | null;
    currency_symbol?: string;
  } | null;
  specs?: {
    bedrooms?: number;
    bathrooms?: number;
    max_guests?: number;
    total_units?: number;
    area_sq_ft?: number;
    area_sq_m?: number | null;
    area_formatted?: string;
    year_built?: number;
    parking_spots?: number | null;
    property_type?: string;
    category?: string;
  } | null;
  thumbnail_image?: string;
  featured_image?: string;
  gallery?: any[];
  owner?: any;
  short_description?: string;
  rating?: number;

  // Relations
  user?: User;
  location?: Location;
  category?: Category;
  amenities?: Amenity[];
  features?: PropertyFeature[];
  media?: any[];
  primary_image_url?: string;
  thumbnail_url?: string;
}

export interface Vehicle {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string | null;
  featured_image?: string | null;
  pricing: {
    base_price: number;
    sale_price?: number | null;
    formatted?: string | null;
    formatted_short?: string | null;
    is_lease: boolean;
    is_selling: boolean;
  };
  specs: {
    year: number;
    make: string;
    model: string;
    vin?: string | null;
    condition?: string | null;
    mileage?: string | null;
    raw_mileage?: number | null;
    mileage_units?: string | null;
    engine?: string | null;
    transmission?: string | null;
    fuel_economy?: string | null;
    drivetrain?: string | null;
    exterior_color?: string | null;
    warranty?: string | null;
  };
  media: {
    main_photo?: string | null;
    preview?: string | null;
    gallery?: Array<{
      id: number;
      url: string;
      thumbnail?: string;
      name?: string;
    }>;
  };
  taxonomy: {
    category?: {
      id: number;
      title: string;
    } | null;
    brand?: {
      id: number;
      title: string;
    } | null;
    features?: Array<{
      title: string;
      icon?: string | null;
    }>;
    tags?: string[];
  };
  location: {
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zip_code?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  status: {
    is_published: boolean;
    is_featured: boolean;
    is_new_arrival: boolean;
    approved_at?: string | null;
    inquiry_count?: number;
  };
  seo?: {
    meta_title?: string | null;
    meta_description?: string | null;
  };
  owner?: {
    id: number;
    name: string;
    avatar?: string | null;
  };
  created_at?: string;
}

