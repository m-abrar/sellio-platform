<?php 

  $sites = require __DIR__ . '/sites.php';

  // Hero Wheel Screenshots
  $screenshots = [
      ['img' => 'images/properties_default.webp', 'url' => 'website.com/properties'],
      ['img' => 'images/autos_default.webp', 'url' => 'website.com/autos'],
      ['img' => 'images/events_default.webp', 'url' => 'website.com/events'],
  ];

  // 1. Industry Modules Data (Prioritized & Enhanced)
  $industries = [
      [
          'title' => 'eCommerce & Shop', 
          'desc' => 'Full-scale storefronts with digital/physical product support and cart systems.', 
          'icon' => 'fas fa-shopping-bag', 
          'size' => 'col-lg-8', 
          'tag' => 'Commercial', 
          'color' => '#6610f2',
          'features' => ['Cart System', 'Stripe Connect', 'Digital Downloads']
      ],
      [
          'title' => 'Travel & Booking', 
          'desc' => 'Full-scale travel portal for hotels, vacation rentals, and guided tours.', 
          'icon' => 'fas fa-plane-departure', 
          'size' => 'col-lg-4', 
          'tag' => 'New Release', 
          'color' => '#20c997',
          'features' => ['Calendar Sync', 'Booking Engine', 'iCal Export']
      ],
      [
          'title' => 'Directory Hub', 
          'desc' => 'Business listing directory with premium tiers, claimed listings, and maps.', 
          'icon' => 'fas fa-location-dot', 
          'size' => 'col-lg-4', 
          'tag' => 'Community', 
          'color' => '#0dcaf0',
          'features' => ['Claim Listing', 'Map View', 'Premium Tiers']
      ],
      [
          'title' => 'Real Estate', 
          'desc' => 'Premium property portal with floor plans, map views, and agent management.', 
          'icon' => 'fas fa-house-chimney', 
          'size' => 'col-lg-8', 
          'tag' => 'Top Interest', 
          'color' => '#0d6efd',
          'features' => ['Floor Plans', 'Agent Portals', '360° Tours']
      ],
      [
          'title' => 'Events & Tickets', 
          'desc' => 'Event management with calendar views and QR-based ticket verification.', 
          'icon' => 'fas fa-ticket', 
          'size' => 'col-lg-8', 
          'tag' => 'Interactive', 
          'color' => '#d63384',
          'features' => ['QR Check-in', 'Seat Maps', 'Calendar View']
      ],
      [
          'title' => 'Classified Ads', 
          'desc' => 'Multi-niche ads marketplace with custom fields, location search, and messaging.', 
          'icon' => 'fas fa-bullhorn', 
          'size' => 'col-lg-4', 
          'tag' => 'High Demand', 
          'color' => '#fd7e14',
          'features' => ['Custom Fields', 'Chat System', 'Bump-up Ads']
      ],
      [
          'title' => 'Automotive', 
          'desc' => 'Advanced vehicle marketplace for dealerships with VIN lookup support.', 
          'icon' => 'fas fa-car-side', 
          'size' => 'col-lg-4', 
          'tag' => 'Classic', 
          'color' => '#dc3545',
          'features' => ['VIN Decoder', 'Dealer Panels', 'Compare Tool']
      ],
      [
          'title' => 'Job Board', 
          'desc' => 'Complete recruitment ecosystem with resume builders and employer dashboards.', 
          'icon' => 'fas fa-briefcase', 
          'size' => 'col-lg-4', 
          'tag' => 'Enterprise', 
          'color' => '#0dcaf0',
          'features' => ['Resume Builder', 'Apply Tracker', 'Job Alerts']
      ],
      [
          'title' => 'Service Finder', 
          'desc' => 'Local service directory with appointment booking and quote request systems.', 
          'icon' => 'fas fa-gears', 
          'size' => 'col-lg-4', 
          'tag' => 'Niche Growth', 
          'color' => '#ffc107',
          'features' => ['Quote Request', 'Slot Booking', 'Provider Apps']
      ],
      [
          'title' => 'Unified Marketplace', 
          'desc' => 'The ultimate all-in-one powerhouse. Combine every niche into a single mega portal.', 
          'icon' => 'fas fa-layer-group', 
          'size' => 'col-lg-12', 
          'tag' => 'Elite Solution', 
          'color' => '#76c043',
          'features' => ['Niche Switching', 'Global Search', 'Mega Dashboard']
      ]
  ];

  // 2. Demo Categories (Filters)
  $demo_categories = ['Unified', 'Properties', 'Events', 'Autos', 'Services', 'Jobs', 'Classifieds'];

  // 3. Demos Mapped to Theme Map Slugs
    $demos = [
        // Unified / All-in-One
        ['cat' => 'Unified', 'name' => 'Unifieds Default', 'slug' => 'unifieds_default', 'img' => 'images/unifieds_default.png', 'status' => 'active', 'desc' => 'All-in-one marketplace combining every product niche in a single unified storefront.'],
        ['cat' => 'Unified', 'name' => 'Unifieds Standard', 'slug' => 'unifieds_standard', 'img' => 'images/unifieds_standard.webp', 'status' => 'active', 'desc' => 'A clean, balanced unified marketplace layout built for general multi-niche selling.'],
        ['cat' => 'Unified', 'name' => 'Mega Marketplace', 'slug' => 'unifieds_mega', 'img' => 'images/unifieds_mega.webp', 'status' => 'active', 'desc' => 'A high-density mega marketplace with deep category navigation and bulk listings.'],
        ['cat' => 'Unified', 'name' => 'Minimal Store', 'slug' => 'unifieds_minimal', 'img' => 'images/unifieds_minimal.webp', 'status' => 'active', 'desc' => 'A stripped-back, minimalist storefront focused on fast browsing and clean visuals.'],
        ['cat' => 'Unified', 'name' => 'Unifieds Modern', 'slug' => 'unifieds_modern', 'img' => 'images/unifieds_modern.webp', 'status' => 'active', 'desc' => 'A contemporary unified marketplace with bold typography and modern UI patterns.'],
        ['cat' => 'Unified', 'name' => 'Unifieds Classic', 'slug' => 'unifieds_classic', 'img' => 'images/unifieds_classic.webp', 'status' => 'active', 'desc' => 'A traditional marketplace layout with familiar navigation and timeless styling.'],
        ['cat' => 'Unified', 'name' => 'Interactive Portal', 'slug' => 'unifieds_interactive', 'img' => 'images/unifieds_interactive.webp', 'status' => 'soon', 'desc' => 'An interactive portal with dynamic filters and an engaging browsing experience.'],
        ['cat' => 'Unified', 'name' => 'Unifieds Marketplace', 'slug' => 'unifieds_marketplace', 'img' => 'images/unifieds_marketplace.webp', 'status' => 'active', 'desc' => 'A full-featured general marketplace supporting multiple vendors and categories.'],

        // Properties / Real Estate
        ['cat' => 'Properties', 'name' => 'Property Standard', 'slug' => 'properties_default', 'img' => 'images/properties_default.webp', 'status' => 'active', 'desc' => 'A standard real estate listing site with search, filters, and property details.'],
        ['cat' => 'Properties', 'name' => 'Properties Classic', 'slug' => 'properties_classic', 'img' => 'images/properties_classic.webp', 'status' => 'active', 'desc' => 'A traditional property listing layout with familiar real estate browsing patterns.'],
        ['cat' => 'Properties', 'name' => 'Properties Modern', 'slug' => 'properties_modern', 'img' => 'images/properties_modern.webp', 'status' => 'active', 'desc' => 'A sleek, modern real estate theme with contemporary visuals and layouts.'],
        ['cat' => 'Properties', 'name' => 'Luxury Real Estate', 'slug' => 'properties_luxury', 'img' => 'images/properties_luxury.webp', 'status' => 'soon', 'desc' => 'A high-end luxury real estate showcase for premium estates and properties.'],
        ['cat' => 'Properties', 'name' => 'Properties Deluxe', 'slug' => 'properties_deluxe', 'img' => 'images/properties_deluxe.webp', 'status' => 'active', 'desc' => 'An upscale property theme with refined styling for premium listings.'],
        ['cat' => 'Properties', 'name' => 'Properties Urban', 'slug' => 'properties_urban', 'img' => 'images/properties_urban.webp', 'status' => 'active', 'desc' => 'A city-focused property theme for lofts, penthouses, and urban living.'],
        ['cat' => 'Properties', 'name' => 'Properties Rental', 'slug' => 'properties_rental', 'img' => 'images/properties_rental.webp', 'status' => 'active', 'desc' => 'A rental-focused listing site for apartments and houses with lease details.'],
        ['cat' => 'Properties', 'name' => 'Properties Vacation', 'slug' => 'properties_vacation', 'img' => 'images/properties_vacation.webp', 'status' => 'active', 'desc' => 'A vacation rental theme for short-term stays and holiday properties.'],
        ['cat' => 'Properties', 'name' => 'Properties Map', 'slug' => 'properties_map', 'img' => 'images/properties_map.webp', 'status' => 'active', 'desc' => 'A map-first property browser for exploring listings by location.'],
        ['cat' => 'Properties', 'name' => 'Properties Unified', 'slug' => 'properties_unified', 'img' => 'images/properties_unified.webp', 'status' => 'active', 'desc' => 'A unified real estate hub combining residential, commercial, and investment listings.'],
        ['cat' => 'Properties', 'name' => 'Properties Commercial', 'slug' => 'properties_commercial', 'img' => 'images/properties_commercial.webp', 'status' => 'active', 'desc' => 'A commercial real estate portal for office, retail, and industrial assets.'],
        ['cat' => 'Properties', 'name' => 'Properties Showcase', 'slug' => 'properties_showcase', 'img' => 'images/properties_showcase.webp', 'status' => 'active', 'desc' => 'A visually rich showcase theme highlighting featured property listings.'],
        ['cat' => 'Properties', 'name' => 'Properties Neighborhood', 'slug' => 'properties_neighborhood', 'img' => 'images/properties_neighborhood.webp', 'status' => 'active', 'desc' => 'A community-focused property theme with local neighborhood insights.'],
        ['cat' => 'Properties', 'name' => 'Properties Investment', 'slug' => 'properties_investment', 'img' => 'images/properties_investment.webp', 'status' => 'active', 'desc' => 'An investment-focused property theme with yield data and pricing analysis.'],

        // Events
        ['cat' => 'Events', 'name' => 'Events Default', 'slug' => 'events_default', 'img' => 'images/events_default.webp', 'status' => 'active', 'desc' => 'A standard event listing site with calendars and ticket browsing.'],
        ['cat' => 'Events', 'name' => 'Events Classic', 'slug' => 'events_classic', 'img' => 'images/events_classic.webp', 'status' => 'active', 'desc' => 'A traditional event theme with classic layouts for listings and tickets.'],
        ['cat' => 'Events', 'name' => 'Events Creative', 'slug' => 'events_creative', 'img' => 'images/events_creative.webp', 'status' => 'active', 'desc' => 'A visually creative event theme for festivals and artistic showcases.'],
        ['cat' => 'Events', 'name' => 'Events Corporate', 'slug' => 'events_corporate', 'img' => 'images/events_corporate.webp', 'status' => 'active', 'desc' => 'A professional event theme designed for conferences and corporate gatherings.'],
        ['cat' => 'Events', 'name' => 'Events Music', 'slug' => 'events_music', 'img' => 'images/events_music.webp', 'status' => 'active', 'desc' => 'A music-focused event theme for concerts and live performances.'],
        ['cat' => 'Events', 'name' => 'Events Festival', 'slug' => 'events_festival', 'img' => 'images/events_festival.webp', 'status' => 'active', 'desc' => 'A vibrant festival-themed event site for large multi-day gatherings.'],

        // Autos / Vehicles
        ['cat' => 'Autos', 'name' => 'Autos Default', 'slug' => 'autos_default', 'img' => 'images/autos_default.webp', 'status' => 'active', 'desc' => 'A standard vehicle marketplace for browsing and comparing cars.'],
        ['cat' => 'Autos', 'name' => 'Autos Classic', 'slug' => 'autos_classic', 'img' => 'images/autos_classic.webp', 'status' => 'active', 'desc' => 'A traditional auto dealership theme with classic listing layouts.'],
        ['cat' => 'Autos', 'name' => 'Auto Modern', 'slug' => 'autos_modern', 'img' => 'images/autos_modern.webp', 'status' => 'active', 'desc' => 'A modern vehicle marketplace with sleek visuals and comparison tools.'],
        ['cat' => 'Autos', 'name' => 'Autos Used', 'slug' => 'autos_used', 'img' => 'images/autos_used.webp', 'status' => 'active', 'desc' => 'A used car marketplace focused on resale and pre-owned listings.'],
        ['cat' => 'Autos', 'name' => 'Autos Luxury', 'slug' => 'autos_luxury', 'img' => 'images/autos_luxury.webp', 'status' => 'active', 'desc' => 'A luxury vehicle showcase for high-end and premium automobiles.'],
        ['cat' => 'Autos', 'name' => 'Autos Electric', 'slug' => 'autos_electric', 'img' => 'images/autos_electric.webp', 'status' => 'active', 'desc' => 'An electric vehicle marketplace highlighting EVs and charging info.'],

        // Services
        ['cat' => 'Services', 'name' => 'Services Default', 'slug' => 'services_default', 'img' => 'images/services_default.webp', 'status' => 'active', 'desc' => 'A standard local service directory with booking and quote requests.'],
        ['cat' => 'Services', 'name' => 'Services Corporate', 'slug' => 'services_corporate', 'img' => 'images/services_corporate.webp', 'status' => 'active', 'desc' => 'A professional services theme for B2B and enterprise providers.'],
        ['cat' => 'Services', 'name' => 'Services Marketplace', 'slug' => 'services_marketplace', 'img' => 'images/services_marketplace.webp', 'status' => 'active', 'desc' => 'A multi-provider service marketplace with comparison and booking tools.'],
        ['cat' => 'Services', 'name' => 'Services Creative', 'slug' => 'services_creative', 'img' => 'images/services_creative.webp', 'status' => 'active', 'desc' => 'A creative-industry service theme for designers, artists, and freelancers.'],
        ['cat' => 'Services', 'name' => 'Services Local', 'slug' => 'services_local', 'img' => 'images/services_local.webp', 'status' => 'active', 'desc' => 'A neighborhood service directory connecting customers with local providers.'],
        ['cat' => 'Services', 'name' => 'Services Health', 'slug' => 'services_health', 'img' => 'images/services_health.webp', 'status' => 'active', 'desc' => 'A health and wellness service theme for clinics and practitioners.'],

        // Jobs
        ['cat' => 'Jobs', 'name' => 'Jobs Default', 'slug' => 'jobs_default', 'img' => 'images/jobs_default.webp', 'status' => 'active', 'desc' => 'A standard job board with listings, applications, and employer profiles.'],
        ['cat' => 'Jobs', 'name' => 'Jobs Corporate', 'slug' => 'jobs_corporate', 'img' => 'images/jobs_corporate.webp', 'status' => 'active', 'desc' => 'A corporate job board theme built for enterprise recruitment.'],
        ['cat' => 'Jobs', 'name' => 'Jobs Startup', 'slug' => 'jobs_startup', 'img' => 'images/jobs_startup.webp', 'status' => 'active', 'desc' => 'A startup-focused job board highlighting fast-growing companies.'],
        ['cat' => 'Jobs', 'name' => 'Tech Career Hub', 'slug' => 'jobs_tech', 'img' => 'images/jobs_tech.webp', 'status' => 'active', 'desc' => 'A tech career hub for software and IT job listings.'],
        ['cat' => 'Jobs', 'name' => 'Jobs Blue Collar', 'slug' => 'jobs_blue_collar', 'img' => 'images/jobs_blue_collar.webp', 'status' => 'active', 'desc' => 'A job board theme tailored to trade and blue-collar roles.'],
        ['cat' => 'Jobs', 'name' => 'Jobs Freelance', 'slug' => 'jobs_freelance', 'img' => 'images/jobs_freelance.webp', 'status' => 'active', 'desc' => 'A freelance job board for short-term and contract work.'],

        // Classifieds
        ['cat' => 'Classifieds', 'name' => 'Classifieds Default', 'slug' => 'classifieds_default', 'img' => 'images/classifieds_default.webp', 'status' => 'active', 'desc' => 'A standard classifieds marketplace for general buy-and-sell ads.'],
        ['cat' => 'Classifieds', 'name' => 'General Deals', 'slug' => 'classifieds_general', 'img' => 'images/classifieds_general.webp', 'status' => 'active', 'desc' => 'A general deals classifieds theme for everyday item listings.'],
        ['cat' => 'Classifieds', 'name' => 'Classifieds Modern', 'slug' => 'classifieds_modern', 'img' => 'images/classifieds_modern.webp', 'status' => 'active', 'desc' => 'A modern classifieds layout with clean cards and filters.'],
        ['cat' => 'Classifieds', 'name' => 'Classifieds Local', 'slug' => 'classifieds_local', 'img' => 'images/classifieds_local.webp', 'status' => 'active', 'desc' => 'A local classifieds theme connecting nearby buyers and sellers.'],
        ['cat' => 'Classifieds', 'name' => 'Classifieds Deals', 'slug' => 'classifieds_deals', 'img' => 'images/classifieds_deals.webp', 'status' => 'active', 'desc' => 'A deals-focused classifieds theme highlighting discounts and offers.'],
        ['cat' => 'Classifieds', 'name' => 'Classifieds Premium', 'slug' => 'classifieds_premium', 'img' => 'images/classifieds_premium.webp', 'status' => 'active', 'desc' => 'A premium classifieds theme with featured and boosted listings.'],
        ['cat' => 'Classifieds', 'name' => 'Classifieds Elite', 'slug' => 'classifieds_elite', 'img' => 'images/classifieds_elite.webp', 'status' => 'active', 'desc' => 'An elite classifieds theme for high-value, exclusive item listings.'],
    ];

