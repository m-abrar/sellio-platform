<?php

/**
 * Public marketing and live demo URLs for the CodeCanyon landing page.
 * Update this file when demo subdomains change.
 */
return [
    'marketing' => 'https://sellio.vebdez.com',
    'documentation' => 'https://sellio.vebdez.com/documentation',
    'demo' => [
        'storefront' => 'https://demo.sellio.vebdez.com',
        'admin' => 'https://demo.sellio.vebdez.com/admin',
        'login' => 'https://demo.sellio.vebdez.com/login',
        'install' => 'https://demo.sellio.vebdez.com/install',
        'seller' => 'https://seller-panel.sellio.vebdez.com',
        'buyer' => 'https://buyer-panel.sellio.vebdez.com',
        'nextjs' => 'https://frontend.sellio.vebdez.com',
    ],
    'demo_accounts' => [
        [
            'role' => 'Admin',
            'email' => 'admin@sellio-platform.test',
            'password' => 'admin123',
            'url_key' => 'admin',
            'icon' => 'fa-shield-halved',
            'color' => 'primary',
        ],
        [
            'role' => 'Seller',
            'email' => 'partner@sellio-platform.test',
            'password' => 'partner123',
            'url_key' => 'seller',
            'icon' => 'fa-store',
            'color' => 'success',
        ],
        [
            'role' => 'Buyer',
            'email' => 'buyer@sellio-platform.test',
            'password' => 'buyer123',
            'url_key' => 'buyer',
            'icon' => 'fa-shopping-bag',
            'color' => 'info',
        ],
    ],
];
