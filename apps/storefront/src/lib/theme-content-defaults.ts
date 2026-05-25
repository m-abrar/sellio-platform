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

const AUTOS_MODERN_HOME: ThemeContentResponse = {
  theme_key: 'autos_modern',
  page: 'home',
  content: {
    'header.brand_label': 'MODERN AUTOS',
    'hero.title': 'Drive the Future Today',
    'hero.description': 'Explore revolutionary vehicles and redefine your journey.',
    'hero.primary_cta_label': 'Browse Cars',
    'hero.secondary_cta_label': 'Compare Models',
    'search.placeholder': 'Search by Keyword...',
    'collection.title': 'Featured Electric & Modern Autos',
    'compare.title': 'Compare Top Models Head-to-Head',
    'compare.cta_label': 'Start Your Custom Comparison',
    'brands.title': 'Driving Innovation with Top Brands',
    'tech.title': 'Experience Next-Generation Technology',
    'tech.feature_1_title': 'Autonomous AI Driving',
    'tech.feature_1_description': 'Our vehicles are equipped with cutting-edge Level 3+ Autonomy, allowing for supervised self-driving on major highways. Experience a safer, more relaxed commute.',
    'tech.feature_1_secondary': 'Advanced sensor fusion, real-time mapping, and predictive algorithms ensure unparalleled safety and performance in various conditions.',
    'tech.feature_2_title': 'Hybrid & Electric Powertrains',
    'tech.feature_2_description': 'Choose from a selection of the most efficient Electric and Hybrid engines. Maximum performance meets minimal environmental impact.',
    'tech.feature_2_secondary': 'Innovative battery technology provides faster charging, longer range, and a dynamic driving feel, all backed by comprehensive warranties.',
    'footer.description': 'The future of mobility is here. Driven by technology, fueled by vision.',
    'footer.copyright': '2026 Modern Autos, Inc. All rights reserved.',
  },
  media: {
    'tech.feature_1_image': '/themes/autos/modern/16.webp',
    'tech.feature_2_image': '/themes/autos/modern/17.webp',
  },
  config: {},
};

const AUTOS_USED_HOME: ThemeContentResponse = {
  theme_key: 'autos_used',
  page: 'home',
  content: {
    'header.brand_label': 'DriveHub',
    'hero.title': 'Find Your Perfect Used Car Today',
    'hero.description': 'Trusted listings, verified sellers, and transparent pricing. Your next drive starts here.',
    'hero.primary_cta_label': 'Browse Catalog',
    'hero.secondary_cta_label': 'How It Works',
    'filters.title': 'Search Filters',
    'filters.clear_label': 'Clear All',
    'filters.make_label': 'Make / Brand',
    'filters.price_label': 'Price Budget',
    'filters.mileage_label': 'Odometer Mileage',
    'filters.location_label': 'Location / City',
    'collection.title': 'Featured Listings',
    'collection.count_label': 'Vehicles',
    'empty.title': 'No Vehicles Found',
    'empty.description': "We couldn't find any used cars matching your current search parameters.",
    'empty.button_label': 'Reset Filters',
    'deal.title': 'Deal of the Week!',
    'deal.badge': 'SAVE $3,000!',
    'deal.vehicle_title': '2021 Hyundai Elantra Limited',
    'deal.description': 'Low Mileage, Single Owner, Full Service History.',
    'deal.price': '$21,995',
    'deal.original_price': '$24,995',
    'deal.cta_label': 'Browse Available Showroom',
    'dealers.title': 'Trusted Dealers',
    'dealers.description': 'We partner with top-rated, verified dealerships to ensure a safe transaction.',
    'how_it_works.title': 'How It Works: 3 Simple Steps',
    'how_it_works.step_1_title': '1. Search & Filter',
    'how_it_works.step_1_description': 'Easily find your dream car with our powerful, intuitive search tools.',
    'how_it_works.step_2_title': '2. Contact & Schedule',
    'how_it_works.step_2_description': 'Pick your preferred dealer, schedule a dynamic test-drive with direct financing.',
    'how_it_works.step_3_title': '3. Drive Away Happy',
    'how_it_works.step_3_description': 'Take a test drive, finalize the digital deal, and hit the open road!',
    'footer.description': 'Your trusted marketplace for quality used vehicles.',
    'footer.email': 'info@drivehub.com',
    'footer.copyright': '2026 DriveHub Marketplace. All rights reserved.',
  },
  media: {
    'deal.image': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600',
  },
  config: {},
};

