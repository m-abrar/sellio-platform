import type { ClassifiedListing } from '@sellio/types';
import { DEALS_FALLBACK_CLASSIFIEDS } from './fallback-deals';
import { ELITE_FALLBACK_CLASSIFIEDS } from './fallback-elite';
import { MODERN_FALLBACK_CLASSIFIEDS } from './fallback-modern';
import { PREMIUM_FALLBACK_CLASSIFIEDS } from './fallback-premium';

export { DEALS_FALLBACK_CLASSIFIEDS } from './fallback-deals';
export { ELITE_FALLBACK_CLASSIFIEDS } from './fallback-elite';
export { MODERN_FALLBACK_CLASSIFIEDS } from './fallback-modern';
export { PREMIUM_FALLBACK_CLASSIFIEDS } from './fallback-premium';

export const LOCAL_FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Like-New Trek Mountain Bike",
    slug: "like-new-trek-mountain-bike",
    description: "Trek mountain bike in pristine state. Multi-gear shifts, standard suspension, ready for mountain routes.",
    pricing: {
      base_price: 350,
      sale_price: 350,
      is_on_sale: false,
      discount: null,
      formatted: "$350",
      formatted_short: "$350",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Capitol Hill", state: "WA" },
    taxonomy: { category: "bikes", brand: "John Smith" },
    media: { main_photo: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cl-badge-excellent", quantity: 1, dimensions: "32,38" },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: false }
  },
  {
    id: 2,
    title: "Wooden Dining Table + 4 Chairs",
    slug: "wooden-dining-table-4-chairs",
    description: "Solid oak dining table set with 4 matching comfortable chairs. Minor wear on tabletop.",
    pricing: {
      base_price: 150,
      sale_price: 150,
      is_on_sale: false,
      discount: null,
      formatted: "$150",
      formatted_short: "$150",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "First Hill", state: "WA" },
    taxonomy: { category: "home", brand: "Marie Laurent" },
    media: { main_photo: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Good", badge_class: "cl-badge-good", quantity: 1, dimensions: "55,64" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 3,
    title: "Box of Baby Clothes (0-6 months)",
    slug: "box-of-baby-clothes-0-6-months",
    description: "Clean assortment of unisex baby clothes. Gown, onesies, socks, and hats included.",
    pricing: {
      base_price: 0,
      sale_price: 0,
      is_on_sale: false,
      discount: null,
      formatted: "Free",
      formatted_short: "Free",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Capitol Hill", state: "WA" },
    taxonomy: { category: "kids", brand: "Alice Baker" },
    media: { main_photo: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Like New", badge_class: "cl-badge-likenew", quantity: 1, dimensions: "45,22" },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: false }
  },
  {
    id: 4,
    title: "Monstera Deliciosa Plant (Large)",
    slug: "monstera-deliciosa-plant-large",
    description: "Healthy indoor potted plant. 4 feet tall with wide split leaves, extremely easy to maintain.",
    pricing: {
      base_price: 40,
      sale_price: 40,
      is_on_sale: false,
      discount: null,
      formatted: "$40",
      formatted_short: "$40",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Queen Anne", state: "WA" },
    taxonomy: { category: "home", brand: "Ryan Taylor" },
    media: { main_photo: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Healthy", badge_class: "cl-badge-healthy", quantity: 1, dimensions: "18,58" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 5,
    title: "IKEA Kallax Shelf Unit (White)",
    slug: "ikea-kallax-shelf-unit-white",
    description: "Standard Kallax organizer with 4 cube compartments. Clean condition, slight cosmetic scuffs.",
    pricing: {
      base_price: 45,
      sale_price: 45,
      is_on_sale: false,
      discount: null,
      formatted: "$45",
      formatted_short: "$45",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Belltown", state: "WA" },
    taxonomy: { category: "home", brand: "Karen Davis" },
    media: { main_photo: "https://images.unsplash.com/photo-1595514535115-d52fdfbc3075?q=80&w=400" },
    item_specs: { condition_rating: 3, condition_label: "Fair", badge_class: "cl-badge-fair", quantity: 1, dimensions: "72,46" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 6,
    title: "Neighborhood Moving Sale - Sunday",
    slug: "neighborhood-moving-sale-sunday",
    description: "Huge selection of household tools, garage elements, vintage records, and winter jackets.",
    pricing: {
      base_price: 10,
      sale_price: 10,
      is_on_sale: false,
      discount: null,
      formatted: "Varies",
      formatted_short: "Varies",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Capitol Hill", state: "WA" },
    taxonomy: { category: "garage", brand: "Eric Wright" },
    media: { main_photo: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Multi-item", badge_class: "cl-badge-multi", quantity: 1, dimensions: "28,74" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 7,
    title: "Dog Crate - Medium Size Wire",
    slug: "dog-crate-medium-size-wire",
    description: "Folds flat for storage. Security locks and bottom plastic tray are completely intact.",
    pricing: {
      base_price: 25,
      sale_price: 25,
      is_on_sale: false,
      discount: null,
      formatted: "$25",
      formatted_short: "$25",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Fremont", state: "WA" },
    taxonomy: { category: "pets", brand: "Peter Parker" },
    media: { main_photo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Good", badge_class: "cl-badge-good", quantity: 1, dimensions: "12,15" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 8,
    title: "Baby Jogger Stroller (Red)",
    slug: "baby-jogger-stroller-red",
    description: "Highly robust running stroller. Features three durable shock-absorbent all-terrain tires.",
    pricing: {
      base_price: 95,
      sale_price: 95,
      is_on_sale: false,
      discount: null,
      formatted: "$95",
      formatted_short: "$95",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Ballard", state: "WA" },
    taxonomy: { category: "kids", brand: "Mary Jane" },
    media: { main_photo: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cl-badge-excellent", quantity: 1, dimensions: "82,84" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  }
];

export const GENERAL_FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "iPhone 13 Pro - 256GB Gold Unlocked",
    slug: "iphone-13-pro-256gb-gold-unlocked",
    description: "Pristine gold iPhone 13 Pro. 256GB storage, fully factory unlocked. Battery health is at 90%, screen and chassis are free of major scratches.",
    pricing: {
      base_price: 799,
      sale_price: 799,
      is_on_sale: false,
      discount: null,
      formatted: "$799",
      formatted_short: "$799",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Dallas", state: "TX" },
    taxonomy: { category: "electronics", brand: "User113" },
    media: { main_photo: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 2,
    title: "Sony A7III Mirrorless Camera Body",
    slug: "sony-a7iii-mirrorless-camera-body",
    description: "Well-maintained Sony A7III body only. Low shutter count, comes with original strap, box, and 2 batteries.",
    pricing: {
      base_price: 1200,
      sale_price: 1200,
      is_on_sale: false,
      discount: null,
      formatted: "$1,200",
      formatted_short: "$1.2K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Seattle", state: "WA" },
    taxonomy: { category: "electronics", brand: "PhotoPro" },
    media: { main_photo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 3,
    title: "Sony Noise Canceling Headphones WH-CH720N",
    slug: "sony-noise-canceling-headphones-wh-ch720n",
    description: "Lightweight over-ear headphones with superior active noise canceling. Comes with charging cable.",
    pricing: {
      base_price: 120,
      sale_price: 120,
      is_on_sale: false,
      discount: null,
      formatted: "$120",
      formatted_short: "$120",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Boston", state: "MA" },
    taxonomy: { category: "electronics", brand: "AudioFan" },
    media: { main_photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 4,
    title: "2018 Honda Civic EX - Low Mileage",
    slug: "2018-honda-civic-ex-low-mileage",
    description: "EX trim model with only 45k miles. Single owner, clean title, and up-to-date maintenance records.",
    pricing: {
      base_price: 16500,
      sale_price: 16500,
      is_on_sale: false,
      discount: null,
      formatted: "$16,500",
      formatted_short: "$16.5K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Dallas", state: "TX" },
    taxonomy: { category: "vehicles", brand: "AutoSeller99" },
    media: { main_photo: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 5,
    title: "Classic Road Bike - Excellent Frame",
    slug: "classic-road-bike-excellent-frame",
    description: "Vintage steel frame road bike, recently tuned up with brand new tires, tubes, and handlebar tape.",
    pricing: {
      base_price: 450,
      sale_price: 450,
      is_on_sale: false,
      discount: null,
      formatted: "$450",
      formatted_short: "$450",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Chicago", state: "IL" },
    taxonomy: { category: "vehicles", brand: "CyclistJoe" },
    media: { main_photo: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 6,
    title: "Cozy 1-Bedroom Condo near Downtown",
    slug: "cozy-1-bedroom-condo-near-downtown",
    description: "Charming 1-bedroom condo with updated appliances, in-unit laundry, and a beautiful balcony view.",
    pricing: {
      base_price: 145000,
      sale_price: 145000,
      is_on_sale: false,
      discount: null,
      formatted: "$145,000",
      formatted_short: "$145K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Denver", state: "CO" },
    taxonomy: { category: "real-estate", brand: "AgentSarah" },
    media: { main_photo: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 7,
    title: "Spacious Suburb Family Home (4B/3B)",
    slug: "spacious-suburb-family-home-4b-3b",
    description: "Stunning 4-bedroom, 3-bathroom suburban home with huge backyard and renovated kitchen.",
    pricing: {
      base_price: 320000,
      sale_price: 320000,
      is_on_sale: false,
      discount: null,
      formatted: "$320,000",
      formatted_short: "$320K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Dallas", state: "TX" },
    taxonomy: { category: "real-estate", brand: "AgentDave" },
    media: { main_photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 8,
    title: "Mid-Century Modern Sofa (Teal Velvet)",
    slug: "mid-century-modern-sofa-teal-velvet",
    description: "Vibrant teal velvet sofa, mid-century design. Extremely comfortable, minor wear on legs.",
    pricing: {
      base_price: 600,
      sale_price: 600,
      is_on_sale: false,
      discount: null,
      formatted: "$600",
      formatted_short: "$600",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "New York", state: "NY" },
    taxonomy: { category: "home", brand: "UsesM83" },
    media: { main_photo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 9,
    title: "Modern Elegant Brass Desk Lamp",
    slug: "modern-elegant-brass-desk-lamp",
    description: "Heavy solid brass desk lamp. Minimalist design, casts a warm downward glow.",
    pricing: {
      base_price: 85,
      sale_price: 85,
      is_on_sale: false,
      discount: null,
      formatted: "$85",
      formatted_short: "$85",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Austin", state: "TX" },
    taxonomy: { category: "home", brand: "ShopLux" },
    media: { main_photo: "https://images.unsplash.com/photo-1507473885765-e6ed057f7821?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 10,
    title: "Retro Leather Bomber Jacket (Large)",
    slug: "retro-leather-bomber-jacket-large",
    description: "Thick premium leather bomber jacket. Classic vintage fit, fully lined.",
    pricing: {
      base_price: 180,
      sale_price: 180,
      is_on_sale: false,
      discount: null,
      formatted: "$180",
      formatted_short: "$180",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Portland", state: "OR" },
    taxonomy: { category: "fashion", brand: "VintageHQ" },
    media: { main_photo: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 11,
    title: "Designer Chronograph Gold Watch",
    slug: "designer-chronograph-gold-watch",
    description: "Heavy gold plated luxury wristwatch. Chronograph functions are fully operational.",
    pricing: {
      base_price: 350,
      sale_price: 350,
      is_on_sale: false,
      discount: null,
      formatted: "$350",
      formatted_short: "$350",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Miami", state: "FL" },
    taxonomy: { category: "fashion", brand: "StyleVault" },
    media: { main_photo: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 12,
    title: "Professional Guitar & Bass Lessons",
    slug: "professional-guitar-bass-lessons",
    description: "One-on-one lessons for beginner to intermediate levels. Taught by certified instructor.",
    pricing: {
      base_price: 45,
      sale_price: 45,
      is_on_sale: false,
      discount: null,
      formatted: "$45",
      formatted_short: "$45",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Chicago", state: "IL" },
    taxonomy: { category: "services", brand: "GuitarGuru" },
    media: { main_photo: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  }
];

export const LOCAL_DEMO_CATEGORIES = [
  { id: 'all', name: 'All Nearby', icon: '📍' },
  { id: 'free', name: '🆓 Free Stuff', icon: '🆓' },
  { id: 'home', name: '🏡 Home & Garden', icon: '🏡' },
  { id: 'kids', name: '🧸 Kids & Baby', icon: '🧸' },
  { id: 'bikes', name: '🚲 Bikes & Outdoor', icon: '🚲' },
  { id: 'pets', name: '🐾 Pet Supplies', icon: '🐾' },
  { id: 'garage', name: '🏷️ Garage Sales', icon: '🏷️' },
];

export const GENERAL_DEMO_CATEGORIES = [
  { id: 'all', name: 'All Listings', icon: '📂' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠' },
  { id: 'home', name: 'Home Goods', icon: '🛋️' },
  { id: 'fashion', name: 'Fashion', icon: '👕' },
  { id: 'services', name: 'Services', icon: '🔧' },
];

export function findLocalFallbackListing(slug: string) {
  return LOCAL_FALLBACK_CLASSIFIEDS.find((item) => item.slug === slug);
}

export function findGeneralFallbackListing(slug: string) {
  return GENERAL_FALLBACK_CLASSIFIEDS.find((item) => item.slug === slug);
}

export function getLocalRelatedListings(listing: ClassifiedListing, limit = 3) {
  return LOCAL_FALLBACK_CLASSIFIEDS.filter(
    (item) => item.taxonomy?.category === listing.taxonomy?.category && item.slug !== listing.slug,
  ).slice(0, limit);
}

export function getGeneralRelatedListings(listing: ClassifiedListing, limit = 3) {
  return GENERAL_FALLBACK_CLASSIFIEDS.filter(
    (item) => item.taxonomy?.category === listing.taxonomy?.category && item.slug !== listing.slug,
  ).slice(0, limit);
}


export type ClassifiedsFallbackVariant =
  | 'local'
  | 'general'
  | 'deals'
  | 'elite'
  | 'modern'
  | 'premium';

const FALLBACK_LISTINGS: Record<ClassifiedsFallbackVariant, ClassifiedListing[]> = {
  local: LOCAL_FALLBACK_CLASSIFIEDS,
  general: GENERAL_FALLBACK_CLASSIFIEDS,
  deals: DEALS_FALLBACK_CLASSIFIEDS,
  elite: ELITE_FALLBACK_CLASSIFIEDS,
  modern: MODERN_FALLBACK_CLASSIFIEDS,
  premium: PREMIUM_FALLBACK_CLASSIFIEDS,
};

export function getFallbackClassifieds(variant: ClassifiedsFallbackVariant) {
  return FALLBACK_LISTINGS[variant];
}

export function findFallbackListing(slug: string, variant: ClassifiedsFallbackVariant) {
  return FALLBACK_LISTINGS[variant].find((item) => item.slug === slug);
}

export function getFallbackRelatedListings(
  listing: ClassifiedListing,
  variant: ClassifiedsFallbackVariant,
  limit = 4,
) {
  return FALLBACK_LISTINGS[variant]
    .filter(
      (item) =>
        item.taxonomy?.category === listing.taxonomy?.category && item.slug !== listing.slug,
    )
    .slice(0, limit);
}

export const ELITE_DEMO_CATEGORIES = [
  { id: 'all', name: 'All Vaults' },
  { id: 'motors', name: 'Exotic Motors' },
  { id: 'art', name: 'Fine Art' },
  { id: 'spirits', name: 'Rare Vintages' },
  { id: 'horology', name: 'Luxury Horology' },
];

export const MODERN_DEMO_CATEGORIES = [
  { id: 'all', name: 'Everything' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'fashion', name: 'Fashion' },
];

export const PREMIUM_DEMO_CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'tech', name: 'Technology' },
  { id: 'hospitality', name: 'Hospitality' },
  { id: 'manufacturing', name: 'Manufacturing' },
  { id: 'retail', name: 'Retail' },
];
