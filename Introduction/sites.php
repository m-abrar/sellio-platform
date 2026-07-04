<?php

/**
 * Public marketing and live demo URLs for the CodeCanyon landing page.
 * Update this file when demo subdomains change.
 */
return [
    'marketing' => 'https://sellio.buzz',
    'documentation' => 'https://sellio.buzz/documentation',
    'demo' => [
        'storefront' => 'https://demo.sellio.buzz',
        'admin' => 'https://demo.sellio.buzz/admin',
        'login' => 'https://demo.sellio.buzz/login',
        'install' => 'https://demo.sellio.buzz/install',
        'seller' => 'https://seller-panel.sellio.buzz',
        'buyer' => 'https://buyer-panel.sellio.buzz',
        'nextjs' => 'https://frontend.sellio.buzz',
    ],
    'demo_accounts' => [
        [
            'role' => 'Admin',
            'email' => 'admin@sellio.buzz',
            'password' => 'admin123',
            'url_key' => 'admin',
            'icon' => 'fa-shield-halved',
            'color' => 'primary',
        ],
        [
            'role' => 'Seller',
            'email' => 'partner@sellio.buzz',
            'password' => 'partner123',
            'url_key' => 'seller',
            'icon' => 'fa-store',
            'color' => 'success',
        ],
        [
            'role' => 'Buyer',
            'email' => 'buyer@sellio.buzz',
            'password' => 'buyer123',
            'url_key' => 'buyer',
            'icon' => 'fa-shopping-bag',
            'color' => 'info',
        ],
    ],
];
