export type ModuleType = 'properties' | 'events' | 'autos' | 'services' | 'jobs' | 'classifieds' | 'products';

export interface BaseItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Property extends BaseItem {
  type: 'rent' | 'sale';
  location: string;
  beds: number;
  baths: number;
}

export interface Event extends BaseItem {
  date: string;
  location: string;
  availableTickets: number;
}

export interface Auto extends BaseItem {
  make: string;
  model: string;
  year: number;
  transmission: 'auto' | 'manual';
}

export interface Service extends BaseItem {
  provider: string;
  duration: string;
  rating: number;
}

export interface Job extends BaseItem {
  company: string;
  type: 'full-time' | 'part-time' | 'contract';
  salaryRange: string;
}

export interface Classified extends BaseItem {
  condition: 'new' | 'used';
  seller: string;
}

export interface Product extends BaseItem {
  stock: number;
  brand: string;
}

export interface Booking {
  id: string;
  itemId: string;
  itemTitle: string;
  module: ModuleType;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
}
