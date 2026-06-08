import type { ServiceListing } from '@sellio/types';

const publishedStatus = {
  is_published: true,
  is_featured: true,
};

const hourlyBilling = {
  is_subscription: false,
  is_project_based: false,
};

function buildService(
  id: number,
  title: string,
  slug: string,
  description: string,
  category: string,
  basePrice: number,
  formatted: string,
  image: string,
  city: string,
  state: string,
  country: string,
  providerName: string,
): ServiceListing {
  return {
    id,
    title,
    slug,
    description,
    short_description: description,
    pricing: {
      base_price: basePrice,
      formatted,
      formatted_short: formatted,
      billing_type: hourlyBilling,
    },
    operations: {
      is_open: true,
      hours_label: 'Mon–Sat 8am–6pm',
    },
    professional: {
      category,
      type: providerName,
    },
    media: {
      main_photo: image,
      gallery: [],
    },
    location: {
      city,
      state,
      country,
      meta: `${city}, ${state}`,
    },
    provider: {
      id,
      name: providerName,
      rating: 4.8,
    },
    status: publishedStatus,
  };
}

export const MARKETPLACE_FALLBACK_CATEGORIES = [
  { id: 1, title: 'Home Repair', slug: 'home-repair', icon: '🛠️' },
  { id: 2, title: 'Design', slug: 'design', icon: '🎨' },
  { id: 3, title: 'Education', slug: 'education', icon: '🎓' },
  { id: 4, title: 'Health', slug: 'health', icon: '❤️' },
  { id: 5, title: 'Events', slug: 'events', icon: '📅' },
  { id: 6, title: 'Tech Support', slug: 'tech-support', icon: '💻' },
];

export const MARKETPLACE_FALLBACK_SERVICES: ServiceListing[] = [
  buildService(
    991,
    'Anna J.',
    'anna-j-designer',
    'Professional designer offering branding, UI systems, and marketing collateral for growing businesses.',
    'Professional Designer',
    75,
    '$75/hr',
    '/themes/services/marketplace/15.webp',
    'San Francisco',
    'CA',
    'USA',
    'Anna J.',
  ),
  buildService(
    992,
    'Mark T.',
    'mark-t-plumber',
    'Licensed plumber available for emergency repairs, fixture installs, and preventative maintenance.',
    '24/7 Plumber Expert',
    120,
    '$120/hr',
    '/themes/services/marketplace/16.webp',
    'Austin',
    'TX',
    'USA',
    'Mark T.',
  ),
  buildService(
    993,
    'Ben L.',
    'ben-l-tutor',
    'Advanced math tutor supporting high school and university students with exam prep and coursework.',
    'Advanced Math Tutor',
    50,
    '$50/hr',
    '/themes/services/marketplace/17.webp',
    'Chicago',
    'IL',
    'USA',
    'Ben L.',
  ),
  buildService(
    994,
    'Laura S.',
    'laura-s-electrician',
    'Certified electrician for panel upgrades, lighting installs, and residential troubleshooting.',
    'Certified Electrician',
    90,
    '$90/hr',
    '/themes/services/marketplace/18.webp',
    'Denver',
    'CO',
    'USA',
    'Laura S.',
  ),
];

export const LOCAL_FALLBACK_SERVICES: ServiceListing[] = [
  buildService(
    881,
    'Home Cleaning',
    'home-cleaning',
    'Deep cleaning, move-out cleans, and recurring home maintenance from vetted local professionals.',
    'Cleaning',
    89,
    'From $89',
    '/themes/services/local/15.webp',
    'Portland',
    'OR',
    'USA',
    'HomeFix Crew',
  ),
  buildService(
    882,
    'Handyman Repairs',
    'handyman-repairs',
    'Drywall patching, furniture assembly, fixture installs, and general home repair tasks.',
    'Handyman',
    75,
    'From $75',
    '/themes/services/local/16.webp',
    'Portland',
    'OR',
    'USA',
    'John D.',
  ),
  buildService(
    883,
    'Emergency Plumbing',
    'emergency-plumbing',
    'Fast response plumbing for leaks, clogs, water heaters, and fixture replacements.',
    'Plumbing',
    110,
    'From $110',
    '/themes/services/local/17.webp',
    'Portland',
    'OR',
    'USA',
    'Mike A.',
  ),
  buildService(
    884,
    'Lawn & Garden Care',
    'lawn-garden-care',
    'Seasonal lawn mowing, hedge trimming, garden bed maintenance, and yard cleanup.',
    'Landscaping',
    65,
    'From $65',
    '/themes/services/local/18.webp',
    'Portland',
    'OR',
    'USA',
    'Lisa M.',
  ),
  buildService(
    885,
    'HVAC Tune-Up',
    'hvac-tune-up',
    'Seasonal HVAC inspections, filter changes, and efficiency tune-ups for home systems.',
    'HVAC',
    95,
    'From $95',
    '/themes/services/local/15.webp',
    'Portland',
    'OR',
    'USA',
    'HomeFix HVAC',
  ),
  buildService(
    886,
    'Electrical Safety Check',
    'electrical-safety-check',
    'Outlet testing, panel inspections, and safety assessments for residential electrical systems.',
    'Electrical',
    99,
    'From $99',
    '/themes/services/local/16.webp',
    'Portland',
    'OR',
    'USA',
    'Sarah K.',
  ),
];

export function findMarketplaceFallbackService(slug: string): ServiceListing | undefined {
  return MARKETPLACE_FALLBACK_SERVICES.find((service) => service.slug === slug);
}

export function findLocalFallbackService(slug: string): ServiceListing | undefined {
  return LOCAL_FALLBACK_SERVICES.find((service) => service.slug === slug);
}

export function getCategoryIcon(slug: string, title: string): string {
  const match = MARKETPLACE_FALLBACK_CATEGORIES.find(
    (category) =>
      category.slug === slug || title.toLowerCase().includes(category.title.toLowerCase()),
  );
  return match?.icon || '💼';
}
