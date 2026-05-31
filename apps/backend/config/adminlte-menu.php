<?php
/**
 * Administrative Navigation Schema
 *
 * This file constructs the hierarchical menu structure for the AdminLTE sidebar and topbar.
 * It implements fine-grained access control via 'can' gates and 'module' checks,
 * grouping administrative features into high-priority operational blocks
 * (Listings, Bookings, Financials, Content, RBAC).
 */
return [
    // TOP NAVIGATION (No change)
    [
        'type'         => 'darkmode-widget',
        'topnav_right' => true,
    ],
    [
        'type' => 'fullscreen-widget',
        'topnav_right' => true,
    ],

    [
        'text' => '',
        'url'  => '/',
        'icon' => 'fas fa-external-link-alt',
        'topnav_right' => true,
        'attributes' => [
            'title' => 'View Website',
            'data-toggle' => 'tooltip',
            'data-placement' => 'bottom',
        ],
    ],

    [
        'type' => 'navbar-notification',
        'icon' => 'fas fa-bell',
        'id' => 'notifications_menu',
        'label' => 0, // This will show as badge number
        'label_color' => 'warning',
        'url' => 'admin/notifications',
        'dropdown_mode' => true,
        'dropdown_flabel' => 'View All Notifications',
        'topnav_right' => true,
    ],


    // SIDEBAR (No change)


    // 1. DASHBOARD (Highest Priority)
    [
        'text' => 'Dashboard',
        'url'  => 'admin/welcome',
        'icon' => 'fas fa-tachometer-alt',
    ],
    [
        'text' => 'Ecommerce Overview',
        'url'  => 'admin/dashboard/ecommerce',
        'icon' => 'fas fa-shopping-cart',
        'module' => 'products',
        'can'    => 'manage-products',
    ],

    // 2. CORE BUSINESS - PROPERTY & OPERATIONS
    ['header' => 'LISTINGS & OPERATIONS'],

    // A. Properties (Central object)
    [
        'text' => 'Listings',
        'icon' => 'fas fa-building',
        'submenu' => [
            [
                'text' => 'All Listings',
                'url' => 'admin/listings',
                'icon' => 'fas fa-layer-group',
            ],
            [
                'text' => 'Pending Approval',
                'url' => 'admin/listings/pending',
                'icon' => 'fas fa-hourglass-start',
            ],
            [
                'text' => 'Products',
                'url' => 'admin/products',
                'icon' => 'fas fa-shopping-bag',
                'module' => 'products',
                'can' => 'manage-products',
            ],
            [
                'text' => 'Properties',
                'url' => 'admin/properties',
                'icon' => 'fas fa-building',
                'module' => 'properties',
                'can' => 'manage-properties',
            ],
            [
                'text' => 'Autos',
                'url' => 'admin/autos',
                'icon' => 'fas fa-car',
                'module' => 'autos',
                'can' => 'manage-autos',
            ],
            [
                'text' => 'Events',
                'url' => 'admin/events',
                'icon' => 'fas fa-calendar-check',
                'module' => 'events',
                'can' => 'manage-events',
            ],
            [
                'text' => 'Jobs',
                'url' => 'admin/jobs',
                'icon' => 'fas fa-briefcase',
                'module' => 'jobs',
                'can' => 'manage-jobs',
            ],
            [
                'text' => 'Services',
                'url' => 'admin/services',
                'icon' => 'fas fa-hand-holding-heart',
                'module' => 'services',
                'can' => 'manage-services',
            ],
            [
                'text' => 'Classifieds',
                'url' => 'admin/classifieds',
                'icon' => 'fas fa-bullhorn',
                'module' => 'classifieds',
                'can' => 'manage-classifieds',
            ],
        ],
    ],

    // B. Operations (Bookings & Leads)
    [
        'text' => 'Bookings & Inquiries',
        'icon' => 'fas fa-calendar-alt',
        'can'  => 'manage-bookings',
        'submenu' => [
             [
                'text' => 'All Bookings & Leads',
                'url' => 'admin/bookings',
                'icon' => 'fas fa-layer-group',
             ],
             [
                'text' => 'Product Orders',
                'url' => 'admin/product-orders',
                'icon' => 'fas fa-truck',
                'module' => 'products',
             ],
             [
                'text' => 'Property Bookings',
                'url' => 'admin/bookings/properties',
                'icon' => 'fas fa-building',
                'module' => 'properties',
             ],
             [
                'text' => 'Auto Inquiries',
                'url' => 'admin/bookings/autos',
                'icon' => 'fas fa-car',
                'module' => 'autos',
             ],
             [
                'text' => 'Event Bookings',
                'url' => 'admin/bookings/events',
                'icon' => 'fas fa-calendar-check',
                'module' => 'events',
             ],
             [
                'text' => 'Job Applications',
                'url' => 'admin/bookings/jobs',
                'icon' => 'fas fa-briefcase',
                'module' => 'jobs',
             ],
             [
                'text' => 'Service Bookings',
                'url' => 'admin/bookings/services',
                'icon' => 'fas fa-hand-holding-heart',
                'module' => 'services',
             ],
             [
                'text' => 'Classified Leads',
                'url' => 'admin/bookings/classifieds',
                'icon' => 'fas fa-bullhorn',
                'module' => 'classifieds',
             ],
        ],
    ],

    // 3. CORE BUSINESS - LISTING ATTRIBUTES (Sub-settings for Listings)
    [
        'header' => 'LISTING ATTRIBUTES',
    ],
    [
        'text' => 'Manage Attributes',
        'icon' => 'fas fa-sliders-h', // Updated Icon for "attributes"
        'color' => 'secondary', // Applied color
        'can'   => 'manage-taxonomies',
        'submenu' => [
            // Reordered sub-items to place the most essential/frequently used first
            [
                'text' => 'Locations',
                'url' => 'admin/locations',
                'icon' => 'fas fa-map-marker-alt',
            ],
            [
                'text' => 'Categories',
                'url' => 'admin/categories',
                'icon' => 'fas fa-folder-open',
            ],
            [
                'text' => 'Types',
                'url' => 'admin/types',
                'icon' => 'fas fa-layer-group',
            ],
            [
                'text' => 'Amenities',
                'url' => 'admin/amenities',
                'icon' => 'fas fa-bath', // Updated Icon
            ],
            [
                'text' => 'Features',
                'url' => 'admin/features',
                'icon' => 'fas fa-star',
            ],
            [
                'text' => 'Tags',
                'url' => 'admin/tags',
                'icon' => 'fas fa-tags',
            ],
            [
                'text' => 'Brands',
                'url' => 'admin/brands',
                'icon' => 'fas fa-award',
            ],
        ],
    ],


    // 4. FINANCIALS & MEMBERSHIP
    ['header' => 'FINANCIALS & MEMBERSHIP'],

    // A. Financials (Payments and Reports)
    [
        'text' => 'Financials',
        'icon' => 'fas fa-chart-line',
        'color' => 'warning', // Applied color
        'can'   => 'manage-financials',
        'submenu' => [
            [
                'text' => 'Payments / Checkout',
                'icon' => 'fas fa-money-bill-wave',
                'submenu' => [
                    [
                        'text' => 'All Transactions',
                        'url' => 'admin/payments',
                        'icon' => 'fas fa-receipt',
                    ],
                    [
                        'text' => 'Failed Payments',
                        'url' => 'admin/payments/failed',
                        'icon' => 'fas fa-exclamation-triangle',
                        'color' => 'danger', // Applied color
                    ],
                ],
            ],
            // ** NEW WITHDRAWALS MENU ITEM ADDED HERE **
            [
                'text' => 'Withdrawals',
                'icon' => 'fas fa-hand-holding-usd',
                'submenu' => [
                    [
                        'text' => 'Pending Withdrawals',
                        'url' => 'admin/withdrawals/pending',
                        'icon' => 'fas fa-hourglass-start',
                        'color' => 'warning', // Applied color
                    ],
                    [
                        'text' => 'All Withdrawals',
                        'url' => 'admin/withdrawals',
                        'icon' => 'fas fa-list-alt',
                    ],
                    [
                        'text' => 'Failed Withdrawals',
                        'url' => 'admin/withdrawals/failed',
                        'icon' => 'fas fa-times-circle',
                        'color' => 'danger', // Applied color
                    ],
                ],
            ],
            // Reports & Analytics
            [
                'text' => 'Reports & Analytics',
                'icon' => 'fas fa-chart-bar',
                'can' => 'edit',
                'submenu' => [
                    [
                        'text' => 'Revenue & Payments',
                        'url' => 'admin/reports/payments',
                        'icon' => 'fas fa-dollar-sign',
                    ],
                    [
                        'text' => 'Booking Summary',
                        'url' => 'admin/reports/bookings',
                        'icon' => 'fas fa-calendar-day',
                    ],
                    [
                        'text' => 'Property Occupancy',
                        'url' => 'admin/reports/properties',
                        'icon' => 'fas fa-building',
                    ],
                ],
            ],
        ],
    ],

    // B. Membership & Subscriptions
    [
        'text' => 'Membership',
        'icon' => 'fas fa-id-card',
        'color' => 'primary', // Applied color
        'can'   => ['manage-subscriptions', 'manage-plans'],
        'submenu' => [
            [
                'text' => 'Subscriptions',
                'icon' => 'fas fa-list-alt',
                'can'  => 'manage-subscriptions',
                'submenu' => [
                    [
                        'text' => 'Active Subscriptions',
                        'url' => 'admin/subscriptions/active',
                        'icon' => 'fas fa-check-circle',
                        'color' => 'success', // Applied color
                    ],
                    [
                        'text' => 'All Subscriptions',
                        'url' => 'admin/subscriptions',
                        'icon' => 'fas fa-list-alt',
                    ],
                    [
                        'text' => 'Pending / Expired',
                        'url' => 'admin/subscriptions/pending',
                        'icon' => 'fas fa-hourglass-half',
                        'color' => 'danger', // Applied color
                    ],
                ],
            ],
            [
                'text' => 'Plans',
                'icon' => 'fas fa-box-open',
                'can'  => 'manage-plans',
                'submenu' => [
                    [
                        'text' => 'All Plans',
                        'url' => 'admin/plans',
                        'icon' => 'fas fa-list',
                    ],
                    [
                        'text' => 'Add New Plan',
                        'url' => 'admin/plans/create',
                        'icon' => 'fas fa-plus-circle',
                    ],
                ],
            ],
        ],
    ],


    // 5. CONTENT & MARKETING
    ['header' => 'CONTENT & MARKETING', 'can' => ['manage-blogs', 'manage-pages', 'manage-marketing']],
    
    // A. CMS (Content Management System)
    [
        'text' => 'CMS (Content)',
        'icon' => 'fas fa-edit',
        'color' => 'teal', // Applied color
        'can' => ['manage-blogs', 'manage-pages'],
        'submenu' => [
            
            // --- BLOG MANAGEMENT ---
            [
                'text'    => 'Blog Management',
                'icon'    => 'fas fa-blog',
                'color'   => 'orange',
                'can'     => 'manage-blogs',
                'submenu' => [
                    [
                        'text' => 'All Posts',
                        'url'  => 'admin/blogs',
                        'icon' => 'fas fa-list-ul',
                    ],
                    [
                        'text' => 'Add New Post',
                        'url'  => 'admin/blogs/create',
                        'icon' => 'fas fa-plus-circle',
                    ],
                    [
                        'text' => 'Pending Review',
                        'url'  => 'admin/blogs/pending',
                        'icon' => 'fas fa-hourglass-half text-warning',
                    ],
                ],
            ],
            [
                'text' => 'Pages',
                'url' => 'admin/pages',
                'icon' => 'far fa-fw fa-file-alt', // Updated Icon
                'can' => 'manage-pages',
            ],
            [
                'text' => 'Headers',
                'url' => 'admin/pages/type/header',
                'icon' => 'fas fa-heading', // Updated Icon
            ],
            [
                'text' => 'Footers',
                'url'  => 'admin/pages/type/footer',
                'icon' => 'fas fa-shoe-prints', // Updated Icon
            ],
            [
                'text' => 'Media Gallery',
                'url'  => 'admin/gallery',
                'icon' => 'fas fa-photo-video',
                'color' => 'indigo',
            ],
        ],
    ],

    // B. Marketing Tools
    [
        'text' => 'Marketing Tools',
        'icon' => 'fas fa-chart-pie', // Updated Icon for "Marketing"
        'color' => 'purple', // Applied color
        'can' => 'manage-marketing',
        'submenu' => [
            [
                'text' => 'Newsletter Subscribers',
                'url' => 'admin/newsletter-subscribers',
                'icon' => 'fas fa-mail-bulk',
            ],
            [
                'text' => 'Email Templates',
                'url' => 'admin/email-templates',
                'icon' => 'far fa-fw fa-envelope-open', // Updated Icon
            ],
            [
                'text' => 'Manage Ads',
                'url'  => 'admin/advertisements',
                'icon' => 'fas fa-bullhorn',
                'can'  => 'manage-marketing',
            ],
            [
                'text' => 'Testimonials',
                'url'  => 'admin/testimonials',
                'icon' => 'fas fa-comment-dots',
                'can'  => 'manage-marketing',
            ],
        ],
    ],


    // 6. USERS MANAGEMENT
    [
        'header' => 'USERS MANAGEMENT',
        'can' => ['manage-users', 'app-settings'],
    ],

    [
        'text' => 'Users & Roles',
        'icon' => 'fas fa-users-cog',
        'color' => 'danger', // Applied color
        'submenu' => [
            [
                'text' => 'Manage Users',
                'icon' => 'fas fa-users',
                'can' => 'manage-users',
                'submenu' => [
                    [
                        'text' => 'All Users',
                        'url'  => 'admin/users',
                        'icon' => 'fas fa-list',
                    ],
                    [
                        'text' => 'Buyers',
                        'url' => 'admin/users/buyers',
                        'icon' => 'fas fa-shopping-cart', // Updated Icon
                    ],
                    [
                        'text' => 'Partners',
                        'url' => 'admin/users/partners',
                        'icon' => 'fas fa-handshake', // Updated Icon
                    ],
                ],
            ],
            [
                'text' => 'Manage Roles',
                'url'  => 'admin/roles',
                'icon' => 'fas fa-user-shield',
                'can' => 'app-settings',
            ],
            [
                'text' => 'Manage Permissions',
                'url'  => 'admin/permissions',
                'icon' => 'fas fa-unlock-alt',
                'can' => 'app-settings',
            ],
        ],
    ],


    // 8. SUPPORT
    ['header' => 'SUPPORT'],
    [
        'text' => 'Tickets',
        'url'  => 'admin/tickets',
        'icon' => 'fas fa-ticket-alt',
        'color' => 'success',
        'can'   => 'manage-tickets',
    ],

    // 7. GLOBAL SETTINGS
    ['header' => 'APP SETTINGS', 'can' => 'app-settings'],
    [
        'text' => 'System Configuration',
        'icon' => 'fas fa-cogs', // Updated Icon
        'color' => 'gray', // Applied color
        'can' => 'app-settings',
        'submenu' => [
            [
                'text' => 'General Settings',
                'url'  => 'admin/settings',
                'icon' => 'fas fa-cog',
            ],
            [
                'text' => 'Config Gateways',
                'url'  => 'admin/payment-gateways',
                'icon' => 'fas fa-credit-card',
            ],
            [
                'text' => 'Theme Settings',
                'url'  => 'admin/themes',
                'icon' => 'fas fa-palette',
            ],
            [
                'text' => 'Content By Page',
                'url'  => 'admin/content',
                'icon' => 'fas fa-file-alt',
            ],
            [
                'text' => 'The Menus',
                'url'  => 'admin/menu',
                'icon' => 'fas fa-bars',
            ],
            [
                'text' => 'System Maintenance',
                'url'  => 'admin/system/maintenance',
                'icon' => 'fas fa-tools',
                'color' => 'danger',
            ],
            [
                'text' => 'System Health',
                'url'  => 'admin/system/status',
                'icon' => 'fas fa-heartbeat',
                'color' => 'success',
            ],
        ],
    ],

    // 8. PERSONAL ACCOUNT (Lowest Priority, placed at the very bottom)
    ['header' => 'MY ACCOUNT'],
    [
        'text' => 'My Profile',
        'url' => 'admin/profile/edit',
        'icon' => 'fas fa-fw fa-user',
        'color' => 'blue', // Applied color
    ],
];
