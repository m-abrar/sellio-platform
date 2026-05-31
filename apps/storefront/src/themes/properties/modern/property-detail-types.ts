import type { Property } from '@sellio/types';

export interface PropertyBookingBlock {
  start: string;
  end: string;
  color?: string;
}

export interface PropertyScoreItem {
  id: number;
  title: string;
  description?: string | null;
  score: number;
  units?: string | null;
}

export interface PropertyFeeItem {
  id: number;
  title: string;
  amount: number;
  type?: string;
  rate?: number | null;
  charge_type?: string;
}

export interface PropertyAddonItem {
  id: number;
  title: string;
  description?: string | null;
  price: number;
}

export interface PropertySeasonalPrice {
  id: number;
  season_name: string;
  start_date?: string | null;
  end_date?: string | null;
  price: number;
}

export interface PropertyNeighborhoodItem {
  id: number;
  title: string;
  description?: string | null;
  distance_miles?: number;
}

export interface PropertyOwnerProfile {
  id: number;
  name: string;
  username?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface PropertyStatusMeta {
  label?: string;
  color_class?: string;
  is_published?: boolean;
  is_featured?: boolean;
  is_rental?: boolean;
  is_sale?: boolean;
  is_new?: boolean;
  is_approved?: boolean;
}

/** Property record shape returned by GET /v1/properties/{slug} */
export interface PropertyDetail extends Omit<Property, 'status'> {
  status?: Property['status'] | PropertyStatusMeta | string;
  short_description?: string;
  tags?: string[] | Array<{ title: string }>;
  fees?: PropertyFeeItem[];
  addons?: PropertyAddonItem[];
  seasonal_prices?: PropertySeasonalPrice[];
  scores?: PropertyScoreItem[];
  neighborhoods?: PropertyNeighborhoodItem[];
  owner?: PropertyOwnerProfile;
  brand?: { id: number; title: string } | null;
  rules?: string | null;
  policies?: string | null;
  video?: string | null;
  virtual_tour?: string | null;
  location?: Property['location'] & {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;
    latitude?: number;
    longitude?: number;
  };
}
