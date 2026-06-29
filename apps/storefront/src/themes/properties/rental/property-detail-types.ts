import type { Property } from '@/types';

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

export interface PropertyDetail extends Omit<Property, 'status'> {
  status?: Property['status'] | string;
  short_description?: string;
  tags?: string[] | Array<{ title: string }>;
  scores?: PropertyScoreItem[];
  neighborhoods?: PropertyNeighborhoodItem[];
  owner?: PropertyOwnerProfile;
  brand?: { id: number; title: string } | null;
  rules?: string | null;
  policies?: string | null;
  video?: string | null;
  virtual_tour?: string | null;
  latitude?: number;
  longitude?: number;
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