const EVENTS_CREATIVE_HOME: ThemeContentResponse = {
  theme_key: 'events_creative',
  page: 'home',
  content: {
    'header.brand_label': 'CREATIVENode',
    'hero.eyebrow': 'SYNTHETIC_CULTURE_EXCHANGE // 2026',
    'hero.title': 'Creative\nPulses.',
    'hero.description': 'A curated decentralized architecture for experimental audio-visual modules and algorithmic community assemblies.',
    'hero.primary_cta_label': 'Launch Labs',
    'collection.eyebrow': 'EXPERIMENTAL_EVENT_REGISTRY',
    'collection.title': 'Registry.',
    'collection.description': "Our unified decentralized distribution node synchronizes experimental availability from the world's most vibrant hubs.",
    'lab.eyebrow': 'LABORATORY_MANIFESTO',
    'lab.title': 'Synthetic\nArtistry.',
    'lab.description': 'We operate on the boundary of bio-digital synthesis. Elevating community interactions through raw algorithmic installations and real-time auditory sync.',
    'lab.capabilities': 'Synthetizers|Generators|Decentralizers|Transmitters',
    'sync.title': 'Node Sync Request',
    'sync.description': 'Transmission pathways are currently active for the autumn cluster. Submit your digital signature for synchronized resonance.',
    'sync.cta_label': 'Initiate Synchronous Wave',
    'footer.brand_label': 'CREATIVE',
    'footer.description': "The world's most vibrant distribution node for experimental event modules. Synchronizing creative pulses with global community nodes.",
    'footer.copyright': '(c) 2026 SELLIO_CREATIVE_NODE // PULSE_STABLE',
  },
  media: {},
  config: {},
};

const EVENTS_FESTIVAL_HOME: ThemeContentResponse = {
  theme_key: 'events_festival',
  page: 'home',
  content: {
    'header.brand_label': 'NEONPulse',
    'hero.eyebrow': 'THE_GLOBAL_COLLECTIVE_V8',
    'hero.title': 'Neon\nPulse.',
    'hero.description': 'The most immersive festival experiences on the planet. Curated, authenticated, and distributed via the Sellio Neon network.',
    'hero.primary_cta_label': 'Explore Lineup',
    'hero.secondary_cta_label': 'Join_The_Pulse',
    'collection.eyebrow': 'OFFICIAL_FESTIVAL_REGISTRY',
    'collection.title': 'Neon\nStages.',
    'collection.description': "Our unified protocol synchronizes high-vibe environments across the world's most significant neon nodes.",
    'cta.eyebrow': 'READY_TO_LOSE_CONTROL',
    'cta.title': 'The Season is Live.',
    'cta.highlight': 'Season',
    'cta.description': "The 2026/27 season is officially live. Secure your access to the world's most exclusive high-vibe environments before the node capacity is reached.",
    'cta.button_label': 'Secure Tickets Now',
    'footer.brand_label': 'NEON',
    'footer.description': "The world's most immersive distribution node for high-vibe environments. Synchronizing collective pulses with global neon nodes.",
    'footer.copyright': '(c) 2026 SELLIO_NEON_NODE // VIBE_STABLE',
  },
  media: {
    'hero.image': '/themes/events/festival/10.webp',
  },
  config: {},
};

const AUTOS_ELECTRIC_HOME: ThemeContentResponse = {
  theme_key: 'autos_electric',
  page: 'home',
  content: {
    'header.brand_label': 'EVOLVE',
    'header.brand_highlight': 'OLVE',
    'hero.title': 'The Future is Electric',
    'hero.highlight': 'Electric',
    'hero.description': 'Explore revolutionary vehicles and sustainable living. Experience peak performance with zero emissions.',
    'hero.primary_cta_label': 'Browse EVs',
    'hero.secondary_cta_label': 'Locate Charging',
    'filters.title': 'Quick Search',
    'collection.title': 'Featured EV Models',
    'collection.highlight': 'EV Models',
    'empty.title': 'No EV Models Match Search',
    'empty.description': 'Adjust price filters or clear the brand search to return to our electric grid.',
    'empty.button_label': 'Reset Refinements',
    'compare.title': 'Compare The Top EVs',
    'compare.highlight': 'Top EVs',
    'charging.title': 'An Expansive Charging Network',
    'charging.highlight': 'Charging Network',
    'charging.description': 'Never worry about range anxiety. Our marketplace integrates with thousands of Level 2 and DC Fast Charging stations globally. Find, reserve, and pay--all in one app.',
    'charging.cta_label': 'View Live Map',
    'sustainability.title': 'Sustainability Highlights',
    'sustainability.highlight': 'Highlights',
    'footer.description': 'Driving the future of sustainable mobility, one electric vehicle at a time.',
    'footer.copyright': '2026 EVOLVE Marketplace. All rights reserved. Powering the electric revolution.',
  },
  media: {},
  config: {},
};

