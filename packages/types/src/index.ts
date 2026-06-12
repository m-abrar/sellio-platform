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

export interface ThemeContentResponse {
  theme_key: string;
  page: string;
  content: Record<string, string | null>;
  media: Record<string, string | null>;
  config: Record<string, unknown>;
}

export interface Testimonial {
  id: number;
  author_name: string;
  author_title?: string | null;
  company?: string | null;
  quote: string;
  rating?: number | null;
  status: 'draft' | 'published' | 'archived';
  sort_order: number;
  avatar_url?: string | null;
  theme_priority?: number | null;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
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

export interface AuthSession {
  access_token: string;
  token_type: string;
  user: User;
}

export interface CartItem {
  id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: {
    id: number;
    title: string;
    slug: string;
    price: number;
    image?: string | null;
  };
  attribute_ids?: number[];
  addon_ids?: number[];
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  item_count: number;
  currency_symbol: string;
}

export interface OrderPricing {
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency_symbol: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  pricing: OrderPricing;
  shipping?: Record<string, string | null>;
  items?: Array<{
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  created_at?: string;
}

export interface PaymentGatewayOption {
  slug: string;
  title: string;
  mode: string;
  frontend_config?: Record<string, string | null>;
}

export interface CheckoutContext {
  cart: Cart;
  order_preview: {
    amount: number;
    currency: string;
    description: string;
  };
  gateways: PaymentGatewayOption[];
  stripe_publishable_key: string | null;
}

export interface CheckoutPaymentResult {
  status: 'successful' | 'pending_auth' | 'pending_manual' | 'failed';
  order?: Order;
  reference?: string | null;
  redirect_url?: string;
  message?: string;
}

export interface PropertyBookingLine {
  title: string;
  amount: number;
  type?: string;
}

export interface PropertyBookingBreakdown {
  property_id: number;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  lines: PropertyBookingLine[];
  initial_total: number;
}

export interface PropertyBookingRecord {
  id: number;
  property_id: number;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: number;
  status: string;
  full_name?: string;
  email?: string;
  phone?: string;
  duration_nights?: number;
  property?: {
    id: number;
    title: string;
    slug: string;
    primary_image_url?: string | null;
  };
}

export interface PropertyBookingPaymentContext {
  booking: PropertyBookingRecord;
  gateways: PaymentGatewayOption[];
  stripe_publishable_key: string | null;
}

export interface PropertyBookingPaymentResult {
  status: 'successful' | 'pending_auth' | 'pending_manual' | 'failed';
  booking?: PropertyBookingRecord;
  reference?: string | null;
  redirect_url?: string;
  message?: string;
}

export interface PropertyLeadRecord {
  id: number;
  property_id: number;
  status: string;
  scheduled_at?: string;
  message?: string;
}

export interface JobApplicationRecord {
  id: number;
  job_listing_id: number;
  status: string;
  cover_letter?: string;
  portfolio_url?: string | null;
  job?: {
    id: number;
    title: string;
    slug: string;
  };
}

export interface ServiceConsultationRecord {
  id: number;
  service_id: number;
  status: string;
  name?: string;
  email?: string;
  phone?: string | null;
  topic?: string;
  notes?: string | null;
  scheduled_at?: string | null;
  service?: {
    id: number;
    title: string;
    slug: string;
  };
}

export interface ClassifiedInquiryRecord {
  id: number;
  classified_id: number;
  status: string;
  message?: string | null;
  classified?: {
    id: number;
    title: string;
    slug: string;
  };
}

export interface AutoInquiryRecord {
  id: number;
  auto_id: number;
  status: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
  auto?: {
    id: number;
    title: string;
    slug: string;
    primary_image_url?: string | null;
  };
}

export interface EventTicketInventoryItem {
  id: number;
  name: string;
  price: number;
  available: number;
}

export interface EventOccurrenceTicketData {
  start_date_formatted: string;
  start_date_iso: string;
  slug: string;
  inventory: EventTicketInventoryItem[];
}

export type EventTicketDataMap = Record<string, EventOccurrenceTicketData>;

export interface EventBookingRecord {
  id: number;
  event_id: number;
  event_occurrence_id: number;
  event_ticket_type_id: number;
  quantity: number;
  total_price: number;
  status: string;
  event?: {
    id: number;
    title: string;
    slug: string;
    primary_image_url?: string | null;
  };
  occurrence?: {
    id: number;
    start_date_time: string;
    end_date_time?: string | null;
  } | null;
  ticket_type?: {
    id: number;
    name: string;
    price?: number | null;
  } | null;
}

export interface EventBookingPaymentContext {
  booking: EventBookingRecord;
  gateways: PaymentGatewayOption[];
  stripe_publishable_key: string | null;
  payment_total: number;
}

export interface EventBookingPaymentResult {
  status: 'successful' | 'pending_auth' | 'pending_manual' | 'failed';
  booking?: EventBookingRecord;
  reference?: string | null;
  redirect_url?: string;
  message?: string;
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
    category?: string | { id?: number; title?: string; slug?: string } | null;
    brand?: string | { id?: number; title?: string; slug?: string } | null;
    type?: string | { id?: number; title?: string; slug?: string } | null;
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
  ticket_data?: EventTicketDataMap;
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
  | 'utility_topbar'
  | 'main_header'
  | 'mobile_nav'
  | 'utility_header'
  | 'action_buttons'
  | 'secondary_nav'
  | 'footer_column_1'
  | 'footer_column_2'
  | 'footer_column_3'
  | 'footer_column_4'
  | 'footer_bottom_bar'
  | 'social_footer'
  /** @deprecated Use footer_column_1..4 */
  | 'company_footer'
  /** @deprecated Use footer_column_1..4 */
  | 'support_footer'
  /** @deprecated Use footer_column_1..4 */
  | 'resources_footer'
  /** @deprecated Use footer_bottom_bar */
  | 'settings_footer';

export type MenuMap = Partial<Record<MenuLocationKey, Menu>>;

export const MENU_LOCATIONS: MenuLocationKey[] = [
  'utility_topbar',
  'main_header',
  'mobile_nav',
  'utility_header',
  'action_buttons',
  'secondary_nav',
  'footer_column_1',
  'footer_column_2',
  'footer_column_3',
  'footer_column_4',
  'footer_bottom_bar',
  'social_footer',
];
