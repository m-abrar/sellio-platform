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

export interface JobListing {
  id: number;
  title: string;
  slug: string;
  description: string;
  employment: {
    type: string;
    workplace: string;
    workplace_id: number;
    experience_level: string;
    education: string | null;
    is_full_time: boolean;
    is_contract: boolean;
  };
  compensation: {
    min: number;
    max: number;
    frequency: string;
    range_compact: string;
    range_full: string;
  };
  company: {
    name: string;
    logo?: string | null;
    logo_card?: string | null;
    photos?: Array<{ url: string; thumb: string }> | null;
  };
  taxonomy: {
    category?: string | null;
    badge_class?: string | null;
    tags?: string[];
  };
  location: {
    display: string;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  status: {
    is_published: boolean;
    is_featured: boolean;
    deadline?: string | null;
    is_expired: boolean;
    approved_at?: string | null;
    application_count?: number | null;
  };
  employer?: {
    id: number;
    name: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceListing {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string | null;
  pricing: {
    base_price: number;
    sale_price?: number | null;
    formatted?: string | null;
    formatted_short?: string | null;
    billing_type: {
      is_subscription: boolean;
      is_project_based: boolean;
    };
    min_contract?: string | null;
  };
  operations: {
    is_open: boolean;
    hours_label?: string | null;
    days_label?: string | null;
    radius?: string | null;
    client_slots?: {
      max?: number;
      available: boolean;
    } | null;
  };
  professional: {
    expertise_id?: string | number | null;
    schedule_id?: string | number | null;
    certifications?: string | null;
    category?: string | null;
    type?: string | null;
  };
  media: {
    main_photo?: string | null;
    gallery?: Array<{
      id: number;
      url: string;
      thumbnail?: string;
      name?: string;
    }>;
  };
  location: {
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    meta?: string | null;
  };
  provider?: {
    id: number;
    name: string;
    avatar?: string | null;
    rating: number;
  } | null;
  features?: Array<{
    id: number;
    title: string;
    value?: string | null;
    icon?: string | null;
  }>;
  tags?: string[];
  status: {
    is_published: boolean;
    is_featured: boolean;
    approved_at?: string | null;
    lead_counts?: {
      quotes?: number | null;
      appointments?: number | null;
    } | null;
  };
  seo?: {
    meta_title?: string | null;
    meta_description?: string | null;
  };
  created_at?: string;
  updated_at?: string;
}

export interface EventListing {
  id: number;
  title: string;
  slug: string;
  description: string;
  schedule: {
    start_at?: string | null;
    end_at?: string | null;
    duration_hours?: number | null;
    is_virtual: boolean;
  };
  ticketing: {
    is_paid: boolean;
    is_free: boolean;
    on_sale?: boolean;
    base_price: number;
    sale_price: number;
    price_formatted?: string | null;
    price_formatted_k?: string | null;
    max_attendees?: number | null;
    tickets_left?: number | null;
  };
  specs: {
    category?: string | null;
    type?: string | null;
    brand?: string | null;
    event_genre?: string | null;
    venue_size?: string | number | null;
    tags?: string[] | null;
  };
  media: {
    poster?: string | null;
    preview?: string | null;
    gallery?: Array<{
      id: number;
      url: string;
      thumbnail?: string | null;
      order?: number | null;
    }> | null;
  };
  location: {
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    map_title?: string | null;
  };
  organizer?: {
    id: number;
    name: string;
    avatar?: string | null;
  } | null;
  status: {
    is_published: boolean;
    is_featured: boolean;
    approved_at?: string | null;
    rating?: number | null;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
  } | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ClassifiedPricing {
  base_price: number;
  sale_price: number;
  is_on_sale: boolean;
  discount: string | null;
  formatted?: string | null;
  formatted_short?: string | null;
  transaction_type: {
    for_sale: boolean;
    for_rent: boolean;
  };
}

export interface ClassifiedItemSpecs {
  condition_rating: number;
  condition_label: string;
  badge_class: string;
  age_years?: number | null;
  quantity: number;
  dimensions?: string | null;
  warranty?: string | null;
}

export interface ClassifiedMedia {
  main_photo: string | null;
  thumbnail?: string | null;
  gallery?: Array<{
    id: number;
    url: string;
    thumb?: string | null;
  }> | null;
  all_photos_count?: number | null;
}

export interface ClassifiedTaxonomy {
  category?: string | null;
  type?: string | null;
  brand?: string | null;
  tags?: string[] | null;
}

export interface ClassifiedLocation {
  city?: string | null;
  state?: string | null;
  country?: string | null;
  address?: string | null;
  zip_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ClassifiedSeller {
  id: number;
  name: string;
  avatar?: string | null;
}

export interface ClassifiedListing {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string | null;
  pricing: ClassifiedPricing;
  item_specs: ClassifiedItemSpecs;
  media: ClassifiedMedia;
  taxonomy: ClassifiedTaxonomy;
  location: ClassifiedLocation;
  status: {
    is_published: boolean;
    is_featured: boolean;
    is_new_listing: boolean;
    is_shipping: boolean;
    approved_at?: string | null;
    inquiry_count?: number | null;
  };
  seller?: ClassifiedSeller | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MenuItem {
  id: number | null;
  title: string;
  url: string;
  target?: '_self' | '_blank';
  children?: MenuItem[];
}

export interface Menu {
  location_key: string;
  title: string;
  source?: 'theme' | 'vertical' | 'global' | 'fallback';
  items: MenuItem[];
}

export type MenuLocationKey =
  | 'main_header'
  | 'social_footer'
  | 'company_footer'
  | 'support_footer'
  | 'resources_footer'
  | 'settings_footer';

export type MenuMap = Partial<Record<MenuLocationKey, Menu>>;

export const MENU_LOCATIONS: MenuLocationKey[] = [
  'main_header',
  'social_footer',
  'company_footer',
  'support_footer',
  'resources_footer',
  'settings_footer',
];