$category_counts = array_count_values(array_column($demos, 'cat'));
$total_demos = count($demos);

// 4. Video Gallery — set 'status' to 'active' and fill 'youtube_id' once a video is recorded/uploaded.
$videos = [
    ['title' => 'Platform Overview', 'desc' => 'A full tour of Sellio — every vertical, every dashboard, in one walkthrough.', 'thumb' => 'images/unifieds_mega.webp', 'youtube_id' => '', 'status' => 'soon'],
    ['title' => 'Installation Walkthrough', 'desc' => 'Follow the guided web installer from server requirements to your first admin login.', 'thumb' => 'images/properties_default.webp', 'youtube_id' => '', 'status' => 'soon'],
    ['title' => 'Admin Dashboard Tour', 'desc' => 'Manage users, commissions, moderation, and platform-wide settings from one control center.', 'thumb' => 'images/events_corporate.webp', 'youtube_id' => '', 'status' => 'soon'],
    ['title' => 'Multi-Vendor Selling', 'desc' => 'How a seller lists inventory, manages orders, and gets paid out automatically.', 'thumb' => 'images/autos_luxury.webp', 'youtube_id' => '', 'status' => 'soon'],
    ['title' => 'Buyer Shopping Experience', 'desc' => 'Search, checkout, and order tracking from the customer-facing storefront.', 'thumb' => 'images/classifieds_premium.webp', 'youtube_id' => '', 'status' => 'soon'],
    ['title' => 'API & Webhooks', 'desc' => 'Connect Sellio to external tools using the REST API and outbound webhook events.', 'thumb' => 'images/jobs_tech.webp', 'youtube_id' => '', 'status' => 'soon'],
];

$faqs = [
    ['q' => 'Is this a one-time payment or a subscription?', 'a' => 'Sellio is a <strong>one-time payment</strong> solution. Once you purchase the license, you own the source code forever with no recurring monthly fees or hidden costs.'],
    ['q' => 'Can I customize the source code?', 'a' => 'Yes, 100%. You get full access to the Laravel backend and the frontend source code. You can modify the architecture, design, and features to meet your specific business requirements.'],
    ['q' => 'Does it support multi-vendor payments?', 'a' => 'Absolutely. The platform includes a robust commission system where you can set global or category-specific rates. It supports multiple gateways including Stripe Connect for automated vendor payouts.'],
    ['q' => 'Is the platform SEO-friendly?', 'a' => 'Yes, Sellio is built with SEO best practices. It includes dynamic meta tags, clean URL structures, schema.org markup, and high-performance server-side rendering to ensure your marketplace ranks well.'],
    ['q' => 'What are the server requirements?', 'a' => 'You need a standard VPS or shared hosting with PHP 8.2+, MySQL 8, and support for Laravel (Redis is recommended for high-traffic scale).'],
];