const EVENTS_CORPORATE_HOME: ThemeContentResponse = {
  theme_key: 'events_corporate',
  page: 'home',
  content: {
    'header.brand_label': 'FORUM26',
    'header.brand_highlight': '26',
    'hero.eyebrow': 'WORLD_ENGINEERING_SUMMIT // 2026',
    'hero.title': 'The Future of\nStructural Excellence.',
    'hero.highlight': 'Structural',
    'hero.primary_cta_label': 'GET DELEGATE PASS',
    'hero.secondary_cta_label': 'VIEW FULL SCHEDULE',
    'catalog.eyebrow': 'CONVENTIONS_CATALOG // DIRECTORY',
    'catalog.title': 'Active Summits & Expos',
    'speakers.eyebrow': 'FACULTY_SYNC // 2026',
    'speakers.title': 'Distinguished Speakers',
    'agenda.eyebrow': 'CURATED_SCHEDULE // DAY_01',
    'agenda.title': 'The Agenda',
    'agenda.description': 'Four tracks of intense technical exploration, ranging from core infrastructure to product design philosophy.',
    'agenda.cta_label': 'DOWNLOAD FULL PROGRAM PDF',
    'cta.title': 'Secure Your\nSeat in History.',
    'cta.highlight': 'Seat in History.',
    'cta.description': 'Registration closes September 30. Join 5,000+ industry leaders for the most influential engineering event of the year.',
    'cta.button_label': 'RESERVE MY FORUM PASS',
    'footer.description': 'The premier global assembly for architectural engineering and distributed systems. Shaping the future of technical infrastructure.',
    'footer.email': 'support@forum26.com',
    'footer.location': 'San Francisco, CA',
    'footer.copyright': '© 2026 SELLIO_EVENTS_GRP',
  },
  media: {},
  config: {},
};

const JOBS_TECH_HOME: ThemeContentResponse = {
  theme_key: 'jobs_tech',
  page: 'home',
  content: {
    'header.brand_label': 'dev_jobs_',
    'header.brand_prefix': '>',
    'hero.title': 'Find the best tech jobs\nfor your stack.',
    'hero.highlight': 'best tech jobs',
    'hero.description': 'Connecting world-class developers with top-tier tech companies. Skip the recruiters and apply directly to the engineering team.',
    'search.placeholder': "grep -i 'React OR Go OR Rust'",
    'search.button_label': 'Search',
    'diagnostics.title': 'Recruiting Registry Offline // Engaging Local Backup',
    'diagnostics.description': 'A network latency exception was encountered while querying the active recruiting databases. dev_jobs_ has activated localized mock seeds to guarantee uninterrupted professional routing.',
    'filters.stack_title': 'Tech Stack',
    'filters.type_title': 'Job Type',
    'filters.location_title': 'Location',
    'collection.count_label': 'developer opportunities',
    'collection.refresh_label': './refresh_catalog.sh',
    'empty.title': 'No Developer Jobs Found',
    'empty.description': 'Adjust your grep filters or tags to search alternative developer channels.',
    'footer.description': 'The #1 job board for software engineers, product managers, and data scientists.',
    'footer.copyright': '© 2026 DevJobs. All rights reserved.',
  },
  media: {},
  config: {},
};

