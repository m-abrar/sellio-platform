import type { ThemeContentResponse } from '@sellio/types';

export const EMPTY_THEME_CONTENT: ThemeContentResponse = {
  theme_key: 'fallback',
  page: 'home',
  content: {},
  media: {},
  config: {},
};

const PROPERTIES_CLASSIC_HOME: ThemeContentResponse = {
  theme_key: 'properties_classic',
  page: 'home',
  content: {
    'header.brand_label': 'ESTATE & HERITAGE',
    'hero.eyebrow': 'Global Registry // Vol. 2026',
    'hero.title': 'The Heritage\nRegistry.',
    'hero.description': "A curated distribution of the world's most distinguished historic properties. Every acquisition is verified for architectural provenance and manorial integrity.",
    'hero.primary_cta_label': 'DISCOVER',
    'collection.heading': 'The Collection.',
    'collection.description': 'Current distribution includes verified manorial rights and significant historical provenance.',
    'testimonials.eyebrow': 'Patron Feedback',
    'testimonials.title': 'Voices of Trust.',
    'footer.description': "A curated distribution of the world's most distinguished historic properties. Every acquisition is verified for architectural provenance and legacy value.",
    'footer.subscribe_text': 'Subscribe to our global heritage distribution protocol.',
  },
  media: {
    'hero.image': '/themes/properties/classic/7.webp',
  },
  config: {},
};

const EVENTS_MUSIC_HOME: ThemeContentResponse = {
  theme_key: 'events_music',
  page: 'home',
  content: {
    'header.brand_label': 'PULSE',
    'hero.eyebrow': 'PULSE // LIVE TRANSMISSION',
    'hero.title': 'FEEL THE\nMUSIC LIVE.',
    'hero.description': 'Discover elite concerts and underground music festivals across the global sonic network. High-fidelity experiences for the modern listener.',
    'hero.primary_cta_label': 'Get Your Tickets',
    'hero.secondary_cta_label': 'Explore Lineup',
    'metrics.left_text': 'SYSTEM: OPTIMIZED | AUDIO: 120DB LIMIT | SYNC: VERIFIED',
    'metrics.right_text': 'BPM TRACKER: 128 (HOUSE)',
    'lineup.eyebrow': 'Elite Headliners',
    'lineup.title': 'The Core Lineup.',
    'support.eyebrow': 'Underground Nodes',
    'support.title': 'Sonic Support.',
    'experience.eyebrow': 'THE EXPERIENCE',
    'experience.title': 'Absolute\nSound.',
    'experience.description': "PULSE is the definitive destination for high-velocity music culture. We don't just sell tickets; we provide verified access to the most immersive audio experiences on the planet.",
    'experience.callout': 'NEXT_UP: IBIZA_MESH',
    'gallery.title': 'Sonic Recaps.',
    'cta.title': 'Join the\nPulse.',
    'cta.description': "Initialize your access for the world's most immersive music distribution network. High-fidelity experiences, verified by the PULSE sonic registry.",
    'cta.button_label': 'Reserve Access',
    'footer.description': "The heartbeat of live music. Access the world's most immersive sonic distribution network. Verified high-fidelity experiences.",
  },
  media: {
    'hero.image': '/themes/events/music/10.webp',
    'experience.image': '/themes/events/music/15.webp',
  },
  config: {},
};

const ECOMMERCE_FASHION_HOME: ThemeContentResponse = {
  theme_key: 'ecommerce_fashion',
  page: 'home',
  content: {
    'header.brand_label': 'ATELIERRunway',
    'header.season_label': 'AUTUMN_WINTER_26',
    'hero.eyebrow': 'FALL_WINTER_2026_COLLECTION',
    'hero.title': 'Silent\nLuxury.',
    'hero.primary_cta_label': 'Explore Editorial',
    'hero.side_image_1_label': 'ACCESSORIES_01',
    'hero.side_image_2_label': 'READY_TO_WEAR_04',
    'collection.eyebrow': 'THE_AUTUMN_CAPSULE_V8',
    'collection.title': 'Lookbook 26.',
    'diagnostics.title': 'Atelier Node Connection Alert',
    'diagnostics.description': 'The dynamic Laravel API database is currently offline. Activating premium local node resilience fallback. Loading high-fidelity local catalog backups...',
    'philosophy.quote': 'We do not build garments. We architect confidence through the precision of silhouette and the purity of material.',
    'philosophy.eyebrow': 'ATELIER_PHILOSOPHY_SYNC',
    'footer.brand_label': 'ATELIER',
    'footer.description': 'We do not build garments. We architect confidence through the precision of silhouette and the purity of material.',
  },
  media: {
    'hero.image': '/themes/ecommerce/fashion/17.webp',
    'hero.side_image_1': '/themes/ecommerce/fashion/18.webp',
    'hero.side_image_2': '/themes/ecommerce/fashion/19.webp',
  },
  config: {},
};

