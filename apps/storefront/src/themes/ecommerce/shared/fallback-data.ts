import type { Product } from '@sellio/types';

const placeholderImage =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='820' viewBox='0 0 640 820'><rect width='100%' height='100%' fill='%23f8fafc'/><g transform='translate(288,350)' stroke='%232563eb' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='10'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='57%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='13' font-weight='800' letter-spacing='2' fill='%2364748b'>PRODUCT IMAGE</text></svg>";

/**
 * Demo catalogue for ecommerce preview or when NEXT_PUBLIC_DEMO_FALLBACK=true.
 */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 901,
    title: 'Refined Shell Jacket',
    slug: 'refined-shell-jacket',
    description:
      'Water-resistant technical shell with clean tailoring and breathable lining for everyday wear.',
    price: 248,
    category_id: 1,
    pricing: {
      base_price: 248,
      sale_price: 248,
      current_price: 248,
      formatted: '$248.00',
      currency_symbol: '$',
    },
    image_url: placeholderImage,
  },
  {
    id: 902,
    title: 'Merino Knit Crew',
    slug: 'merino-knit-crew',
    description: 'Fine-gauge merino wool knit with a relaxed fit and soft hand feel.',
    price: 128,
    category_id: 1,
    pricing: {
      base_price: 128,
      sale_price: 128,
      current_price: 128,
      formatted: '$128.00',
      currency_symbol: '$',
    },
    image_url: placeholderImage,
  },
  {
    id: 903,
    title: 'Essential Canvas Tote',
    slug: 'essential-canvas-tote',
    description: 'Structured canvas tote with reinforced handles and interior pocket.',
    price: 68,
    category_id: 2,
    pricing: {
      base_price: 68,
      sale_price: 68,
      current_price: 68,
      formatted: '$68.00',
      currency_symbol: '$',
    },
    image_url: placeholderImage,
  },
  {
    id: 904,
    title: 'Studio Low Sneaker',
    slug: 'studio-low-sneaker',
    description: 'Minimal leather sneaker with cushioned insole and durable rubber outsole.',
    price: 165,
    category_id: 3,
    pricing: {
      base_price: 165,
      sale_price: 165,
      current_price: 165,
      formatted: '$165.00',
      currency_symbol: '$',
    },
    image_url: placeholderImage,
  },
  {
    id: 905,
    title: 'Linen Resort Shirt',
    slug: 'linen-resort-shirt',
    description: 'Lightweight linen shirt with a relaxed collar and breathable weave.',
    price: 98,
    category_id: 1,
    pricing: {
      base_price: 98,
      sale_price: 98,
      current_price: 98,
      formatted: '$98.00',
      currency_symbol: '$',
    },
    image_url: placeholderImage,
  },
  {
    id: 906,
    title: 'Cashmere Wrap Scarf',
    slug: 'cashmere-wrap-scarf',
    description: 'Soft cashmere blend scarf with generous dimensions for layering.',
    price: 185,
    category_id: 2,
    pricing: {
      base_price: 185,
      sale_price: 185,
      current_price: 185,
      formatted: '$185.00',
      currency_symbol: '$',
    },
    image_url: placeholderImage,
  },
];

export function findFallbackProduct(slug: string): Product | null {
  return FALLBACK_PRODUCTS.find((product) => product.slug === slug) || null;
}
