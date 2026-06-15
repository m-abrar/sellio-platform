<?php

$defaultShopFooterLinks = tm_links([
    'New Arrivals',
    'Essentials',
    'Lookbook',
    'Shipping',
]);

$fashionFooterLinks = tm_links([
    'Runway',
    'Editorial',
    'Bespoke',
    'Auth',
]);

return [
    'ecommerce_default' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Collection',
            'Essentials',
            'Lookbook',
            'Support',
        ], 'products')),
        tm_menu('utility_header', 'Utility Header', tm_links([
            'CART',
            'SEARCH',
        ])),
        ...tm_footer_node_cols('SHOP', 'COLLECTIVE', 'SUPPORT', $defaultShopFooterLinks),
        tm_menu('social_footer', 'Social', tm_links([
            'INSTAGRAM',
            'LINKEDIN',
            'X_SHOP',
        ])),
    ],

    'ecommerce_b2b' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Catalog', '/explore'],
            ['Industries', '/explore'],
            ['RFQ Flow', '/#b2b-rfq'],
            ['Procurement', '/explore'],
        ])),
        tm_menu('utility_header', 'Utility Header', tm_links([
            ['Request Quote', '/#b2b-rfq'],
            ['Supplier Login', '#'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Create RFQ', '/#b2b-rfq'],
        ])),
        tm_menu('footer_column_1', 'Catalog', tm_links([
            ['All Products', '/explore'],
            ['Technical Specs', '/explore'],
            ['Bulk Pricing', '/explore'],
        ])),
        tm_menu('footer_column_2', 'Procurement', tm_links([
            ['RFQ Requests', '/#b2b-rfq'],
            ['Lead Times', '/explore'],
            ['Buyer Support', '/explore'],
        ])),
        tm_menu('footer_column_3', 'Suppliers', tm_links([
            ['Vendor Portal', '#'],
            ['Compliance', '/explore'],
            ['Private Catalogs', '/explore'],
        ])),
        tm_menu('social_footer', 'Social', tm_links([
            ['LinkedIn', '#'],
            ['Trade Shows', '#'],
            ['Support', '#'],
        ])),
    ],

    'ecommerce_fashion' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Collection',
            'Editorial',
            'Lookbook',
            'Atelier_Auth',
        ], 'products')),
        ...tm_footer_node_cols('COLLECTIONS', 'ATELIER', 'GOVERNANCE', $fashionFooterLinks),
        tm_menu('social_footer', 'Social', tm_links([
            'INSTAGRAM',
            'LINKEDIN',
            'X_ATELIER',
        ])),
    ],

    'ecommerce_electronics' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Components', '#components'],
            ['Systems', '#systems'],
            ['Peripherals', '#peripherals'],
        ], 'products')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'SEARCH',
            'CART',
        ])),
        tm_menu('footer_column_1', 'Hardware', tm_links([
            ['Processors', '#'],
            ['Graphics', '#'],
            ['Motherboards', '#'],
            ['Memory', '#'],
        ])),
        tm_menu('footer_column_2', 'Support', tm_links([
            ['Track Order', '#'],
            ['Returns', '#'],
            ['Technical', '#'],
            ['Contact', '#'],
        ])),
    ],

    'ecommerce_luxury' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Collections', '#collections'],
            ['Timepieces', '#watches'],
            ['Jewelry', '#jewelry'],
            ['Heritage', '#heritage'],
        ], 'products')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Search',
            'Account',
            'Bag',
        ])),
        tm_menu('footer_column_1', 'Client Services', tm_links([
            ['Contact Us', '#'],
            ['Track Order', '#'],
            ['Returns & Exchanges', '#'],
            ['Care Guidelines', '#'],
        ])),
        tm_menu('footer_column_2', 'The Maison', tm_links([
            ['La Maison', '#'],
            'Careers',
            'Sustainability',
            'Boutiques',
        ])),
    ],
];
