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
  created_at: string;
  updated_at: string;
}

export interface ConversationIndexData {
  conversations: ConversationRecord[];
  activeConversation: ConversationRecord | null;
  messages: MessageRecord[];
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
