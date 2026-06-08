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

export const CORPORATE_FALLBACK_SERVICES: ServiceListing[] = [
  buildService(
    771,
    'Strategic Consulting',
    'strategic-consulting',
    'Enterprise strategy workshops, market expansion planning, and operational excellence programs for growth-stage companies.',
    'Strategy & Operations',
    250,
    'From $250/hr',
    '/themes/services/corporate/11.webp',
    'New York',
    'NY',
    'USA',
    'Northbridge Advisory',
  ),
  buildService(
    772,
    'Digital Transformation',
    'digital-transformation',
    'Cloud migration roadmaps, process automation, and change management for legacy enterprise systems.',
    'Technology Advisory',
    195,
    'From $195/hr',
    '/themes/services/corporate/12.webp',
    'Chicago',
    'IL',
    'USA',
    'Axis Digital Group',
  ),
  buildService(
    773,
    'Financial Advisory',
    'financial-advisory',
    'M&A support, financial modeling, and capital allocation guidance for CFO teams and private equity partners.',
    'Finance',
    320,
    'From $320/hr',
    '/themes/services/corporate/13.webp',
    'Boston',
    'MA',
    'USA',
    'Meridian Capital Partners',
  ),
  buildService(
    774,
    'HR & Talent Advisory',
    'hr-talent-advisory',
    'Workforce planning, executive search support, and organizational design for scaling corporate teams.',
    'Human Resources',
    175,
    'From $175/hr',
    '/themes/services/corporate/14.webp',
    'San Francisco',
    'CA',
    'USA',
    'PeopleFirst Consulting',
  ),
];

export const CREATIVE_FALLBACK_SERVICES: ServiceListing[] = [
  buildService(
    661,
    'Maya Chen — Brand Designer',
    'maya-chen-brand-designer',
    'Visual identity systems, pitch decks, and campaign art direction for startups and lifestyle brands.',
    'Graphic Design',
    95,
    '$95/hr',
    '/themes/services/creative/15.webp',
    'Los Angeles',
    'CA',
    'USA',
    'Maya Chen',
  ),
  buildService(
    662,
    'Jordan Ellis — Copywriter',
    'jordan-ellis-copywriter',
    'Conversion-focused landing pages, product launches, and SEO content for SaaS and ecommerce teams.',
    'Writing & Content',
    75,
    '$75/hr',
    '/themes/services/creative/16.webp',
    'Austin',
    'TX',
    'USA',
    'Jordan Ellis',
  ),
  buildService(
    663,
    'Studio Nova — Web Developer',
    'studio-nova-web-developer',
    'Full-stack builds, CMS implementations, and performance tuning for creative agencies.',
    'Web Development',
    110,
    '$110/hr',
    '/themes/services/creative/17.webp',
    'Remote',
    '',
    'USA',
    'Studio Nova',
  ),
  buildService(
    664,
    'Elena Ruiz — Photographer',
    'elena-ruiz-photographer',
    'Product, lifestyle, and editorial photography for campaigns and ecommerce catalogs.',
    'Photography',
    120,
    '$120/hr',
    '/themes/services/creative/11.webp',
    'Miami',
    'FL',
    'USA',
    'Elena Ruiz',
  ),
];

export const HEALTH_FALLBACK_SERVICES: ServiceListing[] = [
  buildService(
    551,
    'Dr. Amelia Hart — Cardiology',
    'dr-amelia-hart-cardiology',
    'Preventive cardiology consults, advanced diagnostics, and personalized cardiovascular wellness protocols.',
    'Cardiology',
    220,
    '$220/visit',
    '/themes/services/health/15.webp',
    'Seattle',
    'WA',
    'USA',
    'Dr. Amelia Hart',
  ),
  buildService(
    552,
    'Dr. Marcus Lee — Nutrition',
    'dr-marcus-lee-nutrition',
    'Metabolic health coaching, biomarker-driven nutrition plans, and performance nutrition for executives.',
    'Nutrition',
    140,
    '$140/visit',
    '/themes/services/health/16.webp',
    'Denver',
    'CO',
    'USA',
    'Dr. Marcus Lee',
  ),
  buildService(
    553,
    'Dr. Priya Shah — Physical Therapy',
    'dr-priya-shah-physical-therapy',
    'Sports rehabilitation, mobility optimization, and post-operative recovery programs.',
    'Physical Therapy',
    125,
    '$125/visit',
    '/themes/services/health/17.webp',
    'Phoenix',
    'AZ',
    'USA',
    'Dr. Priya Shah',
  ),
  buildService(
    554,
    'Dr. Noah Kim — Mental Wellness',
    'dr-noah-kim-mental-wellness',
    'Stress management, executive coaching, and evidence-based mental wellness consultations.',
    'Mental Wellness',
    160,
    '$160/visit',
    '/themes/services/health/18.webp',
    'Remote',
    '',
    'USA',
    'Dr. Noah Kim',
  ),
];

export type ServicesFallbackVariant = 'marketplace' | 'local' | 'corporate' | 'creative' | 'health';

const FALLBACK_BY_VARIANT: Record<ServicesFallbackVariant, ServiceListing[]> = {
  marketplace: MARKETPLACE_FALLBACK_SERVICES,
  local: LOCAL_FALLBACK_SERVICES,
  corporate: CORPORATE_FALLBACK_SERVICES,
  creative: CREATIVE_FALLBACK_SERVICES,
  health: HEALTH_FALLBACK_SERVICES,
};

export function getFallbackServices(variant: ServicesFallbackVariant): ServiceListing[] {
  return FALLBACK_BY_VARIANT[variant];
}

export function findFallbackService(
  slug: string,
  variant: ServicesFallbackVariant,
): ServiceListing | undefined {
  const match = FALLBACK_BY_VARIANT[variant].find((service) => service.slug === slug);
  if (match) {
    return match;
  }

  if (variant === 'marketplace' || variant === 'corporate') {
    const dynamic = FALLBACK_BY_VARIANT[variant].find(
      (service) => slug.startsWith(String(service.slug).split('-')[0]) || slug.includes(String(service.id)),
    );
    if (dynamic) {
      return { ...dynamic, slug };
    }
  }

  return undefined;
}

export function findMarketplaceFallbackService(slug: string): ServiceListing | undefined {
  return findFallbackService(slug, 'marketplace');
}

export function findLocalFallbackService(slug: string): ServiceListing | undefined {
  return findFallbackService(slug, 'local');
}

export function getCategoryIcon(slug: string, title: string): string {
  const match = MARKETPLACE_FALLBACK_CATEGORIES.find(
    (category) =>
      category.slug === slug || title.toLowerCase().includes(category.title.toLowerCase()),
  );
  return match?.icon || '💼';
}