const JOBS_CORPORATE_HOME: ThemeContentResponse = {
  theme_key: 'jobs_corporate',
  page: 'home',
  content: {
    'header.brand_label': 'TalentCorp',
    'header.brand_highlight': 'Talent',
    'hero.title': 'Advance Your Corporate Career',
    'hero.description': 'Discover premium opportunities at Fortune 500 companies and high-growth enterprises worldwide.',
    'search.keyword_placeholder': 'Job title, keywords, or company',
    'search.location_placeholder': 'City, state, or Remote',
    'search.button_label': 'Search Jobs',
    'filters.job_type_title': 'Job Type',
    'filters.experience_title': 'Experience Level',
    'filters.work_model_title': 'Work Model',
    'dashboard.title': 'Get Discovered by Top Employers',
    'dashboard.description': 'Upload your resume and let recruiters come to you. Track applications in real-time.',
    'dashboard.primary_cta_label': 'Upload Resume',
    'dashboard.secondary_cta_label': 'View Tracker',
    'collection.title': 'Recommended for You',
    'collection.sort_relevant_label': 'Sort by: Most Relevant',
    'collection.sort_recent_label': 'Sort by: Most Recent',
    'collection.sort_salary_label': 'Sort by: Salary (High to Low)',
    'collection.load_more_label': 'Load More Results',
    'sync.offline_kicker': 'Job Sync Offline',
    'sync.offline_title': 'Recommended jobs could not be loaded.',
    'empty.kicker': 'Empty Job Registry',
    'empty.title': 'No live jobs are published yet.',
    'empty.description': 'Add job records in the backend and this corporate listing will hydrate automatically.',
    'footer.description': 'Empowering professionals and leading enterprises to connect seamlessly.',
    'footer.subscribe_title': 'Subscribe',
    'footer.subscribe_description': 'Get daily job alerts.',
    'footer.email_placeholder': 'Email',
    'footer.subscribe_button_label': 'Subscribe',
    'footer.copyright': '© 2026 TalentCorp Inc. All rights reserved.',
  },
  media: {},
  config: {},
};

const ECOMMERCE_DEFAULT_HOME: ThemeContentResponse = {
  theme_key: 'ecommerce_default',
  page: 'home',
  content: {
    'header.brand_label': 'SELLIOShop',
    'header.brand_highlight': 'Shop',
    'hero.eyebrow': 'SUMMER_COLLECTION_2026_V8',
    'hero.title': 'Refined\nEssentials for\nModern Life.',
    'hero.highlight': 'Modern Life.',
    'hero.description': 'Discover a curated selection of premium garments designed with a focus on silhouette, material, and enduring quality.',
    'hero.primary_cta_label': 'Shop Collection',
    'hero.feature_eyebrow': 'FEATURED_NODE',
    'hero.feature_title': 'Technical_Shell_v4',
    'collection.eyebrow': 'CURATED_PRODUCT_REGISTRY',
    'collection.title': 'New\nArrivals.',
    'collection.description': "Our unified protocol synchronizes product availability from the world's most significant garment nodes.",
    'sync.offline_kicker': 'PRODUCT_SYNC_OFFLINE',
    'sync.offline_title': 'Products could not be synchronized.',
    'empty.kicker': 'EMPTY_PRODUCT_REGISTRY',
    'empty.title': 'No live products are available yet.',
    'empty.description': 'Add product records in the backend and this collection will hydrate automatically.',
    'newsletter.eyebrow': 'JOIN_THE_COLLECTIVE',
    'newsletter.title': 'Stay In\nThe Loop.',
    'newsletter.description': 'Join our collective and be the first to know about new collection drops, exclusive events, and seasonal sales.',
    'newsletter.placeholder': 'ENTER_EMAIL_NODE',
    'newsletter.button_label': 'SUBSCRIBE',
    'footer.brand_label': 'SELLIO',
    'footer.description': "The world's most advanced transaction protocol for high-fidelity retail. Synchronizing refined essentials with global distribution nodes.",
    'footer.copyright': '© 2026 SELLIO_SHOP // TRANSACTION_SYNC_STABLE',
  },
  media: {
    'hero.image': '/themes/ecommerce/default/9.webp',
  },
  config: {},
};

