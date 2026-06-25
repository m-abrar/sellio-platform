<?php
/**
 * Administrative Navigation Schema
 *
 * This file constructs the hierarchical menu structure for the AdminLTE sidebar and topbar.
 * It implements fine-grained access control via 'can' gates and 'module' checks,
 * grouping administrative features into high-priority operational blocks
 * (Listings, Bookings, Financials, Content, RBAC).
 */

if (! function_exists('admin_sidebar_item')) {
    /**
     * @param  array<string, mixed>  $item
     * @return array<string, mixed>
     */
    function admin_sidebar_item(string $short, array $item = [], ?string $full = null): array
    {
        $full = $full ?? $short;
        $item['text'] = $short;

        if ($full !== $short) {
            $item['data'] = array_merge($item['data'] ?? [], [
                'toggle' => 'tooltip',
                'placement' => 'right',
                'full-title' => $full,
            ]);
        }

        return $item;
    }
}

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
    admin_sidebar_item('Ecommerce', [
        'url'  => 'admin/dashboard/ecommerce',
        'icon' => 'fas fa-shopping-cart',
        'module' => 'products',
        'can'    => 'manage-products',
    ], 'Ecommerce Overview'),

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
            admin_sidebar_item('Pending', [
                'url' => 'admin/listings/pending',
                'icon' => 'fas fa-hourglass-start',
            ], 'Pending Approval'),
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
    admin_sidebar_item('Bookings', [
        'icon' => 'fas fa-calendar-alt',
        'can'  => 'manage-bookings',
        'submenu' => [
             admin_sidebar_item('All Bookings', [
                'url' => 'admin/bookings',
                'icon' => 'fas fa-layer-group',
             ], 'All Bookings & Leads'),
             [
                'text' => 'Product Orders',
                'url' => 'admin/product-orders',
                'icon' => 'fas fa-truck',
                'module' => 'products',
             ],
             admin_sidebar_item('Property', [
                'url' => 'admin/bookings/properties',
                'icon' => 'fas fa-building',
                'module' => 'properties',
             ], 'Property Bookings'),
             admin_sidebar_item('Auto', [
                'url' => 'admin/bookings/autos',
                'icon' => 'fas fa-car',
                'module' => 'autos',
             ], 'Auto Inquiries'),
             admin_sidebar_item('Events', [
                'url' => 'admin/bookings/events',
                'icon' => 'fas fa-calendar-check',
                'module' => 'events',
             ], 'Event Bookings'),
             admin_sidebar_item('Jobs', [
                'url' => 'admin/bookings/jobs',
                'icon' => 'fas fa-briefcase',
                'module' => 'jobs',
             ], 'Job Applications'),
             admin_sidebar_item('Services', [
                'url' => 'admin/bookings/services',
                'icon' => 'fas fa-hand-holding-heart',
                'module' => 'services',
             ], 'Service Bookings'),
             admin_sidebar_item('Classifieds', [
                'url' => 'admin/bookings/classifieds',
                'icon' => 'fas fa-bullhorn',
                'module' => 'classifieds',
             ], 'Classified Leads'),
        ],
    ], 'Bookings & Inquiries'),

    // 3. CORE BUSINESS - LISTING ATTRIBUTES (Sub-settings for Listings)
    [
        'header' => 'LISTING ATTRIBUTES',
    ],
    admin_sidebar_item('Attributes', [
        'icon' => 'fas fa-sliders-h',
        'color' => 'secondary',
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
    ], 'Manage Attributes'),


    // 4. FINANCIALS & MEMBERSHIP
    ['header' => 'FINANCIALS & MEMBERSHIP'],

    // A. Financials (Payments and Reports)
    [
        'text' => 'Financials',
        'icon' => 'fas fa-chart-line',
        'color' => 'warning', // Applied color
        'can'   => 'manage-financials',
        'submenu' => [
            admin_sidebar_item('Payments', [
                'icon' => 'fas fa-money-bill-wave',
                'submenu' => [
                    admin_sidebar_item('Transactions', [
                        'url' => 'admin/payments',
                        'icon' => 'fas fa-receipt',
                    ], 'All Transactions'),
                    admin_sidebar_item('Pending Approval', [
                        'url' => 'admin/payments/pending-manual',
                        'icon' => 'fas fa-hourglass-half',
                        'color' => 'warning',
                    ], 'Pending Manual Payments'),
                    admin_sidebar_item('Failed', [
                        'url' => 'admin/payments/failed',
                        'icon' => 'fas fa-exclamation-triangle',
                        'color' => 'danger',
                    ], 'Failed Payments'),
                ],
            ], 'Payments / Checkout'),
            // ** NEW WITHDRAWALS MENU ITEM ADDED HERE **
            [
                'text' => 'Withdrawals',
                'icon' => 'fas fa-hand-holding-usd',
                'submenu' => [
                    admin_sidebar_item('Pending', [
                        'url' => 'admin/withdrawals/pending',
                        'icon' => 'fas fa-hourglass-start',
                        'color' => 'warning',
                    ], 'Pending Withdrawals'),
                    admin_sidebar_item('All', [
                        'url' => 'admin/withdrawals',
                        'icon' => 'fas fa-list-alt',
                    ], 'All Withdrawals'),
                    admin_sidebar_item('Failed', [
                        'url' => 'admin/withdrawals/failed',
                        'icon' => 'fas fa-times-circle',
                        'color' => 'danger',
                    ], 'Failed Withdrawals'),
                ],
            ],
            admin_sidebar_item('Reports', [
                'icon' => 'fas fa-chart-bar',
                'can' => 'edit',
                'submenu' => [
                    admin_sidebar_item('Revenue', [
                        'url' => 'admin/reports/payments',
                        'icon' => 'fas fa-dollar-sign',
                    ], 'Revenue & Payments'),
                    admin_sidebar_item('Bookings', [
                        'url' => 'admin/reports/bookings',
                        'icon' => 'fas fa-calendar-day',
                    ], 'Booking Summary'),
                    admin_sidebar_item('Occupancy', [
                        'url' => 'admin/reports/properties',
                        'icon' => 'fas fa-building',
                    ], 'Property Occupancy'),
                ],
            ], 'Reports & Analytics'),
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
                    admin_sidebar_item('Active', [
                        'url' => 'admin/subscriptions/active',
                        'icon' => 'fas fa-check-circle',
                        'color' => 'success',
                    ], 'Active Subscriptions'),
                    admin_sidebar_item('All', [
                        'url' => 'admin/subscriptions',
                        'icon' => 'fas fa-list-alt',
                    ], 'All Subscriptions'),
                    admin_sidebar_item('Pending', [
                        'url' => 'admin/subscriptions/pending',
                        'icon' => 'fas fa-hourglass-half',
                        'color' => 'danger',
                    ], 'Pending / Expired'),
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
                    admin_sidebar_item('Add Plan', [
                        'url' => 'admin/plans/create',
                        'icon' => 'fas fa-plus-circle',
                    ], 'Add New Plan'),
                ],
            ],
        ],
    ],


    // 5. CONTENT & MARKETING
    ['header' => 'CONTENT & MARKETING', 'can' => ['manage-blogs', 'manage-pages', 'manage-marketing']],
    
    // A. CMS (Content Management System)
    admin_sidebar_item('CMS', [
        'icon' => 'fas fa-edit',
        'color' => 'teal',
        'can' => ['manage-blogs', 'manage-pages'],
        'submenu' => [
            admin_sidebar_item('Blog', [
                'icon'    => 'fas fa-blog',
                'color'   => 'orange',
                'can'     => 'manage-blogs',
                'submenu' => [
                    [
                        'text' => 'All Posts',
                        'url'  => 'admin/blogs',
                        'icon' => 'fas fa-list-ul',
                    ],
                    admin_sidebar_item('Add Post', [
                        'url'  => 'admin/blogs/create',
                        'icon' => 'fas fa-plus-circle',
                    ], 'Add New Post'),
                    admin_sidebar_item('Pending', [
                        'url'  => 'admin/blogs/pending',
                        'icon' => 'fas fa-hourglass-half text-warning',
                    ], 'Pending Review'),
                ],
            ], 'Blog Management'),
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
            admin_sidebar_item('Gallery', [
                'url'  => 'admin/gallery',
                'icon' => 'fas fa-photo-video',
                'color' => 'indigo',
            ], 'Media Gallery'),
        ],
    ], 'CMS (Content)'),

    // B. Marketing Tools
    admin_sidebar_item('Marketing', [
        'icon' => 'fas fa-chart-pie',
        'color' => 'purple',
        'can' => 'manage-marketing',
        'submenu' => [
            admin_sidebar_item('Newsletter', [
                'url' => 'admin/newsletter-subscribers',
                'icon' => 'fas fa-mail-bulk',
            ], 'Newsletter Subscribers'),
            admin_sidebar_item('Templates', [
                'url' => 'admin/email-templates',
                'icon' => 'far fa-fw fa-envelope-open',
            ], 'Email Templates'),
            admin_sidebar_item('Search Analytics', [
                'url' => 'admin/reports/searches',
                'icon' => 'fas fa-search',
            ], 'Search Query Analytics'),
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
    ], 'Marketing Tools'),


    // 6. USERS MANAGEMENT
    [
        'header' => 'USERS MANAGEMENT',
        'can' => ['manage-users', 'app-settings'],
    ],

    admin_sidebar_item('Users', [
        'icon' => 'fas fa-users-cog',
        'color' => 'danger',
        'submenu' => [
            admin_sidebar_item('Accounts', [
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
                        'icon' => 'fas fa-handshake',
                    ],
                ],
            ], 'Manage Users'),
            admin_sidebar_item('Roles', [
                'url'  => 'admin/roles',
                'icon' => 'fas fa-user-shield',
                'can' => 'app-settings',
            ], 'Manage Roles'),
            admin_sidebar_item('Permissions', [
                'url'  => 'admin/permissions',
                'icon' => 'fas fa-unlock-alt',
                'can' => 'app-settings',
            ], 'Manage Permissions'),
        ],
    ], 'Users & Roles'),


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
    admin_sidebar_item('System', [
        'icon' => 'fas fa-cogs',
        'color' => 'gray',
        'can' => 'app-settings',
        'submenu' => [
            admin_sidebar_item('General', [
                'url'  => 'admin/settings',
                'icon' => 'fas fa-cog',
            ], 'General Settings'),
            admin_sidebar_item('Gateways', [
                'url'  => 'admin/payment-gateways',
                'icon' => 'fas fa-credit-card',
            ], 'Config Gateways'),
            admin_sidebar_item('Themes', [
                'url'  => 'admin/themes',
                'icon' => 'fas fa-palette',
            ], 'Theme Settings'),
            admin_sidebar_item('Content', [
                'url'  => 'admin/content',
                'icon' => 'fas fa-file-alt',
            ], 'Content By Page'),
            [
                'text' => 'Menus',
                'url'  => 'admin/menu',
                'icon' => 'fas fa-bars',
            ],
            admin_sidebar_item('Maintenance', [
                'url'  => 'admin/system/maintenance',
                'icon' => 'fas fa-tools',
                'color' => 'danger',
            ], 'System Maintenance'),
            admin_sidebar_item('Health', [
                'url'  => 'admin/system/status',
                'icon' => 'fas fa-heartbeat',
                'color' => 'success',
            ], 'System Health'),
        ],
    ], 'System Configuration'),

    // 8. PERSONAL ACCOUNT (Lowest Priority, placed at the very bottom)
    ['header' => 'MY ACCOUNT'],
    [
        'text' => 'My Profile',
        'url' => 'admin/profile/edit',
        'icon' => 'fas fa-fw fa-user',
        'color' => 'blue', // Applied color
    ],
];
