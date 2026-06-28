import { AuthUser } from '../auth/types';
import { ListingApiRecord, PaginationMeta } from '../listings/types';

export interface FavoriteRecord {
  id: number;
  user_id: number;
  favoritable_type: string;
  favoritable_id: number;
  favoritable?: ListingApiRecord | null;
  created_at: string;
  updated_at: string;
}

export interface FavoriteStatusResponse {
  is_favorite: boolean;
  favorite_id: number | null;
}

export interface FavoriteBatchStatusItem extends FavoriteStatusResponse {
  vertical: import('../listings/types').ListingVertical;
  listing_id: number;
}

export interface FavoriteBatchStatusResponse {
  items: FavoriteBatchStatusItem[];
}

export interface FavoriteListingCard {
  favoriteId: number;
  listingId: string;
  vertical: import('../listings/types').ListingVertical;
  title: string;
  slug: string;
  price: string;
  location: string;
  imageUrl: string | null;
}

export interface MessageRecord {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  sender?: AuthUser;
}

export interface ConversationRecord {
  id: number;
  user_id: number;
  partner_id: number;
  inquiriable_type?: string | null;
  inquiriable_id?: number | null;
  user?: AuthUser;
  partner?: AuthUser;
  last_message?: MessageRecord | null;
  lastMessage?: MessageRecord | null;
  unread_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationIndexData {
  conversations: ConversationRecord[];
  activeConversation: ConversationRecord | null;
  messages: MessageRecord[];
  message_meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
  user: AuthUser;
}

export interface BuyerActivityStats {
  totalBookings: number;
  totalMessages: number;
  activeInquiries: number;
  walletBalance: number | string;
  favoritesCount: number;
  bookingsCount: number;
  messagesCount: number;
  appsCount: number;
  appointmentsCount: number;
  quotesCount: number;
  inquiriesCount: number;
  classifiedsActivityCount: number;
  reviewsCount: number;
  totalItemsCount: number;
}

export interface BuyerDashboardData {
  user: AuthUser;
  stats: BuyerActivityStats;
  active_theme: { slug: string };
  notification_count: number;
}

export interface PaginatedFavorites {
  data: FavoriteRecord[];
  meta: PaginationMeta;
}

export type BuyerBookingModule = 'properties' | 'events' | 'services';
export type BuyerActivitySource =
  | 'booking'
  | 'order'
  | 'application'
  | 'auto_inquiry'
  | 'service_quote'
  | 'classified_inquiry';
export type BuyerBookingKind =
  | 'property_booking'
  | 'property_visit'
  | 'event_booking'
  | 'service_appointment';

export interface BookingListingSummary {
  id: number;
  title: string;
  slug: string;
  primary_image_url?: string | null;
}

export interface BuyerBookingRecord {
  id: number;
  module: BuyerBookingModule;
  status: string;
  created_at: string;
  updated_at?: string;
  property_id?: number;
  event_id?: number;
  service_id?: number;
  property?: BookingListingSummary | null;
  event?: BookingListingSummary | null;
  service?: BookingListingSummary | null;
  check_in_date?: string | null;
  check_out_date?: string | null;
  scheduled_at?: string | null;
  guests?: number | null;
  duration_nights?: number | null;
  quantity?: number | null;
  total_price?: number | string | null;
  price?: number | string | null;
  topic?: string | null;
  occurrence?: {
    id: number;
    start_date_time: string;
    end_date_time?: string | null;
  } | null;
  ticket_type?: {
    id: number;
    name: string;
    price: number | string;
  } | null;
}

export interface BuyerBookingsData {
  upcomingBookings: BuyerBookingRecord[];
  pastBookings: BuyerBookingRecord[];
}

export interface BuyerOrderItemRecord {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: {
    id: number;
    title: string;
    slug: string;
    image?: string | null;
  } | null;
}

export interface BuyerOrderRecord {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  pricing: {
    subtotal: number;
    shipping_cost: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    currency_symbol: string;
  };
  items: BuyerOrderItemRecord[];
  tracking_number?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface BuyerJobApplicationRecord {
  id: number;
  job_listing_id: number;
  user_id: number;
  status: string;
  cover_letter?: string | null;
  resume_path?: string | null;
  portfolio_url?: string | null;
  viewed_at?: string | null;
  created_at: string;
  updated_at?: string;
  job?: {
    id: number;
    title: string;
    slug: string;
    salary_min?: number | string | null;
    salary_max?: number | string | null;
    workplace_type?: number | string | null;
    primary_image_url?: string | null;
  } | null;
}

export interface BuyerAutoInquiryRecord {
  id: number;
  user_id: number;
  auto_id: number;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  message?: string | null;
  status: string;
  viewed_at?: string | null;
  created_at: string;
  updated_at?: string;
  auto?: {
    id: number;
    title: string;
    slug: string;
    primary_image_url?: string | null;
  } | null;
}

export interface BuyerServiceQuoteRecord {
  id: number;
  service_id: number;
  user_id: number;
  service_package_id?: number | null;
  scope_size?: string | null;
  requested_date?: string | null;
  details?: string | null;
  status: string;
  quoted_price?: number | string | null;
  viewed_at?: string | null;
  created_at: string;
  updated_at?: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  service?: {
    id: number;
    title: string;
    slug: string;
    primary_image_url?: string | null;
  } | null;
}

export interface BuyerClassifiedSummary {
  id: number;
  title: string;
  slug: string;
  base_price?: number | string | null;
  sale_price?: number | string | null;
  price_formatted?: string | null;
  item_condition?: number | string | null;
  condition_label?: string | null;
  item_year_age?: number | string | null;
  item_quantity?: number | null;
  primary_image_url?: string | null;
  brand?: { id: number; name: string } | null;
}

export interface BuyerClassifiedInquiryRecord {
  id: number;
  user_id: number;
  classified_id: number;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  status: string;
  viewed_at?: string | null;
  created_at: string;
  updated_at?: string;
  classified?: BuyerClassifiedSummary | null;
  classifiedAd?: BuyerClassifiedSummary | null;
  classifiedad?: BuyerClassifiedSummary | null;
  classified_ad?: BuyerClassifiedSummary | null;
}

export interface BuyerClassifiedInquiriesData {
  inquiries:
    | BuyerClassifiedInquiryRecord[]
    | { data: BuyerClassifiedInquiryRecord[] };
  favorites?: FavoriteRecord[] | { data: FavoriteRecord[] };
}

export interface BuyerActivityCard {
  key: string;
  id: number;
  source: BuyerActivitySource;
  kind:
    | BuyerBookingKind
    | 'product_order'
    | 'job_application'
    | 'vehicle_inquiry'
    | 'service_quote'
    | 'classified_inquiry';
  vertical: import('../listings/types').ListingVertical;
  title: string;
  imageUrl: string | null;
  status: string;
  secondaryStatus: string | null;
  amount: string | null;
  date: string;
  dateLabel: string;
  detail: string;
  reference: string;
  slug: string | null;
  isUpcoming: boolean;
  cancellationType: BuyerBookingKind | null;
}