const ECOMMERCE_ELECTRONICS_HOME: ThemeContentResponse = {
  theme_key: 'ecommerce_electronics',
  page: 'home',
  content: {
    'header.brand_label': 'NEURALGEAR',
    'header.brand_highlight': 'GEAR',
    'header.search_placeholder': 'Search components, devices...',
    'hero.badge': 'NEXT GEN RELEASE',
    'hero.title': 'QUANTUM\nPERFORMANCE',
    'hero.description': 'Experience untethered speed with the all-new line of RTX 50-Series Architecture. Built for the creators of tomorrow.',
    'hero.primary_cta_label': 'Shop Now',
    'hero.secondary_cta_label': 'View Specs',
    'diagnostics.title': 'DATABASE CONNECTION WARNING',
    'diagnostics.description': 'The dynamic Laravel API database is currently offline. Activating premium local node resilience fallback.',
    'trending.title': 'TRENDING HARDWARE',
    'promo.title': 'BUILD YOUR DREAM PC',
    'promo.description': 'Use our interactive 3D configurator to ensure 100% compatibility and visualize your custom rig before you buy.',
    'promo.cta_label': 'Launch Configurator',
    'peripherals.title': 'PRO PERIPHERALS',
    'footer.description': 'Next-generation hardware for builders, gamers, and creators. Power your future.',
    'footer.newsletter_title': 'Newsletter',
    'footer.newsletter_description': 'Get updates on latest drops and tech news.',
    'footer.email_placeholder': 'Email Address',
    'footer.subscribe_label': '→',
    'footer.copyright': '© 2026 NeuralGear Electronics. All rights reserved.',
  },
  media: {
    'hero.image': '/themes/ecommerce/electronics/29.webp',
    'promo.image': '/themes/ecommerce/electronics/30.webp',
  },
  config: {},
};

const ECOMMERCE_LUXURY_HOME: ThemeContentResponse = {
  theme_key: 'ecommerce_luxury',
  page: 'home',
  content: {
    'header.brand_label': 'AURELIA',
    'hero.subtitle': 'The High Jewelry Collection',
    'hero.title': 'CELESTIAL\nELEGANCE',
    'hero.primary_cta_label': 'Discover the Collection',
    'collection.title': 'Signature Creations',
    'collection.description': 'Exquisite craftsmanship meets timeless design',
    'collection.product_cta_label': 'View Piece',
    'collection.view_all_label': 'View All Masterpieces',
    'sync.offline_kicker': 'Collection Sync Offline',
    'sync.offline_title': 'Signature creations could not be loaded.',
    'empty.kicker': 'Private Catalog',
    'empty.title': 'No live masterpieces are published yet.',
    'empty.description': 'Add product records in the backend and this showcase will hydrate automatically.',
    'story.title': 'Artistry in Every Detail',
    'story.description': 'For over a century, our master artisans have poured their passion into every facet. We source only the rarest gems, setting them in designs that transcend time and trend. Experience the weight of true luxury.',
    'story.cta_label': 'Explore Our Heritage',
    'footer.description': 'Subscribe to receive updates on exclusive collections, private events, and our latest creations.',
    'footer.email_placeholder': 'Email Address',
    'footer.subscribe_label': 'Subscribe',
    'footer.copyright': '© 2026 Aurelia Maison. All Rights Reserved.',
  },
  media: {},
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

  if (themeKey === 'autos_modern' && page === 'home') {
    return AUTOS_MODERN_HOME;
  }

  if (themeKey === 'autos_used' && page === 'home') {
    return AUTOS_USED_HOME;
  }

  if (themeKey === 'events_creative' && page === 'home') {
    return EVENTS_CREATIVE_HOME;
  }

  if (themeKey === 'events_festival' && page === 'home') {
    return EVENTS_FESTIVAL_HOME;
  }

  if (themeKey === 'autos_electric' && page === 'home') {
    return AUTOS_ELECTRIC_HOME;
  }

  if (themeKey === 'events_corporate' && page === 'home') {
    return EVENTS_CORPORATE_HOME;
  }

  if (themeKey === 'jobs_tech' && page === 'home') {
    return JOBS_TECH_HOME;
  }

  if (themeKey === 'jobs_corporate' && page === 'home') {
    return JOBS_CORPORATE_HOME;
  }

  if (themeKey === 'ecommerce_default' && page === 'home') {
    return ECOMMERCE_DEFAULT_HOME;
  }

  if (themeKey === 'ecommerce_electronics' && page === 'home') {
    return ECOMMERCE_ELECTRONICS_HOME;
  }

  if (themeKey === 'ecommerce_luxury' && page === 'home') {
    return ECOMMERCE_LUXURY_HOME;
  }

  return {
    ...EMPTY_THEME_CONTENT,
    theme_key: themeKey ?? EMPTY_THEME_CONTENT.theme_key,
    page,
  };
}