const SERVICES_MARKETPLACE_HOME: ThemeContentResponse = {
  theme_key: 'services_marketplace',
  page: 'home',
  content: {
    'header.brand_label': 'ServiceConnect',
    'hero.title': 'Find Trusted Services Near You',
    'hero.description': 'Connecting you with skilled professionals, fast and reliably.',
    'hero.primary_cta_label': 'Browse Services',
    'hero.secondary_cta_label': 'Become a Provider',
    'search.placeholder': 'Search for services...',
    'categories.title': 'Popular Categories',
    'providers.title': 'Top Rated Professionals',
    'how_it_works.title': 'How It Works',
    'how_it_works.step_1_title': '1. Search Services',
    'how_it_works.step_1_description': 'Easily search through thousands of verified local professionals.',
    'how_it_works.step_2_title': '2. Compare Options',
    'how_it_works.step_2_description': 'Read reviews, compare prices, and check provider portfolios.',
    'how_it_works.step_3_title': '3. Hire Securely',
    'how_it_works.step_3_description': 'Book and pay securely through our trusted platform.',
    'testimonials.title': 'What Our Clients Say',
    'cta.title': 'Ready to Hire or Offer Services?',
    'cta.description': 'Join our growing community today and connect with thousands of users.',
    'cta.primary_cta_label': 'Find Services',
    'cta.secondary_cta_label': 'Offer Your Services',
    'footer.description': 'Your trusted marketplace for local services. Connecting quality professionals with clients who need them.',
    'footer.email': 'support@serviceconnect.com',
  },
  media: {},
  config: {},
};

const AUTOS_LUXURY_HOME: ThemeContentResponse = {
  theme_key: 'autos_luxury',
  page: 'home',
  content: {
    'header.brand_label': 'Velvet Wheels',
    'hero.title': 'Experience the Luxury You Deserve',
    'hero.description': 'Your journey into unparalleled elegance and performance starts here. Discover hand-picked masterpieces.',
    'hero.primary_cta_label': 'Explore Collection',
    'hero.secondary_cta_label': 'Book Now',
    'search.button_label': 'Search',
    'collection.title': 'Featured Masterpieces',
    'collection.view_all_label': 'View All Inventory',
    'showcase.title': 'Exclusive Showcase',
    'showcase.heading': 'The Crimson Legend',
    'showcase.subtitle': '1963 Ferrari 250 GTO',
    'showcase.description': 'A one-of-a-kind vintage masterpiece, meticulously restored. This vehicle represents automotive history and unparalleled exclusivity.',
    'showcase.cta_label': 'Inquire About Price',
    'brands.title': 'Our Curated Brands',
    'testimonials.title': 'Client Experiences',
    'footer.description': "Curating the world's finest automobiles for the most discerning clientele.",
  },
  media: {
    'showcase.image': '/themes/autos/luxury/ferrari.png',
  },
  config: {},
};

