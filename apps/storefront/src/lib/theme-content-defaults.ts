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
    'footer.eyebrow': 'Global Registry // Footer',
    'footer.subscribe_text': 'Subscribe to our global heritage distribution protocol.',
    'footer.copyright': '© 2026 ESTATE & HERITAGE // GLOBAL REGISTRY',
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
    'header.season_label': 'Autumn / Winter 26',
    'hero.eyebrow': 'Fall / Winter 2026',
    'hero.title': 'Silent\nLuxury.',
    'hero.primary_cta_label': 'Explore Editorial',
    'hero.side_image_1_label': 'Accessories 01',
    'hero.side_image_2_label': 'Ready to Wear 04',
    'collection.eyebrow': 'Featured capsule',
    'collection.title': 'A tighter edit for the season.',
    'collection.description': 'A homepage edit of selected silhouettes. Browse the full archive when you are ready to see every available piece.',
    'diagnostics.title': 'Atelier Node Connection Alert',
    'diagnostics.description': 'The dynamic Laravel API database is currently offline. Activating premium local node resilience fallback. Loading high-fidelity local catalog backups...',
    'philosophy.quote': 'We do not build garments. We architect confidence through the precision of silhouette and the purity of material.',
    'philosophy.eyebrow': 'Atelier philosophy',
    'footer.brand_label': 'ATELIER',
    'footer.description': 'A refined fashion storefront for curated seasonal pieces, confident checkout, and considered client care.',
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

const CLASSIFIEDS_DEALS_HOME: ThemeContentResponse = {
  theme_key: 'classifieds_deals',
  page: 'home',
  content: {
    'diagnostics.title': 'DATABASE CONNECTION WARNING: Local catalog resilience fallback active',
    'trending.tag_label': 'Trending Deal Highlight',
    'trending.ends_label': '⏳ Ends:',
    'hot_bargains.title': 'HOT BARGAINS',
    'hot_bargains.subtitle': 'MAXIMUM DISCOUNTS EXCLUSIVES',
    'limited_deals.title': 'Limited-Time Deals',
    'limited_deals.subtitle': 'Active Drops',
    'limited_deals.sort_label': 'Sort by:',
    'collection.load_more_label': 'Load More Deals',
    'collection.loading_more_label': 'Loading Price Drops...',
    'sidebar.flash_sale.title': 'DAILY FLASH SALE!',
    'sidebar.flash_sale.subtitle': 'Super bargain lockouts',
    'sidebar.flash_sale.description': 'New extreme price drops will unlock once the countdown runs out!',
    'sidebar.flash_sale.button_label': 'Enter Flash Lounge ⚡',
    'sidebar.featured_sellers.title': 'Featured Sellers',
    'sidebar.ad.badge': 'SPONSORED PROMOTION',
    'sidebar.ad.title': 'Merchants Clearance Event',
    'sidebar.ad.desc': 'Overstock warehouses listing directly to local neighborhoods. Absolute rock-bottom bulk prices with next day shipping.',
    'sidebar.ad.button_label': 'Browse Warehouse Deals',
    'hero.slide_1.title': 'MacBook Pro 14" M3 Max',
    'hero.slide_1.desc': 'Apple M3 Max Chip with 14-Core CPU, 30-Core GPU, 1TB SSD. Extreme speed, deal limited to stock on hand.',
    'hero.slide_1.discount': '35',
    'hero.slide_1.priceNow': '$1,299.00',
    'hero.slide_1.priceWas': '$1,999.00',
    'hero.slide_1.button_label': 'Snag This Deal Now ⚡',
    'hero.slide_2.title': 'PlayStation 5 Console Slim',
    'hero.slide_2.desc': "Includes Marvel's Spider-Man 2 Full Game Voucher. Experience lightning-fast loading and deeper immersion.",
    'hero.slide_2.discount': '33',
    'hero.slide_2.priceNow': '$349.00',
    'hero.slide_2.priceWas': '$499.00',
    'hero.slide_2.button_label': 'Snag This Deal Now ⚡',
    'hero.slide_3.title': 'Sony WH-1000XM5 Headphones',
    'hero.slide_3.desc': 'Industry-leading noise canceling wireless headphones with crystal-clear hands-free calling and sleek comfort.',
    'hero.slide_3.discount': '45',
    'hero.slide_3.priceNow': '$219.00',
    'hero.slide_3.priceWas': '$399.00',
    'hero.slide_3.button_label': 'Snag This Deal Now ⚡',
  },
  media: {
    'hero.slide_1.image': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600',
    'hero.slide_2.image': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600',
    'hero.slide_3.image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600',
  },
  config: {},
};

const CLASSIFIEDS_ELITE_HOME: ThemeContentResponse = {
  theme_key: 'classifieds_elite',
  page: 'home',
  content: {
    'hero.subtitle': 'Vetted Global Advisory Node',
    'hero.title': 'Curating high-value vaults for serious collectors.',
    'hero.search_placeholder': 'Search by collection title, artist, country origin...',
    'hero.search_button': 'Search',
    'diagnostics.title': 'VAULT RESILIENCE LAYER: Private Catalog Backups Engaged',
    'diagnostics.trace': 'Axios connection refused. Sandboxed database unreachable. Displaying curated assets.',
    'spotlight.tag': 'CURATED SPOTLIGHT OF THE WEEK',
    'spotlight.title': 'Featured High-Value Acquisitions',
    'catalog.eyebrow': 'Browse Curated Catalog',
    'catalog.title': 'Exclusive Acquisitions',
    'empty.title': 'No Curated Assets Match Search',
    'empty.description': 'Try clearing keywords or switching filter pills to display our private listings feed.',
    'empty.clear_button': 'Clear Refinements',
    'quickview.prospectus_button': 'Request Prospectus memorandum',
    'quickview.inquiry_button': 'Inquire Concierge Vault',
  },
  media: {},
  config: {},
};

const CLASSIFIEDS_LOCAL_HOME: ThemeContentResponse = {
  theme_key: 'classifieds_local',
  page: 'home',
  content: {
    'panel.title': 'Nearby Classifieds',
    'diagnostics.title': '🛰️ VETTED NETWORK DIAGNOSTICS & RESILIENCE PANEL',
    'diagnostics.description': 'Status: Local Database Node Offline. Activating Vetted neighborhood backup feed.',
    'alerts.title': 'Neighborhood Alerts',
    'alerts.item_1': 'Featured Offer: Like-New Trek Mountain Bike in Bikes & Outdoor is trending near Capitol Hill!',
    'alerts.item_2': "Lost Dog: Golden Retriever spotted near Cal Anderson Park. Collar says 'Max'. Contact Agent Sarah.",
    'empty.title': 'No Neighbors Listing Here',
    'empty.description': 'Expand your search radius in the header location tag to discover more items!',
    'radius.expand_label': 'Expand Search Radius',
  },
  media: {},
  config: {},
};

const CLASSIFIEDS_MODERN_HOME: ThemeContentResponse = {
  theme_key: 'classifieds_modern',
  page: 'home',
  content: {
    'hero.title': 'Discover the best things to buy, sell, and trade.',
    'hero.search_placeholder': 'What are you looking for today? (e.g. camera, table, jacket)',
    'hero.search_button': 'Search',
    'diagnostics.title': 'DATABASE OFFLINE: Resilient catalog backups activated',
    'diagnostics.trace': 'Axios connection timeout. Displaying live catalog backups.',
    'feed.title': 'Fresh Recommendations',
    'empty.title': 'No Listings Matching Search',
    'empty.description': "We couldn't find items that match your tags or keyword search query.",
    'empty.button_label': 'Reset Settings',
    'collection.load_more_label': 'Load More Items',
    'collection.loading_more_label': 'Retrieving listings...',
    'quickview.message_seller_label': 'Message Seller',
    'quickview.view_details_label': 'View Full Details',
  },
  media: {},
  config: {},
};

