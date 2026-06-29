import type { Property, Category, Location } from '@/types';

export const LUXURY_FALLBACK_ESTATES: Property[] = [
  {
    id: 1, user_id: 1, category_id: 1, type_id: 1, location_id: 1,
    title: 'The Pemberley Manor', slug: 'pemberley-manor',
    description: 'A majestic historic manor situated in the heart of Hertfordshire, featuring sweeping countryside views and rich architectural history. Built during the Regency period, Pemberley Manor offers exceptionally grand proportions, beautiful sash windows, and intricate original moldings.\n\nThe extensive grounds include pristine manicured lawns, a private serpentine lake, and mature oak forests. A truly unparalleled heritage opportunity.',
    base_price: 14200000, number_of_bedrooms: 6, number_of_bathrooms: 5, maximum_guests: 10,
    minimum_rental_days: 7, maximum_rental_days: 30, area_sq_ft: 12000, area_sq_m: 1114,
    number_of_parking_spots: 4, hoa: 200, year_built: 1815,
    address: 'Pemberley Park', city: 'Hertfordshire', state: 'Herts', country: 'UK', zip_code: 'AL1 1AB',
    status: 'active', is_published: true, is_featured: true, is_rental: false, is_sale: true,
    created_at: '', updated_at: '',
    pricing: { base_price: 14200000, price_formatted: '$14,200,000', currency_symbol: '$' },
    location: { id: 1, title: 'Hertfordshire', country: 'UK', slug: 'hertfordshire' },
    specs: { bedrooms: 6, bathrooms: 5, area_formatted: '12,000 Sq Ft', year_built: 1815, category: 'Country Manors', property_type: 'Sale' },
    featured_image: '/themes/properties/luxury/3.webp',
    short_description: 'A majestic historic manor situated in the heart of Hertfordshire, featuring sweeping countryside views and rich architectural history.',
  },
  {
    id: 2, user_id: 1, category_id: 2, type_id: 1, location_id: 2,
    title: 'Florentine Palazzo', slug: 'florentine-palazzo',
    description: 'An authentic Renaissance palace in central Florence, with original frescoes, grand vaulted halls, and private courtyard gardens. Steeped in history, this Palazzo was designed by master architects of the 16th century and preserves spectacular historical provenance.',
    base_price: 22500000, number_of_bedrooms: 8, number_of_bathrooms: 7, maximum_guests: 16,
    minimum_rental_days: 3, maximum_rental_days: 14, area_sq_ft: 18500, area_sq_m: 1718,
    number_of_parking_spots: 2, hoa: 500, year_built: 1540,
    address: 'Via dei Bardi', city: 'Florence', state: 'Tuscany', country: 'Italy', zip_code: '50125',
    status: 'active', is_published: true, is_featured: false, is_rental: false, is_sale: true,
    created_at: '', updated_at: '',
    pricing: { base_price: 22500000, price_formatted: '$22,500,000', currency_symbol: '$' },
    location: { id: 2, title: 'Florence', country: 'Italy', slug: 'florence' },
    specs: { bedrooms: 8, bathrooms: 7, area_formatted: '18,500 Sq Ft', year_built: 1540, category: 'Historic Chateaus', property_type: 'Sale' },
    featured_image: '/themes/properties/luxury/4.webp',
    short_description: 'An authentic Renaissance palace in central Florence, with original frescoes, grand vaulted halls, and private courtyard gardens.',
  },
  {
    id: 3, user_id: 1, category_id: 3, type_id: 1, location_id: 3,
    title: 'Colonial River Estate', slug: 'colonial-river-estate',
    description: 'A meticulously preserved classic colonial estate on the banks of the James River, boasting rich heritage and timeless charm.',
    base_price: 8900000, number_of_bedrooms: 5, number_of_bathrooms: 4, maximum_guests: 8,
    minimum_rental_days: 1, maximum_rental_days: 365, area_sq_ft: 8200, area_sq_m: 761,
    number_of_parking_spots: 3, hoa: 100, year_built: 1742,
    address: 'River Road', city: 'Virginia', state: 'VA', country: 'USA', zip_code: '23220',
    status: 'active', is_published: true, is_featured: false, is_rental: false, is_sale: true,
    created_at: '', updated_at: '',
    pricing: { base_price: 8900000, price_formatted: '$8,900,000', currency_symbol: '$' },
    location: { id: 3, title: 'Virginia', country: 'USA', slug: 'virginia' },
    specs: { bedrooms: 5, bathrooms: 4, area_formatted: '8,200 Sq Ft', year_built: 1742, category: 'Colonial Estates', property_type: 'Sale' },
    featured_image: '/themes/properties/luxury/3.webp',
    short_description: 'A meticulously preserved classic colonial estate on the banks of the James River, boasting rich heritage and timeless charm.',
  },
];

export const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, title: 'Country Manors', slug: 'country-manors' },
  { id: 2, title: 'Historic Chateaus', slug: 'historic-chateaus' },
  { id: 3, title: 'Colonial Estates', slug: 'colonial-estates' },
  { id: 4, title: 'Royal Castles', slug: 'royal-castles' },
];

export const FALLBACK_LOCATIONS: Location[] = [
  { id: 1, title: 'Hertfordshire', country: 'UK', slug: 'hertfordshire' },
  { id: 2, title: 'Florence', country: 'Italy', slug: 'florence' },
  { id: 3, title: 'Loire Valley', country: 'France', slug: 'loire' },
];