const JOBS_STARTUP_HOME: ThemeContentResponse = {
  theme_key: 'jobs_startup',
  page: 'home',
  content: {
    'header.brand_label': 'GROWTH_NODE.',
    'hero.eyebrow': 'SYNCHRONIZE_TALENT_V5',
    'hero.title': 'Join the\nHypergrowth.',
    'hero.description': "The high-fidelity distribution node for venture-backed talent. Connect your career node to the world's most innovative startup network.",
    'hero.primary_cta_label': 'EXPLORE_VENTURES',
    'hero.secondary_cta_label': 'VENTURE_CAPITAL_ACCESS',
    'trust.left_text': 'VENTURE_FUNDING_SYNC: ACTIVE',
    'trust.right_text': 'EQUITY_VERIFIED: TRUE',
    'trust.network_text': 'NETWORK_NODE: 5.0_ELITE',
    'stats.startups_value': '450+',
    'stats.startups_label': 'VERIFIED_STARTUPS',
    'stats.equity_value': '$1.2B+',
    'stats.equity_label': 'TOTAL_EQUITY_VALUE',
    'stats.connections_value': '12k+',
    'stats.connections_label': 'NODAL_CONNECTIONS',
    'mission.eyebrow': 'MISSION_CONTROL',
    'mission.title': 'Operational\nExcellence.',
    'mission.description': 'Every startup node in our network is verified for mission-readiness. We track real-time funding status, equity structures, and team logic to ensure you join only the highest-fidelity high-growth opportunities.',
    'mission.metric_1_value': '$4.2B',
    'mission.metric_1_label': 'TOTAL_VC_LIQUIDITY',
    'mission.metric_2_value': '12.4%',
    'mission.metric_2_label': 'AVG_EQUITY_POOL',
    'cta.title': 'Accelerate\nYour Future.',
    'cta.description': 'Initialize your professional growth node and gain access to high-fidelity equity structures and mission-critical roles.',
    'cta.button_label': 'INITIALIZE_GROWTH_NODE',
    'footer.description': "The world's most advanced high-fidelity startup distribution node. Synchronizing talent with high-growth capital.",
    'footer.copyright': '(c) 2026 GROWTH_NODE_SYSTEMS. ALL_SYSTEMS_GO.',
    'footer.version_label': 'v.4.2_ELITE_VC',
  },
  media: {
    'mission.image': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072',
  },
  config: {},
};

const CLASSIFIEDS_GENERAL_HOME: ThemeContentResponse = {
  theme_key: 'classifieds_general',
  page: 'home',
  content: {
    'header.brand_label': 'CLASAFIND',
    'search.placeholder': 'Search for anything...',
    'sidebar.categories_title': 'Explore Categories',
    'sidebar.filters_title': 'Filters',
    'filters.pickup_label': 'Local pickup only',
    'filters.delivery_label': 'Includes delivery',
    'filters.price_limit_label': 'Price Limit:',
    'filters.clear_label': 'Clear all filters',
    'collection.all_title': 'All Recommended Listings',
    'collection.category_suffix': 'Showcase',
    'collection.sort_label': 'Sort:',
    'collection.load_more_label': 'Load More Listings',
    'collection.loading_more_label': 'Syncing Classifieds...',
    'empty.title': 'No Listings Found',
    'empty.description': "We couldn't find items that match your current sidebar filters or search tags.",
    'empty.button_label': 'Reset Settings',
    'chat.placeholder': 'Type your offer or ask questions...',
    'footer.description': '2026 ClasaFind Classifieds Suite. All rights reserved. Engineered to Elite Standards.',
  },
  media: {},
  config: {},
};

const EVENTS_CLASSIC_HOME: ThemeContentResponse = {
  theme_key: 'events_classic',
  page: 'home',
  content: {
    'header.brand_label': 'LEGACYArts',
    'hero.title': 'Cultural\nHeritage.',
    'hero.description': "A curated distribution of the world's most significant cultural repertoire. Authenticated experiences for the discerning patron.",
    'hero.primary_cta_label': 'Explore Repertoire',
    'trust.items': 'AUTHENTIC_INSTITUTIONAL_NODES|CURATED_ARTISTIC_PROTOCOL|GLOBAL_CULTURAL_EXCHANGE|PATRON_PRIVACY_SECURED',
    'collection.eyebrow': 'OFFICIAL_CULTURAL_REGISTRY',
    'collection.title': 'The\nRepertoire.',
    'collection.description': "Our unified protocol synchronizes performance availability from the world's most significant institutional nodes.",
    'patron.eyebrow': 'PATRON_CIRCLE_PROTOCOL',
    'patron.title': "The Patron's\nCircle.",
    'patron.description': 'Join an exclusive network of cultural institutions and patrons. Support the arts through the Sellio Legacy protocol and gain early access to premieres.',
    'patron.perks': 'Priority_Box|Private_Galas|Voting_Rights|Archive_Access',
    'patron.card_title': 'Become a Patron.',
    'patron.card_description': 'Institutional inquiry nodes are currently active for the 2026/27 cycle. Submit your credentials for evaluation.',
    'patron.card_cta_label': 'Request Institutional Access',
    'footer.brand_label': 'LEGACY',
    'footer.description': "The world's most significant archive of cultural repertoire. Synchronizing institutional archives with global patron nodes.",
    'footer.copyright': '(c) 2026 SELLIO_LEGACY_ARTS // ARCHIVE_STABLE',
  },
  media: {},
  config: {},
};