const CLASSIFIEDS_PREMIUM_HOME: ThemeContentResponse = {
  theme_key: 'classifieds_premium',
  page: 'home',
  content: {
    'diagnostics.title': '🛰️ VETTED NETWORK DIAGNOSTICS & RESILIENCE PANEL',
    'diagnostics.description': 'Status: Local Database Node Offline. Activating Vetted sovereign proxy backup assets gracefully.',
    'featured_header.title': '💎 Featured Investment Opportunities',
    'featured_header.empty': 'No featured opportunities match your refinements.',
    'membership.title': 'UNLOCK PREMIUM PRIVATE OPPORTUNITIES',
    'membership.subtitle': 'Gain verified access to institutional-grade M&A prospectuses, audit-vetted tax returns, and coordinate direct negotiations with certified investment brokers.',
    'membership.button_label': 'Explore Membership Tiers',
    'toolbar.title_label': 'Available Listings',
    'toolbar.opportunities_suffix': 'opportunities',
    'toolbar.grid_view_label': 'Grid View',
    'toolbar.list_view_label': 'List View',
    'empty.title': 'No Private Listings Found',
    'empty.description': 'Try clearing price ranges or location strings to expand search bounds.',
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
    'hero.eyebrow': 'New season essentials',
    'hero.title': 'Refined\nEssentials for\nModern Life.',
    'hero.highlight': 'Modern Life.',
    'hero.description': 'Discover a curated selection of premium garments designed with a focus on silhouette, material, and enduring quality.',
    'hero.primary_cta_label': 'Shop Collection',
    'hero.feature_eyebrow': 'Featured pick',
    'hero.feature_title': 'Modern wardrobe staples',
    'collection.eyebrow': 'Fresh arrivals',
    'collection.title': 'New\nArrivals.',
    'collection.description': 'Browse live products with clear pricing, stock signals, categories, and direct product detail pages.',
    'sync.offline_kicker': 'Catalog unavailable',
    'sync.offline_title': 'Products could not be loaded.',
    'empty.kicker': 'Empty catalog',
    'empty.title': 'No live products are available yet.',
    'empty.description': 'Add product records in the backend and this collection will hydrate automatically.',
    'newsletter.eyebrow': 'Shop updates',
    'newsletter.title': 'Stay In\nThe Loop.',
    'newsletter.description': 'Join our collective and be the first to know about new collection drops, exclusive events, and seasonal sales.',
    'newsletter.placeholder': 'Enter your email',
    'newsletter.button_label': 'Subscribe',
    'footer.brand_label': 'SELLIO',
    'footer.description': 'A polished ecommerce storefront for live products, clear inventory, smooth cart flow, and confident checkout.',
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

const SERVICES_CORPORATE_HOME: ThemeContentResponse = {
  theme_key: 'services_corporate',
  page: 'home',
  content: {
    'header.brand_label': 'CorporateServices',
    'hero.title': 'Empowering Businesses\nfor Growth',
    'hero.description': 'Strategic insights and innovative solutions to drive your success forward.',
    'hero.primary_cta_label': 'Explore Services',
    'hero.secondary_cta_label': 'Get in Touch',
    'services.title': 'Our Core Services',
    'services.description': 'Solutions designed to meet your unique business challenges.',
    'about.title': 'Why Partner with Us?',
    'about.description': 'We are committed to delivering exceptional value through our deep expertise and client-centric approach.',
    'case_studies.title': 'Our Success Stories',
    'case_studies.description': 'Real-world impact of our strategic partnerships.',
    'cta.title': 'Ready to Transform Your Business?',
    'cta.description': 'Connect with our experts today to discuss your specific needs and goals.',
    'cta.primary_cta_label': 'Request a Consultation',
    'footer.description': 'Providing strategic consulting and innovative solutions to drive business growth and success.',
  },
  media: {
    'about.image': '/themes/services/corporate/11.webp',
  },
  config: {},
};

const SERVICES_CREATIVE_HOME: ThemeContentResponse = {
  theme_key: 'services_creative',
  page: 'home',
  content: {
    'header.brand_label': 'CRTV',
    'hero.title': 'Hire Creative Talent Worldwide',
    'hero.description': 'Discover exceptional freelancers for your projects, from design to development.',
    'hero.primary_cta_label': 'Browse Creatives',
    'hero.secondary_cta_label': 'Showcase Your Work',
    'categories.title': 'Featured Creative Categories',
    'creatives.title': 'Meet Our Top Creatives',
    'showcase.title': 'Inspiring Portfolio Showcase',
    'cta.title': 'Ready to Hire or Get Hired?',
    'cta.description': 'Join the Creative Community Today and turn your vision into reality.',
    'cta.primary_cta_label': 'Sign Up Now',
    'footer.description': "Connecting visionary clients with the world's finest creative talent.",
  },
  media: {},
  config: {},
};

const SERVICES_HEALTH_HOME: ThemeContentResponse = {
  theme_key: 'services_health',
  page: 'home',
  content: {
    'hero.kicker': 'VITALITY PROTOCOL',
    'hero.title': 'Precision\nMedicine,\nDelivered.',
    'hero.description': 'Connect with an elite network of specialists and diagnosticians. We engineer personalized physiological protocols for peak human performance.',
    'hero.primary_cta_label': 'INITIALIZE CONSULTATION',
    'hero.secondary_cta_label': 'VIEW CLINICIANS',
    'hud.practitioners_label': 'PRACTITIONERS',
    'hud.practitioners_sub': 'Vetted specialists active across our global clinical network.',
    'hud.accuracy_label': 'ACCURACY',
    'hud.accuracy_sub': 'High-fidelity data synchronization for real-time monitoring.',
    'hud.response_label': 'RESPONSE RATE',
    'hud.response_sub': 'Instant consultation availability for critical wellness nodes.',
    'registry.kicker': 'OFFICIAL REGISTRY',
    'registry.title': 'Top Rated\nPractitioners.',
    'registry.description': 'Our unified protocol vetting process ensures that every specialist on the node meets our high-fidelity clinical standards.',
    'protocols.kicker': 'CLINICAL TIERS',
    'protocols.title': 'Optimized\nPhysiology.',
    'protocols.description': 'Move beyond reactive care. Our elite protocols integrate preventive diagnostics, continuous biomarker tracking, and personalized nutritional algorithms.',
  },
  media: {},
  config: {},
};

const SERVICES_LOCAL_HOME: ThemeContentResponse = {
  theme_key: 'services_local',
  page: 'home',
  content: {
    'hero.title': 'Trusted Services for\nYour Home & Family',
    'hero.description': 'Find background-checked professionals for cleaning, repair, maintenance, and more—all in one place.',
    'hero.primary_cta_label': 'Explore Services',
    'hero.secondary_cta_label': 'Read Testimonials',
    'services.title': 'Our Popular Services',
    'providers.title': 'Meet Our Top-Rated Providers',
    'how_it_works.title': 'How HomeFix Works in 3 Simple Steps',
    'how_it_works.step_1_title': '1. Search & Filter',
    'how_it_works.step_1_description': 'Easily find the service you need by location, type, and availability using our smart filters.',
    'how_it_works.step_2_title': '2. Book & Confirm',
    'how_it_works.step_2_description': 'Select a top-rated professional and instantly book a time slot that works for your schedule.',
    'how_it_works.step_3_title': '3. Relax & Enjoy',
    'how_it_works.step_3_description': 'A trusted pro arrives, gets the job done right, and you rate your experience. Simple as that!',
    'safety.title': 'Your Safety is Our Priority',
    'safety.step_1_title': 'Background-Checked',
    'safety.step_1_description': 'Every professional is vetted for your peace of mind.',
    'safety.step_2_title': 'Insured & Guaranteed',
    'safety.step_2_description': 'Workmanship is covered by our service guarantee.',
    'safety.step_3_title': '24/7 Support',
    'safety.step_3_description': 'Help is always just a call or click away, day or night.',
  },
  media: {},
  config: {},
};

const JOBS_BLUE_COLLAR_HOME: ThemeContentResponse = {
  theme_key: 'jobs_blue_collar',
  page: 'home',
  content: {
    'hero.title': 'Hard Work\nPays Off.',
    'hero.description': 'Find high-paying jobs in construction, manufacturing, transportation, and skilled trades. No desk required.',
    'trades.title': 'Browse By Trade',
    'jobs.title': 'Latest Openings',
    'jobs.load_more_label': 'Load More Jobs',
    'cta.title': 'Need Workers Fast?',
    'cta.description': 'Access our database of over 50,000 certified tradespeople ready to start tomorrow.',
    'cta.button_label': 'Post Your Job Now',
  },
  media: {},
  config: {},
};

const JOBS_FREELANCE_HOME: ThemeContentResponse = {
  theme_key: 'jobs_freelance',
  page: 'home',
  content: {
    'hero.title': 'Find the perfect freelance services\nfor your business',
    'gigs.title': 'Popular professional services',
    'promo.title': 'A whole world of freelance talent at your fingertips',
    'promo.button_label': 'Explore GigHive Pro',
  },
  media: {
    'promo.image': '/themes/jobs/freelance/14.webp',
  },
  config: {},
};

const JOBS_MODERN_HOME: ThemeContentResponse = {
  theme_key: 'jobs_modern',
  page: 'home',
  content: {
    'hero.badge': '🚀 Over 10,000+ new roles added this week',
    'hero.title': 'Find work that\nmatches your ambition.',
    'hero.description': 'The modern way to discover roles at innovative startups and world-class tech companies.',
    'stats.users_value': '2M+',
    'stats.users_label': 'Active Users',
    'stats.companies_value': '50k',
    'stats.companies_label': 'Companies',
    'stats.salary_value': '$120k',
    'stats.salary_label': 'Avg Salary',
    'jobs.title': 'Curated for you',
    'jobs.view_all_label': 'View All Roles',
  },
  media: {},
  config: {},
};

const UNIFIEDS_CLASSIC_HOME: ThemeContentResponse = {
  theme_key: 'unifieds_classic',
  page: 'home',
  content: {
    'hero.eyebrow': 'TRADITION_OF_EXCELLENCE',
    'hero.title': 'The Heritage of\nDistribution.',
    'hero.highlight': 'Heritage',
    'hero.description': 'A high-fidelity foundational node for multi-vertical commerce. Established on the principles of structural integrity and global reliability.',
    'hero.primary_cta_label': 'ENTER THE ARCHIVE',
    'hero.secondary_cta_label': 'READ THE CHRONICLES',
    'collection.eyebrow': 'LIVE_HERITAGE_REGISTRY',
    'collection.title': 'The Catalog Archive.',
    'collection.description': 'Live product records preserved inside the Legacy Registry for dignified marketplace discovery.',
    'sync.offline_kicker': 'ARCHIVE_OFFLINE',
    'sync.offline_title': 'Listings could not be synchronized.',
    'empty.kicker': 'EMPTY_ARCHIVE',
    'empty.title': 'No live listings are available yet.',
    'empty.description': 'Add product records in the backend and this archive will hydrate automatically.',
    'mid_section.eyebrow': 'TIME_HONORED_PRECISION',
    'mid_section.title': 'Structural\nElegance.',
    'mid_section.description': 'The Legacy Node protocol is built on a foundation of reliability. By blending traditional structural integrity with modern distribution logic, we ensure that your high-fidelity assets remain secure and accessible across the global network.',
    'mid_section.metric_1_value': '30yr+',
    'mid_section.metric_1_label': 'CORE_LOGIC_AGE',
    'mid_section.metric_2_value': '100%',
    'mid_section.metric_2_label': 'ASSET_PROVENANCE',
    'cta.title': 'Establish Your\nLegacy.',
    'cta.description': "Connect your core node to the Legacy Registry and join the world's most trusted high-fidelity distribution network. Institutional authority, guaranteed.",
    'cta.button_label': 'CONNECT LEGACY NODE',
  },
  media: {
    'mid_section.image': '/themes/unifieds/classic/1.webp',
  },
  config: {},
};

const UNIFIEDS_DEFAULT_HOME: ThemeContentResponse = {
  theme_key: 'unifieds_default',
  page: 'home',
  content: {
    'hero.eyebrow': 'FOUNDATIONAL_DISTRIBUTION_V1',
    'hero.title': 'The Core of\nDistribution.',
    'hero.highlight': 'Distribution.',
    'hero.description': "A high-fidelity foundational node for multi-vertical commerce. Standardize your global presence with Sellio's most trusted high-performance engine.",
    'hero.primary_cta_label': 'GET STARTED CORE',
    'hero.secondary_cta_label': 'READ THE SPEC',
    'hero.badge_value': '50/50',
    'hero.badge_label': 'VERTICALLY_READY',
    'stats.metric_1_value': '99.9%',
    'stats.metric_1_label': 'UPTIME_GUARANTEE',
    'stats.metric_2_value': '1.4M+',
    'stats.metric_2_label': 'GLOBAL_NODES',
    'stats.metric_3_value': '8ms',
    'stats.metric_3_label': 'AVERAGE_LATENCY',
    'collection.eyebrow': 'LIVE_REGISTRY',
    'collection.title': 'Core Listings Feed.',
    'collection.description': 'Live marketplace records synchronized from the Sellio product catalog and curated for enterprise-grade discovery.',
    'sync.offline_kicker': 'REGISTRY_OFFLINE',
    'sync.offline_title': 'Listings could not be synchronized.',
    'empty.kicker': 'EMPTY_REGISTRY',
    'empty.title': 'No live listings are available yet.',
    'empty.description': 'Add product records in the backend and this feed will hydrate automatically.',
    'cta.title': 'Scale with the\nFoundation.',
    'cta.description': "Initialize your core node and join the world's most stable high-fidelity distribution network. Institutional grade performance, guaranteed.",
    'cta.button_label': 'INITIALIZE CORE NODE',
  },
  media: {
    'hero.image': '/themes/unifieds/default/1.webp',
  },
  config: {},
};

const UNIFIEDS_INTERACTIVE_HOME: ThemeContentResponse = {
  theme_key: 'unifieds_interactive',
  page: 'home',
  content: {
    'hero.eyebrow': 'KINETIC_TRANSMISSION_V4',
    'hero.title': 'Fluid\nDynamics.',
    'hero.highlight': 'Dynamics.',
    'hero.description': 'The high-fidelity interaction node for multi-vertical commerce. Synchronize your digital distribution through fluid logic and kinetic transitions.',
    'hero.primary_cta_label': 'INITIALIZE SYNC',
    'hero.secondary_cta_label': 'READ THE DYNAMICS',
    'collection.eyebrow': 'LIVE_MOTION_FEED',
    'collection.title': 'Kinetic Listings.',
    'collection.description': 'Live product records synchronized into the Motion Node catalog for fast, fluid marketplace discovery.',
    'sync.offline_kicker': 'MOTION_OFFLINE',
    'sync.offline_title': 'Listings could not be synchronized.',
    'empty.kicker': 'EMPTY_MOTION_FEED',
    'empty.title': 'No live listings are available yet.',
    'empty.description': 'Add product records in the backend and this motion feed will hydrate automatically.',
    'mid_section.title': 'The Speed\nof Logic.',
    'mid_section.description': 'Every interaction is a node. Every motion is a transition. Our high-fidelity protocol ensures that your digital distribution is as fluid as it is performant.',
    'cta.title': 'Ready to\nTransition?',
    'cta.description': "Connect your interaction node to the world's most advanced high-fidelity distribution network. Precision motion, guaranteed.",
    'cta.button_label': 'CONNECT MOTION NODE',
  },
  media: {
    'mid_section.image': '/themes/unifieds/interactive/1.webp',
  },
  config: {},
};

const UNIFIEDS_MARKETPLACE_HOME: ThemeContentResponse = {
  theme_key: 'unifieds_marketplace',
  page: 'home',
  content: {
    'site_name': 'MarketHub',
    'footer.brand_description': 'The all-in-one marketplace for properties, vehicles, services, jobs, events, and classifieds.',
    'hero.eyebrow': 'Marketplace hub',
    'hero.title': 'Browse every marketplace in one place.',
    'hero.highlight': 'marketplace.',
    'hero.description': 'Find products, properties, cars, services, jobs, events, and classifieds from one polished Sellio storefront.',
    'hero.primary_cta_label': 'Explore listings',
    'hero.secondary_cta_label': 'View categories',
    'collection.eyebrow': 'Featured listings',
    'collection.title': 'Featured listings',
    'collection.description': 'Fresh listings from your Sellio catalog.',
    'sync.offline_kicker': 'Marketplace offline',
    'sync.offline_title': 'Listings could not be loaded.',
    'empty.kicker': 'Empty marketplace',
    'empty.title': 'No live listings are available yet.',
    'empty.description': 'Add product records in the backend and this marketplace will populate automatically.',
    'mid_section.eyebrow': 'Top-rated sellers',
    'mid_section.title': 'Trusted\nmarketplace.',
    'mid_section.description': 'Search first, scan featured listings, browse categories, and move into details without friction.',
    'mid_section.metric_1_value': '4.9/5',
    'mid_section.metric_1_label': 'Average rating',
    'mid_section.metric_2_value': '24/7',
    'mid_section.metric_2_label': 'Marketplace discovery',
    'cta.title': 'Browse the\nmarketplace.',
    'cta.description': 'Explore products, properties, services, jobs, events, vehicles, and classifieds from one Sellio demo.',
    'cta.button_label': 'Browse marketplace',
  },
  media: {
    'mid_section.image': '/themes/unifieds/marketplace/1.webp',
  },
  config: {},
};

const UNIFIEDS_MEGA_HOME: ThemeContentResponse = {
  theme_key: 'unifieds_mega',
  page: 'home',
  content: {
    'hero.eyebrow': 'HEAVYWEIGHT_LOGIC_ACTIVE',
    'hero.title': 'The Heavyweight\nGrid.',
    'hero.highlight': 'Heavyweight',
    'hero.description': "The world's most powerful high-fidelity distribution node. Precision structural engineering for multi-vertical commerce at massive scale.",
    'hero.primary_cta_label': 'INITIALIZE MEGA SYNC',
    'hero.secondary_cta_label': 'INFRASTRUCTURE SPEC',
    'collection.eyebrow': 'LIVE_MEGA_EXCHANGE',
    'collection.title': 'Heavyweight Listings.',
    'collection.description': 'Live product records reinforced inside the Mega Grid catalog layer for high-volume marketplace distribution.',
    'sync.offline_kicker': 'GRID_OFFLINE',
    'sync.offline_title': 'Listings could not be synchronized.',
    'empty.kicker': 'EMPTY_GRID',
    'empty.title': 'No live listings are available yet.',
    'empty.description': 'Add product records in the backend and this grid will hydrate automatically.',
    'mid_section.eyebrow': 'INDUSTRIAL_STRENGTH',
    'mid_section.title': 'Structural\nAuthority.',
    'mid_section.description': 'The Mega Grid protocol is built for high-density data distribution. Every node is reinforced with multi-layer redundancy, ensuring that your storefront remains stable under any operational volume.',
    'mid_section.metric_1_value': '8ms',
    'mid_section.metric_1_label': 'CORE_LATENCY',
    'mid_section.metric_2_value': '99.9%',
    'mid_section.metric_2_label': 'NODAL_UPTIME',
    'cta.title': 'Authorize\nDistribution.',
    'cta.description': "Connect your core node to the Mega Grid and join the world's most robust high-fidelity distribution network. Institutional performance, guaranteed.",
    'cta.button_label': 'INITIALIZE HEAVYWEIGHT NODE',
  },
  media: {
    'mid_section.image': '/themes/unifieds/mega/1.webp',
  },
  config: {},
};

const UNIFIEDS_MINIMAL_HOME: ThemeContentResponse = {
  theme_key: 'unifieds_minimal',
  page: 'home',
  content: {
    'hero.eyebrow': 'UNIVERSAL MINIMALISM',
    'hero.title': 'Discover the Art\nof Simplicity.',
    'hero.highlight': 'Simplicity.',
    'hero.description': 'Your marketplace, meticulously curated and thoughtfully designed for elegance, clarity, and focus.',
    'hero.primary_cta_label': 'Explore Listings',
    'hero.secondary_cta_label': 'Start Exploring',
    'curated.title': 'Curated Highlights',
    'curated.description': 'A selection of premium listings that embody quality and minimalist elegance.',
    'explore.title': 'Explore with Focus',
    'explore.description': 'Navigate our marketplace using clear, icon-driven categories.',
    'journal.quote': '"The marketplace we needed—calm, confident, and focused purely on quality."',
    'journal.author': '— A Leading Design Journal',
    'cta.title': 'Ready for the Universal Experience?',
    'cta.description': 'List your first item or find your next essential.',
    'cta.button_label': 'Get Started Today',
  },
  media: {},
  config: {},
};

const UNIFIEDS_MODERN_HOME: ThemeContentResponse = {
  theme_key: 'unifieds_modern',
  page: 'home',
  content: {
    'hero.eyebrow': 'CORE_V4_PROTOCOL',
    'hero.title': 'Beyond\nStandard.',
    'hero.highlight': 'Standard.',
    'hero.description': 'The high-fidelity distribution node for multi-vertical commerce. Standardize your presence across 50 industries with a single, unified engine.',
    'hero.primary_cta_label': 'INITIALIZE NODE',
    'hero.secondary_cta_label': 'VIEW ARCHITECTURE',
    'collection.eyebrow': 'LIVE_NEXUS_FEED',
    'collection.title': 'Synchronized Listings.',
    'collection.description': 'Live product records streamed into the Nexus Prime catalog layer for high-fidelity marketplace discovery.',
    'sync.offline_kicker': 'NEXUS_OFFLINE',
    'sync.offline_title': 'Listings could not be synchronized.',
    'empty.kicker': 'EMPTY_NEXUS',
    'empty.title': 'No live listings are available yet.',
    'empty.description': 'Add product records in the backend and this feed will hydrate automatically.',
    'mid_section.title': 'The Power\nof Fifty.',
    'mid_section.description': 'Why build fifty themes when you can deploy one engine? Our vertical-specific DNA ensures that every storefront feels bespoke, while sharing the robust high-fidelity logic of the Nexus Prime core.',
    'cta.title': 'Ready to\nsynchronize?',
    'cta.description': "Initialize your high-fidelity storefront node and join the world's most advanced distribution network.",
    'cta.button_label': 'CONNECT CORE NODE',
  },
  media: {
    'mid_section.image': '/themes/unifieds/modern/1.webp',
  },
  config: {},
};

const UNIFIEDS_STANDARD_HOME: ThemeContentResponse = {
  theme_key: 'unifieds_standard',
  page: 'home',
  content: {
    'hero.eyebrow': 'MODULAR_DISTRIBUTION_V1',
    'hero.title': 'The Scale\nProtocol.',
    'hero.highlight': 'Scale',
    'hero.description': "The world's most efficient high-fidelity distribution node. Modular, precise, and engineered for global multi-vertical commerce.",
    'hero.primary_cta_label': 'INITIALIZE NODE',
    'hero.secondary_cta_label': 'VIEW DOCUMENTATION',
    'layers.title': 'Universal Logic Layers.',
    'collection.eyebrow': 'LIVE_EXCHANGE',
    'collection.title': 'Standard Listings Exchange.',
    'collection.description': 'Live product records synchronized into the Scale Protocol for clean, modular marketplace discovery.',
    'sync.offline_kicker': 'EXCHANGE_OFFLINE',
    'sync.offline_title': 'Listings could not be synchronized.',
    'empty.kicker': 'EMPTY_EXCHANGE',
    'empty.title': 'No live listings are available yet.',
    'empty.description': 'Add product records in the backend and this exchange will hydrate automatically.',
    'mid_section.eyebrow': 'GEOMETRIC_PRECISION',
    'mid_section.title': 'Modular\nEfficiency.',
    'mid_section.description': 'Every node in the Scale Protocol is designed for maximum efficiency. By isolating architectural layers and standardizing data mapping, we achieve a distribution latency that is unmatched in the multi-vertical market.',
    'mid_section.metric_1_value': '6ms',
    'mid_section.metric_1_label': 'AVERAGE_SYNC',
    'mid_section.metric_2_value': '100%',
    'mid_section.metric_2_label': 'ISO_COMPLIANCE',
    'cta.title': 'Initialize the\nStandard.',
    'cta.description': "Connect your professional node to the Scale Protocol and gain access to the world's most efficient high-fidelity distribution network.",
    'cta.button_label': 'CONNECT SCALE NODE',
  },
  media: {
    'mid_section.image': '/themes/unifieds/standard/1.webp',
  },
  config: {},
};

const PROPERTIES_COMMERCIAL_HOME: ThemeContentResponse = {
  theme_key: 'properties_commercial',
  page: 'home',
  content: {
    'hero.kicker': 'COMMERCIAL_REGISTRY_V8_DISTRIBUTION',
    'hero.title': 'Market \nTransparency \nEngineered.',
    'hero.highlight': 'Engineered.',
    'hero.description': 'The authoritative commercial registry providing verified yield data and direct access to institutional-grade real estate assets globally.',
    'hero.stat_value': '$1.4B',
    'hero.stat_label': 'QUARTERLY_TURNOVER',
    'hero.primary_cta_label': 'Explore_Inventory',
    'hero.secondary_cta_label': 'Request_Appraisal',
    'intelligence.title': 'The Intelligence \nBehind the Asset.',
    'intelligence.description': 'Every asset in our registry undergoes a multi-point verification protocol, including structural audits, zoning compliance checks, and high-fidelity market yield analysis.',
    'hud.due_diligence_label': 'DUE_DILIGENCE_SPEED',
    'hud.due_diligence_value': '48h',
    'hud.avg_yield_label': 'AVG_YIELD_v2026',
    'hud.avg_yield_value': '12%',
    'hud.global_nodes_label': 'GLOBAL_NODES',
    'diagnostics.kicker': 'CONNECTION_OFFLINE_DIAGNOSTICS',
    'diagnostics.text_before': 'The live Commercial registry API node threw a ',
    'diagnostics.text_after': '. Successfully initialized high-fidelity mock blueprints.',
    'inventory.kicker': 'INSTITUTIONAL_INVENTORY',
    'inventory.title': 'Asset \nRegistry.',
    'inventory.description': 'Our unified protocol synchronizes performance data from prime office, industrial, and retail assets into a single authoritative node.',
    'filters.search_label': 'SEARCH_QUERY',
    'filters.search_placeholder': 'Scan by keyword or location...',
    'filters.type_label': 'ASSET_CLASSIFICATION',
    'filters.status_label': 'ACQUISITION_STATUS',
    'empty.kicker': 'REGISTRY_RESOLVE_NULL',
    'empty.title': 'No Assets Resolved',
    'empty.description': 'Adjust your classification or acquisition status to recheck active ledger items.',
    'trust.label': 'AS_FEATURED_IN:',
    'cta.kicker': 'INSTITUTIONAL_ACQUISITION',
    'cta.title': 'Scale Your \nPortfolio.',
    'cta.description': 'Join over 12,000 institutional investors and family offices currently acquiring on the Sellio Commercial Network.',
    'cta.button_label': 'Request_Institutional_Access',
  },
  media: {
    'hero.image': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
  config: {},
};

const PROPERTIES_INVESTMENT_HOME: ThemeContentResponse = {
  theme_key: 'properties_investment',
  page: 'home',
  content: {
    'hero.kicker': 'PORTFOLIO_SYNC_V8_ACTIVE',
    'hero.title': 'Capital \nDistribution \nSynchronized.',
    'hero.highlight': 'Synchronized.',
    'hero.description': 'The global high-fidelity terminal for institutional real estate investment. Deploy capital across verified asset nodes with performance-driven precision.',
    'hero.primary_cta_label': 'Execute_Investment',
    'hero.secondary_cta_label': 'View_Reports',
    'terminal.metrics_label': 'NETWORK_PERFORMANCE_METRICS',
    'hud.total_volume_label': 'TOTAL_NETWORK_VOLUME',
    'hud.total_volume_value': '$4.2B+',
    'hud.avg_yield_label': 'AVERAGE_YIELD_ARR',
    'hud.avg_yield_value': '8.4%',
    'hud.liquidity_label': 'LIQUIDITY_INDEX',
    'hud.liquidity_value': '0.82',
    'hud.volatility_label': 'VOLATILITY_HEDGE',
    'hud.volatility_value': 'ACTIVE',
    'logic.items': 'MARKET_STATUS: STABLE|NODAL_VERIFICATION: 100%|INSTITUTIONAL_AUTH: VERIFIED|SETTLEMENT: INSTANT',
    'grid.kicker': 'YIELD_REGISTRY',
    'grid.title': 'Asset \nPerformance.',
    'grid.description': 'Our unified protocol synchronizes real-time performance metadata from residential, commercial, and industrial yield nodes.',
    'offline.kicker': 'Property Sync Offline',
    'offline.title': 'Asset performance registry could not be loaded.',
    'empty.kicker': 'Empty Property Registry',
    'empty.title': 'No live properties are published yet.',
    'empty.description': 'Add property records in the backend and this investment grid will hydrate automatically.',
    'cta.kicker': 'INSTITUTIONAL_GRADE_LOGIC',
    'cta.title': 'Scale Your \nPortfolio Yield.',
    'cta.description': 'Our investment nodes are built on a foundation of verified financial metadata. Connect your capital node to the Sellio network for high-fidelity asset distribution.',
    'cta.button_label': 'Connect_Capital_Node',
  },
  media: {},
  config: {},
};

const PROPERTIES_LUXURY_HOME: ThemeContentResponse = {
  theme_key: 'properties_luxury',
  page: 'home',
  content: {
    'hero.kicker': 'ESTABLISHED_REPRESENTATION',
    'hero.title': 'The \nCollection.',
    'hero.highlight': 'Platinum',
    'hero.description': "A curated distribution of the world's most significant luxury estates. Immersive, high-fidelity representation for the discerning asset holder.",
    'hero.primary_cta_label': 'EXPLORE_COLLECTION',
    'logic.items': 'ASSETS_UNDER_MANAGEMENT: $18.4B|NODAL_VERIFICATION: ELITE|GLOBAL_DISTRIBUTION: ACTIVE|PRIVATE_ACCESS: GRANTED',
    'editorial.badge_value': '50+',
    'editorial.badge_label': 'OFF_MARKET_NODES',
    'editorial.kicker': 'EDITORIAL_INSIGHT',
    'editorial.title': 'Bespoke Architecture. \nGlobal Context.',
    'editorial.description': 'Every property in our Platinum Collection is more than an asset; it is a architectural statement. Our high-fidelity platform ensures that the narrative of each estate is preserved and communicated with surgical precision.',
    'editorial.cta_label': 'READ_THE_JOURNAL',
    'cta.title': 'Define your \nLegacy.',
    'cta.description': "Our concierge team is standing by to facilitate your next high-fidelity acquisition. Connect with the world's most exclusive distribution network.",
    'cta.button_label': 'CONNECT_WITH_CONCIERGE',
  },
  media: {
    'hero.image': '/themes/properties/luxury/1.webp',
    'editorial.image': '/themes/properties/luxury/2.webp',
  },
  config: {},
};

const PROPERTIES_MAP_HOME: ThemeContentResponse = {
  theme_key: 'properties_map',
  page: 'home',
  content: {
    'sidebar.title': 'Registry Nodes',
    'sidebar.units_suffix': 'UNITS',
    'sidebar.filters': 'FILTER|PRICE|TYPE',
    'offline.kicker': 'Property Sync Offline',
    'offline.title': 'Registry nodes could not be loaded.',
    'empty.kicker': 'Empty Property Registry',
    'empty.title': 'No live properties are published yet.',
    'empty.description': 'Add property records in the backend and this map registry will hydrate automatically.',
    'sidebar.end_label': 'END_OF_REGISTRY',
  },
  media: {},
  config: {},
};

const PROPERTIES_MODERN_HOME: ThemeContentResponse = {
  theme_key: 'properties_modern',
  page: 'home',
  content: {
    'hero.kicker': 'Modern property search',
    'hero.title': 'Find a place that \nfits your next move.',
    'hero.highlight': 'place',
    'hero.description':
      'Browse curated homes, apartments, and commercial listings with clear pricing, useful specs, and direct next steps.',
    'hero.search_placeholder': 'Search by city, neighborhood, or property name...',
    'hero.primary_cta_label': 'Browse listings',
    'hero.secondary_cta_label': 'See featured homes',
    'hero.stat_label': 'Live listings',
    'precision.kicker': 'Smarter decisions',
    'precision.title': 'Compare the details \nbefore you visit.',
    'precision.description':
      'Every listing is shaped around the questions buyers and renters ask first: price, location, space, amenities, availability, and how to contact the right person.',
    'precision.stat_1_value': '100%',
    'precision.stat_1_label': 'Verified listings',
    'precision.stat_2_value': '24/7',
    'precision.stat_2_label': 'Inquiry ready',
    'cta.title': 'Shortlist your \nnext property.',
    'cta.description':
      'Move from inspiration to action: search the archive, compare homes for sale or rent, and open a detail page when a listing looks right.',
    'cta.button_label': 'Open property archive',
    'explore.kicker': 'Property search',
    'explore.title': 'Search sale and rental \nproperties.',
    'explore.highlight': 'properties',
    'explore.description':
      'Filter by listing type, location, price, bedrooms, and property category without losing the clean modern layout.',
    'explore.search_placeholder': 'Search by city, neighborhood, or keyword...',
  },
  media: {
    'hero.image': '/themes/properties/modern/1.webp',
    'precision.image': '/themes/properties/modern/2.webp',
  },
  config: {},
};

const PROPERTIES_NEIGHBORHOOD_HOME: ThemeContentResponse = {
  theme_key: 'properties_neighborhood',
  page: 'home',
  content: {
    'hero.kicker': 'COMMUNITY_RESIDENTIAL_PROTOCOL_V8',
    'hero.title': 'Find Your \nPlace in the \nCommunity.',
    'hero.highlight': 'Community.',
    'hero.description': 'A warm, neighborly approach to property distribution. Verified family homes in high-trust neighborhood nodes with integrated local insights.',
    'hero.primary_cta_label': 'Search_Homes',
    'hero.secondary_cta_label': 'Local_Guides',
    'hero.safety_label': 'NEIGHBORHOOD_SAFETY_INDEX',
    'hero.safety_value': '98%',
    'hud.school_rating_label': 'SCHOOL_NODE_RATING',
    'hud.school_rating_value': 'A+ SUPERIOR',
    'hud.top_schools_label': 'TOP_RATED_SCHOOLS',
    'hud.top_schools_value': '12',
    'hud.avg_commute_label': 'AVG_COMMUTE',
    'hud.avg_commute_value': '18 MIN',
    'hud.events_label': 'COMMUNITY_EVENTS',
    'hud.events_value': '42 ACTIVE',
    'grid.kicker': 'RESIDENTIAL_INVENTORY',
    'grid.title': 'Neighborly \nHomes.',
    'grid.description': 'Our neighborhood protocol ensures every family home is verified and synchronized with local lifestyle metadata.',
    'philosophy.title': 'Better \nTogether.',
    'philosophy.description': 'Our neighborhood vertical is designed to help you find more than just a house. We help you find a community that synchronizes with your lifestyle.',
    'philosophy.metric_1_value': '100%',
    'philosophy.metric_1_label': 'VERIFIED_LISTINGS',
    'philosophy.metric_2_value': '24/7',
    'philosophy.metric_2_label': 'HOOD_SUPPORT',
    'join.kicker': 'JOIN_THE_NEIGHBORHOOD',
    'join.title': 'Synchronize with \nYour Community.',
    'join.description': 'Receive local alerts, school updates, and community event news directly through your Sellio Hood node.',
    'join.button_label': 'CREATE_COMMUNITY_PROFILE',
  },
  media: {
    'hero.image': '/themes/properties/neighborhood/7.webp',
  },
  config: {},
};

const PROPERTIES_PLATINUM_HOME: ThemeContentResponse = {
  theme_key: 'properties_platinum',
  page: 'home',
  content: {
    'hero.kicker': 'ARCHITECTURAL_SUBLIMITY_V8',
    'hero.title': 'Structural \nRefinement.',
    'hero.description': "A curated collection of the world's most significant private estates. Where raw materials meet refined billionaire-minimalist vision.",
    'hero.scroll_label': 'DISCOVER',
    'protocol.title': 'The Protocol \nof Acquisition.',
    'protocol.description': 'We do not merely list properties. We validate the architectural integrity, historical significance, and future appreciation of every node in our network. Each acquisition is handled via our private concierge protocol.',
    'stats.metric_1_label': 'OFF_MARKET_NODES',
    'stats.metric_1_value': '92%',
    'stats.metric_2_label': 'ASSETS_UNDER_SYNC',
    'stats.metric_2_value': '$4.2B',
    'stats.metric_3_label': 'GLOBAL_CONCIERGE',
    'stats.metric_3_value': '24/7',
    'showcase.kicker': 'CINEMATIC_SHOWCASE',
    'showcase.filter_prefix': 'FILTER: LUXURY_TIER == "PLATINUM" · ',
    'showcase.filter_suffix': ' NODES',
    'offline.kicker': 'Property Sync Offline',
    'offline.title': 'Cinematic showcase could not be loaded.',
    'empty.kicker': 'Empty Property Registry',
    'empty.title': 'No live properties are published yet.',
    'empty.description': 'Add property records in the backend and this platinum grid will hydrate automatically.',
    'cta.kicker': 'PRIVATE_CONSULTATION',
    'cta.title': 'Acquire Your \nLegacy.',
    'cta.button_label': 'REQUEST_INVITATION',
  },
  media: {},
  config: {},
};

const PROPERTIES_RENTAL_HOME: ThemeContentResponse = {
  theme_key: 'properties_rental',
  page: 'home',
  content: {
    'hero.kicker': 'RentEase · Monthly leases',
    'hero.title': 'A home you can \nlease month to month.',
    'hero.highlight': 'month to month.',
    'hero.description':
      'Compare verified apartments and houses with clear monthly rent, move-in dates, and what is included in each lease.',
    'hero.primary_cta_label': 'Search rentals',
    'hero.secondary_cta_label': 'List a property',
    'hero.active_units_suffix': 'homes available now',
    'search.location_label': 'Location',
    'search.location_placeholder': 'City, neighborhood, or address',
    'search.checkin_label': 'Move-in date',
    'search.checkout_label': 'Move-out date',
    'search.terms_label': 'Household size',
    'search.terms_all_label': 'Any size',
    'search.button_label': 'Search rentals',
    'trust.title': 'Leasing without \nthe runaround.',
    'trust.highlight': 'runaround.',
    'trust.description':
      'Apply online, see real monthly totals, and keep lease paperwork in one place — for tenants and landlords.',
    'trust.metric_1_label': 'Digital leases',
    'trust.metric_1_value': '100%',
    'trust.metric_2_label': 'Maintenance response',
    'trust.metric_2_value': '24h',
    'trust.metric_3_label': 'Application review',
    'trust.metric_3_value': 'Fast',
    'trust.metric_4_label': 'Listing quality',
    'trust.metric_4_value': 'Verified',
    'grid.title': 'Featured rentals',
    'grid.description': 'Hand-picked homes and apartments available for monthly lease right now.',
    'empty.title': 'No rentals found',
    'empty.description':
      'Publish rental listings in your Sellio admin or try again once your API connection is configured.',
    'cta.kicker': 'Start your search',
    'cta.title': 'Pick a neighborhood, \nset your budget.',
    'cta.highlight': 'budget.',
    'cta.description':
      'Filter by rent, bedrooms, and move-in date, then send a lease inquiry when you are ready.',
    'cta.button_label': 'View all rentals',
    'explore.kicker': 'Search rentals',
    'explore.title': 'Every listing shows \nmonthly rent upfront.',
    'explore.highlight': 'monthly rent',
    'explore.description':
      'Narrow results by city, price, bedrooms, and property type. Each card shows the true monthly lease price.',
    'explore.search_placeholder': 'City, neighborhood, or building name…',
  },
  media: {
    'hero.image': '/themes/properties/rental/7.webp',
  },
  config: {},
};

const PROPERTIES_SHOWCASE_HOME: ThemeContentResponse = {
  theme_key: 'properties_showcase',
  page: 'home',
  content: {
    'hero.kicker': 'CURATED_ATELIER_COLLECTION_V8',
    'hero.title': 'Living \nAs Art.',
    'hero.description': "A curated distribution of the world's most significant architectural achievements. Synchronizing institutional curation with museum-grade provenance.",
    'hero.primary_cta_label': 'Explore Curation',
    'hero.secondary_cta_label': 'READ_MANIFESTO',
    'story.title': 'The Architecture \nof Provenance.',
    'story.highlight': 'Provenance.',
    'story.description': 'Every property in the Atelier registry is hand-selected by our board of curators. We validate not just the integrity, but the historical and cultural significance of each node.',
    'stats.metric_1_label': 'CURATION_TIER',
    'stats.metric_1_value': 'INSTITUTIONAL',
    'stats.metric_2_label': 'GRADE_PROVENANCE',
    'stats.metric_2_value': 'MUSEUM',
    'stats.metric_3_label': 'DISTRIBUTION_SYNC',
    'stats.metric_3_value': 'GLOBAL',
    'philosophy.items': 'INSTITUTIONAL_CURATION|ARCHITECTURAL_INTEGRITY|HISTORIC_PRESERVATION|EDITORIAL_SYNC',
    'cta.kicker': 'BEGIN_YOUR_CURATION',
    'cta.title': 'Authorize Your \nCollection.',
    'cta.highlight': 'Collection.',
    'cta.description': 'Our institutional nodes are currently accepting select inquiries for the 2026/27 global collection. Submit your provenance for review.',
    'cta.button_label': 'Request Private Access',
  },
  media: {},
  config: {},
};

const PROPERTIES_UNIFIED_HOME: ThemeContentResponse = {
  theme_key: 'properties_unified',
  page: 'home',
  content: {
    'hero.kicker': 'UNIVERSAL_PROPERTY_PROTOCOL_V8',
    'hero.title': 'The Authoritative \nDistribution \nNode.',
    'hero.highlight': 'Node.',
    'hero.description': 'A unified platform for residential, commercial, and industrial property distribution. High-fidelity data, institutional-grade verification, and global accessibility.',
    'hero.primary_cta_label': 'Search All Assets',
    'hero.secondary_cta_label': 'List Asset',
    'grid.kicker': 'MASTER_REGISTRY',
    'grid.title': 'High-Fidelity \nInventory.',
    'grid.description': 'Our unified protocol synchronizes metadata from multiple property verticals into a single authoritative and searchable catalog registry node.',
    'offline.kicker': 'Property Sync Offline',
    'offline.title': 'High-fidelity inventory could not be loaded.',
    'empty.kicker': 'Empty Property Registry',
    'empty.title': 'No live properties are published yet.',
    'empty.description': 'Add property records in the backend and this unified grid will hydrate automatically.',
    'cta.kicker': 'INSTITUTIONAL_SCALE',
    'cta.title': 'Scale Your \nPortfolio Globally.',
    'cta.description': 'Our unified protocol allows for cross-vertical property management and distribution. Deploy your assets across the entire Sellio ecosystem with 100% nodal integrity.',
    'cta.button_label': 'Initialize Master Node',
  },
  media: {
    'hero.image': '/themes/properties/unified/1.webp',
  },
  config: {},
};

const PROPERTIES_URBAN_HOME: ThemeContentResponse = {
  theme_key: 'properties_urban',
  page: 'home',
  content: {
    'hero.kicker': 'URBAN_LIVING_V8_DISTRIBUTION',
    'hero.title': 'Skyline \nRegistry.',
    'hero.description': 'Modern sanctuaries in the heart of the high-fidelity city. Discover curated lofts, penthouses, and studios engineered for the vertical lifestyle.',
    'hero.primary_cta_label': 'Explore Inventory',
    'hero.secondary_cta_label': 'List Unit',
    'intel.title': 'Connected \nIntelligence.',
    'intel.description': 'Our urban lofts and penthouses are equipped with high-fidelity smart-grid technologies, ensuring absolute connectivity and architectural precision for the modern dweller.',
    'intel.stat_1_value': '10Gb',
    'intel.stat_1_label': 'STANDARD_FIBER',
    'intel.stat_2_value': 'A+',
    'intel.stat_2_label': 'ENERGY_RATING',
    'intel.stat_3_value': '24h',
    'intel.stat_3_label': 'CONCIERGE_NODE',
    'intel.stat_4_value': 'EV',
    'intel.stat_4_label': 'CHARGING_SYNC',
    'grid.kicker': 'REGISTRY_COLLECTION // 2026',
    'grid.title': 'Registry Node Units',
    'grid.description': 'Every architectural unit is synchronized with our global registry node, ensuring 100% data integrity and availability status.',
    'offline.kicker': 'Property Sync Offline',
    'offline.title': 'Registry units could not be loaded.',
    'empty.kicker': 'Empty Property Registry',
    'empty.title': 'No live properties are published yet.',
    'empty.description': 'Add property records in the backend and this urban grid will hydrate automatically.',
    'cta.kicker': 'CITY_PULSE_PROTOCOL',
    'cta.title': 'Live in the \nPulse of the City.',
    'cta.description': 'From the industrial lofts of the Arts District to the high-energy penthouses of the Financial Center, find the urban node that matches your frequency.',
    'cta.button_label': 'Authorize District Sync',
  },
  media: {
    'hero.image': '/themes/properties/urban/1.webp',
  },
  config: {},
};

const PROPERTIES_VACATION_HOME: ThemeContentResponse = {
  theme_key: 'properties_vacation',
  page: 'home',
  content: {
    'hero.kicker': 'GLOBAL_ESCAPE_REGISTRY_V8',
    'hero.title': 'Find Your \nInfinite Horizon.',
    'hero.highlight': 'Infinite Horizon.',
    'hero.description': "A curated collection of the world's most significant vacation retreats. Authenticated by our local nodes, enjoyed by global travelers.",
    'search.where_label': 'Where to?',
    'search.where_placeholder': 'Search Amalfi, Lofoten, Zermatt...',
    'search.checkin_label': 'Check In',
    'search.checkout_label': 'Check Out',
    'search.budget_label': 'Budget / Night',
    'search.budget_all_label': 'All Budgets',
    'search.budget_under_500': 'Under $500/night',
    'search.budget_500_1000': '$500 - $1,000/night',
    'search.budget_1000_plus': '$1,000+/night',
    'search.reset_label': 'Reset',
    'trust.items': '100%_AUTHENTICATED|NO_PROTOCOL_FEES|LOCAL_NODE_SUPPORT|CRYPTO_SYNC_ENABLED',
    'diagnostics.title': '⚠️ Escapes Node Offline - Diagnostics Trace Active',
    'diagnostics.description': 'API exception caught on getaway server node query. Access local diagnostics log traceback:',
    'grid.kicker': 'CURATED_COLLECTION',
    'grid.title': 'The \nRetreats.',
    'grid.highlight': 'Retreats.',
    'grid.description': 'Every property in our vacation vertical is manually verified by a local node expert to validate the vibe and view.',
    'ribbon.all_label': 'All Nearby Retreats',
    'empty.title': 'No Retreats Found',
    'empty.description': "We couldn't find any premium getaway retreats matching your filters.",
    'empty.clear_label': 'Clear Filter refinement',
    'philosophy.kicker': 'THE_GETAWAY_PROTOCOL',
    'philosophy.title': 'The Art of \nthe Escape.',
    'philosophy.highlight': 'Escape.',
    'philosophy.description': 'We do not just check the amenities; we validate the architectural integrity and local significance of every vacation node.',
    'philosophy.stat_1_value': '1,200+',
    'philosophy.stat_1_label': 'VERIFIED_NODES',
    'philosophy.stat_2_value': '48h',
    'philosophy.stat_2_label': 'AVG_RESPONSE',
    'philosophy.badge_label': 'AUTHENTICATED LOCAL RETREAT',
    'cta.title': 'Your Next Escape \nis One Click Away.',
    'cta.highlight': 'One Click Away.',
    'cta.button_label': 'SECURE YOUR RETREAT',
  },
  media: {
    'philosophy.image': 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600',
  },
  config: {},
};

export function getThemeContentDefaults(themeKey?: string, page = 'home'): ThemeContentResponse {
  if (themeKey === 'properties_commercial' && page === 'home') {
    return PROPERTIES_COMMERCIAL_HOME;
  }

  if (themeKey === 'properties_investment' && page === 'home') {
    return PROPERTIES_INVESTMENT_HOME;
  }

  if (themeKey === 'properties_luxury' && page === 'home') {
    return PROPERTIES_LUXURY_HOME;
  }

  if (themeKey === 'properties_map' && page === 'home') {
    return PROPERTIES_MAP_HOME;
  }

  if (themeKey === 'properties_modern' && page === 'home') {
    return PROPERTIES_MODERN_HOME;
  }

  if (themeKey === 'properties_neighborhood' && page === 'home') {
    return PROPERTIES_NEIGHBORHOOD_HOME;
  }

  if (themeKey === 'properties_platinum' && page === 'home') {
    return PROPERTIES_PLATINUM_HOME;
  }

  if (themeKey === 'properties_rental' && page === 'home') {
    return PROPERTIES_RENTAL_HOME;
  }

  if (themeKey === 'properties_showcase' && page === 'home') {
    return PROPERTIES_SHOWCASE_HOME;
  }

  if (themeKey === 'properties_unified' && page === 'home') {
    return PROPERTIES_UNIFIED_HOME;
  }

  if (themeKey === 'properties_urban' && page === 'home') {
    return PROPERTIES_URBAN_HOME;
  }

  if (themeKey === 'properties_vacation' && page === 'home') {
    return PROPERTIES_VACATION_HOME;
  }

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

  if (themeKey === 'services_corporate' && page === 'home') {
    return SERVICES_CORPORATE_HOME;
  }

  if (themeKey === 'services_creative' && page === 'home') {
    return SERVICES_CREATIVE_HOME;
  }

  if (themeKey === 'services_health' && page === 'home') {
    return SERVICES_HEALTH_HOME;
  }

  if (themeKey === 'services_local' && page === 'home') {
    return SERVICES_LOCAL_HOME;
  }

  if (themeKey === 'jobs_blue_collar' && page === 'home') {
    return JOBS_BLUE_COLLAR_HOME;
  }

  if (themeKey === 'jobs_freelance' && page === 'home') {
    return JOBS_FREELANCE_HOME;
  }

  if (themeKey === 'jobs_modern' && page === 'home') {
    return JOBS_MODERN_HOME;
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

  if (themeKey === 'classifieds_deals' && page === 'home') {
    return CLASSIFIEDS_DEALS_HOME;
  }

  if (themeKey === 'classifieds_elite' && page === 'home') {
    return CLASSIFIEDS_ELITE_HOME;
  }

  if (themeKey === 'classifieds_local' && page === 'home') {
    return CLASSIFIEDS_LOCAL_HOME;
  }

  if (themeKey === 'classifieds_modern' && page === 'home') {
    return CLASSIFIEDS_MODERN_HOME;
  }

  if (themeKey === 'classifieds_premium' && page === 'home') {
    return CLASSIFIEDS_PREMIUM_HOME;
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

  if (themeKey === 'unifieds_classic' && page === 'home') {
    return UNIFIEDS_CLASSIC_HOME;
  }

  if (themeKey === 'unifieds_default' && page === 'home') {
    return UNIFIEDS_DEFAULT_HOME;
  }

  if (themeKey === 'unifieds_interactive' && page === 'home') {
    return UNIFIEDS_INTERACTIVE_HOME;
  }

  if (themeKey === 'unifieds_marketplace' && page === 'home') {
    return UNIFIEDS_MARKETPLACE_HOME;
  }

  if (themeKey === 'unifieds_mega' && page === 'home') {
    return UNIFIEDS_MEGA_HOME;
  }

  if (themeKey === 'unifieds_minimal' && page === 'home') {
    return UNIFIEDS_MINIMAL_HOME;
  }

  if (themeKey === 'unifieds_modern' && page === 'home') {
    return UNIFIEDS_MODERN_HOME;
  }

  if (themeKey === 'unifieds_standard' && page === 'home') {
    return UNIFIEDS_STANDARD_HOME;
  }

  return {
    ...EMPTY_THEME_CONTENT,
    theme_key: themeKey ?? EMPTY_THEME_CONTENT.theme_key,
    page,
  };
}
