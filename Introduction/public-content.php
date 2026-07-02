<?php

declare(strict_types=1);

$sites = require __DIR__ . '/sites.php';

return [
    'product' => [
        'name' => 'Sellio',
        'version' => '2.4.0',
        'positioning' => 'Self-hosted multi-purpose marketplace platform',
        'title' => 'Sellio - Multi-Purpose Multi-Vendor Marketplace Platform',
        'description' => 'Sellio is a self-hosted multi-purpose marketplace platform for products, properties, vehicles, events, jobs, services, and classifieds, built with Laravel, Next.js, React, and Expo.',
    ],
    'urls' => [
        'marketing' => $sites['marketing'],
        'documentation' => $sites['documentation'],
        'storefront' => $sites['demo']['storefront'],
        'admin' => $sites['demo']['admin'],
        'seller' => $sites['demo']['seller'],
        'buyer' => $sites['demo']['buyer'],
        'nextjs' => $sites['demo']['nextjs'],
        'product_tour' => $sites['marketing'] . '/product-tour/',
        'listing_description' => $sites['marketing'] . '/listing-description/',
        'support' => null,
        'mobile_demo' => null,
    ],
    'verticals' => [
        'products' => ['label' => 'Products', 'action' => 'Buy', 'description' => 'Catalogs, inventory, carts, orders, checkout, favorites, and reviews.'],
        'properties' => ['label' => 'Properties', 'action' => 'Book', 'description' => 'Amenities, visits, seasonal pricing, availability, add-ons, and bookings.'],
        'vehicles' => ['label' => 'Vehicles', 'action' => 'Inquire', 'description' => 'Vehicle specifications, seller inventory, buyer inquiries, and follow-up.'],
        'events' => ['label' => 'Events', 'action' => 'Book tickets', 'description' => 'Occurrences, ticket inventory, attendee details, bookings, and payments.'],
        'jobs' => ['label' => 'Jobs', 'action' => 'Apply', 'description' => 'Job listings, employer information, applications, and buyer activity.'],
        'services' => ['label' => 'Services', 'action' => 'Request or book', 'description' => 'Packages, quotes, consultations, appointments, and customer activity.'],
        'classifieds' => ['label' => 'Classifieds', 'action' => 'Message or inquire', 'description' => 'Categories, locations, saved listings, messaging, and inquiries.'],
    ],
    'stack' => [
        ['layer' => 'Backend', 'name' => 'Laravel', 'version' => '12'],
        ['layer' => 'Runtime', 'name' => 'PHP', 'version' => '8.2+'],
        ['layer' => 'Storefront', 'name' => 'Next.js', 'version' => '16'],
        ['layer' => 'Web apps', 'name' => 'React', 'version' => '19'],
        ['layer' => 'Mobile', 'name' => 'Expo', 'version' => '54'],
        ['layer' => 'Database', 'name' => 'MySQL', 'version' => '8'],
        ['layer' => 'Authentication', 'name' => 'Sanctum', 'version' => '4'],
        ['layer' => 'Realtime', 'name' => 'Echo / Pusher', 'version' => null],
    ],
    'gateways' => ['Stripe', 'PayPal', 'Razorpay', 'Flutterwave', 'Paystack', 'Mollie', 'Manual / Bank Transfer'],
    'installation' => [
        'Check server requirements',
        'Configure application and database',
        'Create the administrator',
        'Select modules and prepare data',
        'Run migrations and finish setup',
    ],
    'demo_accounts' => $sites['demo_accounts'],
    'approved_testimonials' => [],
    'claims' => [
        'customer_count' => null,
        'performance_score' => null,
        'uptime' => null,
        'guaranteed_launch_time' => null,
    ],
];