const AUTOS_CLASSIC_HOME: ThemeContentResponse = {
  theme_key: 'autos_classic',
  page: 'home',
  content: {
    'header.brand_label': 'CLASSIC MOTORS',
    'hero.eyebrow': "The Collector's Choice",
    'hero.title': 'Discover Timeless Classics',
    'hero.description': "Your journey into automotive history begins here. Find, bid, or sell the world's most desired vintage automobiles.",
    'hero.primary_cta_label': 'Browse Showcase',
    'hero.secondary_cta_label': 'Live Auctions',
    'filters.title': 'Find Your Dream Classic',
    'filters.clear_label': 'Clear Filters',
    'filters.make_label': 'Make / Manufacturer',
    'filters.model_label': 'Model Series',
    'filters.year_label': 'Era / Year',
    'filters.price_label': 'Valuation Bracket',
    'collection.title': 'Featured Classics for Sale',
    'collection.count_label': 'Masterpieces',
    'empty.title': 'No Classics Found',
    'empty.description': 'No vintage automobiles matched your current search filters.',
    'empty.button_label': 'Reset Refinements',
    'auctions.title': 'Live Auction Spotlight',
    'about.title': 'Why Collect Classic Cars?',
    'about.description': 'More than just vehicles, classic cars are rolling investments, passionate hobbies, and tangible links to history.',
    'about.secondary_description': 'Each curve, engine note, and stitch of leather tells a story of innovation, design, and a bygone era. We connect discerning collectors with meticulously curated classics, ensuring authenticity, provenance, and investment quality.',
    'about.cta_label': 'Read Our Story',
    'footer.description': "The world's premier destination for buying and selling vintage and collector automobiles.",
    'footer.email': 'info@classicmotors.com',
    'footer.phone': '+1 (555) CLASSIC',
    'footer.copyright': '2026 Classic Motors. All rights reserved.',
  },
  media: {
    'about.image': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600',
  },
  config: {},
};

export function getThemeContentDefaults(themeKey?: string, page = 'home'): ThemeContentResponse {
  if (themeKey === 'properties_classic' && page === 'home') {
    return PROPERTIES_CLASSIC_HOME;
  }

  if (themeKey === 'events_music' && page === 'home') {
    return EVENTS_MUSIC_HOME;
  }

  if (themeKey === 'ecommerce_fashion' && page === 'home') {
    return ECOMMERCE_FASHION_HOME;
  }

  if (themeKey === 'services_marketplace' && page === 'home') {
    return SERVICES_MARKETPLACE_HOME;
  }

  if (themeKey === 'autos_luxury' && page === 'home') {
    return AUTOS_LUXURY_HOME;
  }

  if (themeKey === 'jobs_startup' && page === 'home') {
    return JOBS_STARTUP_HOME;
  }

  if (themeKey === 'classifieds_general' && page === 'home') {
    return CLASSIFIEDS_GENERAL_HOME;
  }

  if (themeKey === 'events_classic' && page === 'home') {
    return EVENTS_CLASSIC_HOME;
  }

  if (themeKey === 'autos_classic' && page === 'home') {
    return AUTOS_CLASSIC_HOME;
  }

  return {
    ...EMPTY_THEME_CONTENT,
    theme_key: themeKey ?? EMPTY_THEME_CONTENT.theme_key,
    page,
  };
}
