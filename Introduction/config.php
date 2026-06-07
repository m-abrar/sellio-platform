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
        ['cat' => 'Unified', 'name' => 'Unifieds Default', 'slug' => 'unifieds_default', 'img' => 'images/unifieds_default.png', 'status' => 'active'],
        ['cat' => 'Unified', 'name' => 'Unifieds Standard', 'slug' => 'unifieds_standard', 'img' => 'images/unifieds_standard.webp', 'status' => 'active'],
        ['cat' => 'Unified', 'name' => 'Mega Marketplace', 'slug' => 'unifieds_mega', 'img' => 'images/unifieds_mega.webp', 'status' => 'active'],
        ['cat' => 'Unified', 'name' => 'Minimal Store', 'slug' => 'unifieds_minimal', 'img' => 'images/unifieds_minimal.webp', 'status' => 'active'],
        ['cat' => 'Unified', 'name' => 'Unifieds Modern', 'slug' => 'unifieds_modern', 'img' => 'images/unifieds_modern.webp', 'status' => 'active'],
        ['cat' => 'Unified', 'name' => 'Unifieds Classic', 'slug' => 'unifieds_classic', 'img' => 'images/unifieds_classic.webp', 'status' => 'active'],
        ['cat' => 'Unified', 'name' => 'Interactive Portal', 'slug' => 'unifieds_interactive', 'img' => 'images/unifieds_interactive.webp', 'status' => 'soon'],
        ['cat' => 'Unified', 'name' => 'Unifieds Marketplace', 'slug' => 'unifieds_marketplace', 'img' => 'images/unifieds_marketplace.webp', 'status' => 'active'],

        // Properties / Real Estate
        ['cat' => 'Properties', 'name' => 'Property Standard', 'slug' => 'properties_default', 'img' => 'images/properties_default.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Properties Classic', 'slug' => 'properties_classic', 'img' => 'images/properties_default.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Properties Modern', 'slug' => 'properties_modern', 'img' => 'images/properties_default.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Luxury Real Estate', 'slug' => 'properties_luxury', 'img' => 'images/properties_luxury.webp', 'status' => 'soon'],
        ['cat' => 'Properties', 'name' => 'Properties Deluxe', 'slug' => 'properties_deluxe', 'img' => 'images/properties_deluxe.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Properties Urban', 'slug' => 'properties_urban', 'img' => 'images/properties_urban.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Properties Rental', 'slug' => 'properties_rental', 'img' => 'images/properties_rental.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Properties Vacation', 'slug' => 'properties_vacation', 'img' => 'images/properties_vacation.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Properties Map', 'slug' => 'properties_map', 'img' => 'images/properties_map.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Properties Unified', 'slug' => 'properties_unified', 'img' => 'images/properties_unified.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Properties Commercial', 'slug' => 'properties_commercial', 'img' => 'images/properties_commercial.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Properties Showcase', 'slug' => 'properties_showcase', 'img' => 'images/properties_showcase.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Properties Neighborhood', 'slug' => 'properties_neighborhood', 'img' => 'images/properties_neighborhood.webp', 'status' => 'active'],
        ['cat' => 'Properties', 'name' => 'Properties Investment', 'slug' => 'properties_investment', 'img' => 'images/properties_investment.webp', 'status' => 'active'],

        // Events
        ['cat' => 'Events', 'name' => 'Events Default', 'slug' => 'events_default', 'img' => 'images/events_default.webp', 'status' => 'active'],
        ['cat' => 'Events', 'name' => 'Events Classic', 'slug' => 'events_classic', 'img' => 'images/events_classic.webp', 'status' => 'active'],
        ['cat' => 'Events', 'name' => 'Events Creative', 'slug' => 'events_creative', 'img' => 'images/events_creative.webp', 'status' => 'active'],
        ['cat' => 'Events', 'name' => 'Events Corporate', 'slug' => 'events_corporate', 'img' => 'images/events_corporate.webp', 'status' => 'active'],
        ['cat' => 'Events', 'name' => 'Events Music', 'slug' => 'events_music', 'img' => 'images/events_music.webp', 'status' => 'active'],
        ['cat' => 'Events', 'name' => 'Events Festival', 'slug' => 'events_festival', 'img' => 'images/events_festival.webp', 'status' => 'active'],

        // Autos / Vehicles
        ['cat' => 'Autos', 'name' => 'Autos Default', 'slug' => 'autos_default', 'img' => 'images/autos_default.webp', 'status' => 'active'],
        ['cat' => 'Autos', 'name' => 'Autos Classic', 'slug' => 'autos_classic', 'img' => 'images/autos_classic.webp', 'status' => 'active'],
        ['cat' => 'Autos', 'name' => 'Auto Modern', 'slug' => 'autos_modern', 'img' => 'images/autos_modern.webp', 'status' => 'active'],
        ['cat' => 'Autos', 'name' => 'Autos Used', 'slug' => 'autos_used', 'img' => 'images/autos_used.webp', 'status' => 'active'],
        ['cat' => 'Autos', 'name' => 'Autos Luxury', 'slug' => 'autos_luxury', 'img' => 'images/autos_luxury.webp', 'status' => 'active'],
        ['cat' => 'Autos', 'name' => 'Autos Electric', 'slug' => 'autos_electric', 'img' => 'images/autos_electric.webp', 'status' => 'active'],

        // Services
        ['cat' => 'Services', 'name' => 'Services Default', 'slug' => 'services_default', 'img' => 'images/services_default.webp', 'status' => 'active'],
        ['cat' => 'Services', 'name' => 'Services Corporate', 'slug' => 'services_corporate', 'img' => 'images/services_corporate.webp', 'status' => 'active'],
        ['cat' => 'Services', 'name' => 'Services Marketplace', 'slug' => 'services_marketplace', 'img' => 'images/services_marketplace.webp', 'status' => 'active'],
        ['cat' => 'Services', 'name' => 'Services Creative', 'slug' => 'services_creative', 'img' => 'images/services_creative.webp', 'status' => 'active'],
        ['cat' => 'Services', 'name' => 'Services Local', 'slug' => 'services_local', 'img' => 'images/services_local.webp', 'status' => 'active'],
        ['cat' => 'Services', 'name' => 'Services Health', 'slug' => 'services_health', 'img' => 'images/services_health.webp', 'status' => 'active'],

        // Jobs
        ['cat' => 'Jobs', 'name' => 'Jobs Default', 'slug' => 'jobs_default', 'img' => 'images/jobs_default.webp', 'status' => 'active'],
        ['cat' => 'Jobs', 'name' => 'Jobs Corporate', 'slug' => 'jobs_corporate', 'img' => 'images/jobs_corporate.webp', 'status' => 'active'],
        ['cat' => 'Jobs', 'name' => 'Jobs Startup', 'slug' => 'jobs_startup', 'img' => 'images/jobs_startup.webp', 'status' => 'active'],
        ['cat' => 'Jobs', 'name' => 'Tech Career Hub', 'slug' => 'jobs_tech', 'img' => 'images/jobs_tech.webp', 'status' => 'active'],
        ['cat' => 'Jobs', 'name' => 'Jobs Blue Collar', 'slug' => 'jobs_blue_collar', 'img' => 'images/jobs_blue_collar.webp', 'status' => 'active'],
        ['cat' => 'Jobs', 'name' => 'Jobs Freelance', 'slug' => 'jobs_freelance', 'img' => 'images/jobs_freelance.webp', 'status' => 'active'],

        // Classifieds
        ['cat' => 'Classifieds', 'name' => 'Classifieds Default', 'slug' => 'classifieds_default', 'img' => 'images/classifieds_default.webp', 'status' => 'active'],
        ['cat' => 'Classifieds', 'name' => 'General Deals', 'slug' => 'classifieds_general', 'img' => 'images/classifieds_general.webp', 'status' => 'active'],
        ['cat' => 'Classifieds', 'name' => 'Classifieds Modern', 'slug' => 'classifieds_modern', 'img' => 'images/classifieds_modern.webp', 'status' => 'active'],
        ['cat' => 'Classifieds', 'name' => 'Classifieds Local', 'slug' => 'classifieds_local', 'img' => 'images/classifieds_local.webp', 'status' => 'active'],
        ['cat' => 'Classifieds', 'name' => 'Classifieds Deals', 'slug' => 'classifieds_deals', 'img' => 'images/classifieds_deals.webp', 'status' => 'active'],
        ['cat' => 'Classifieds', 'name' => 'Classifieds Premium', 'slug' => 'classifieds_premium', 'img' => 'images/classifieds_premium.webp', 'status' => 'active'],
        ['cat' => 'Classifieds', 'name' => 'Classifieds Elite', 'slug' => 'classifieds_elite', 'img' => 'images/classifieds_elite.webp', 'status' => 'active'],
    ];

$category_counts = array_count_values(array_column($demos, 'cat'));
$total_demos = count($demos);

$faqs = [
    ['q' => 'Is this a one-time payment or a subscription?', 'a' => 'Sellio is a <strong>one-time payment</strong> solution. Once you purchase the license, you own the source code forever with no recurring monthly fees or hidden costs.'],
    ['q' => 'Can I customize the source code?', 'a' => 'Yes, 100%. You get full access to the Laravel backend and the frontend source code. You can modify the architecture, design, and features to meet your specific business requirements.'],
    ['q' => 'Does it support multi-vendor payments?', 'a' => 'Absolutely. The platform includes a robust commission system where you can set global or category-specific rates. It supports multiple gateways including Stripe Connect for automated vendor payouts.'],
    ['q' => 'Is the platform SEO-friendly?', 'a' => 'Yes, Sellio is built with SEO best practices. It includes dynamic meta tags, clean URL structures, schema.org markup, and high-performance server-side rendering to ensure your marketplace ranks well.'],
    ['q' => 'What are the server requirements?', 'a' => 'You need a standard VPS or shared hosting with PHP 8.2+, MySQL 8, and support for Laravel (Redis is recommended for high-traffic scale).'],
];