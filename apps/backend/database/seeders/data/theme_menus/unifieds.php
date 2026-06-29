<?php

$classicFooterLinks = tm_links([
    'Registry',
    'Provenance',
    'Support Nodes',
    'Auth Registry',
]);

$modernFooterLinks = tm_links([
    'Nodal Registry',
    'Capacity Hub',
    'System Spec',
    'Stable Sync',
]);

$marketplaceExploreLinks = tm_links([
    ['Browse all listings', '/explore'],
    ['Products', '/explore?category=products'],
    ['Properties', '/explore?category=properties'],
    ['Autos', '/explore?category=autos'],
    ['Services', '/explore?category=services'],
    ['Jobs', '/explore?category=jobs'],
]);

$marketplaceCompanyLinks = tm_links([
    ['About', '/about'],
    ['Contact', '/contact'],
    ['FAQ', '/faq'],
]);

$marketplaceTrustLinks = tm_links([
    'Buyer Protection',
    'Seller Guide',
    'Terms of Service',
    'Privacy Policy',
]);

$interactiveFooterLinks = tm_links([
    'Transition Sync',
    'Metrics Hub',
    'Dynamic System',
    'Fluid Node',
]);

return [
    'unifieds_default' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Browse', '/explore'],
            ['Sell', '/dashboard/listings/create'],
            ['How it works', '/about'],
            ['Pricing', '/pricing'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Get started',
        ])),
        tm_menu('footer_column_1', 'Company', tm_links([
            ['About', '/about'],
            ['Blog', '/blog'],
            ['Contact', '/contact'],
        ])),
        tm_menu('footer_column_2', 'Marketplace', tm_links([
            ['Explore listings', '/explore'],
            ['Your cart', '/cart'],
            ['Checkout', '/checkout'],
        ])),
        tm_menu('footer_column_3', 'Support', tm_links([
            'Terms of service',
            'Privacy policy',
            'Cookie policy',
        ])),
        tm_social_standard(),
    ],

    'unifieds_classic' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Archive',
            'Chronicles',
            'Registry',
            'Provenance',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Enter Archive',
        ])),
        ...tm_footer_node_cols('ARCHIVES', 'PROTOCOL', 'INSTITUTION', $classicFooterLinks),
        tm_social_os(),
    ],

    'unifieds_modern' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Core Engine',
            'Showcase',
            'Subscription',
            'Nodal Tech',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'INITIALIZE NODE',
        ])),
        ...tm_footer_node_cols('RESOURCES', 'PARADIGMS', 'COMPANY', $modernFooterLinks),
        tm_social_os(),
    ],

    'unifieds_standard' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Logic Layers',
            'Efficiency',
            'Precision Spec',
            'Verified Nodes',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'INITIALIZE NODE',
        ])),
        ...tm_footer_node_cols('RESOURCES', 'PRECISION', 'COMPANY', $modernFooterLinks),
        tm_social_os(),
    ],

    'unifieds_mega' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Infrastructure',
            'Capacity',
            'Redundancy',
            'Provenances',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'INITIALIZE MEGA SYNC',
        ])),
        ...tm_footer_node_cols('RESOURCES', 'PRODUCTS', 'COMPANY', $modernFooterLinks),
        tm_social_os(),
    ],

    'unifieds_marketplace' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Explore', '/explore'],
            ['About', '/about'],
            ['FAQ', '/faq'],
            ['Contact', '/contact'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Explore listings', '/explore'],
        ])),
        tm_menu('footer_column_1', 'Marketplace', $marketplaceExploreLinks),
        tm_menu('footer_column_2', 'Company', $marketplaceCompanyLinks),
        tm_menu('footer_column_3', 'Trust', $marketplaceTrustLinks),
        tm_social_os(),
    ],

    'unifieds_interactive' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Logic',
            'Grid',
            'Transitions',
            'Provenances',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'INITIALIZE SYNC',
        ])),
        ...tm_footer_node_cols('LOGICS', 'TRANSITIONS', 'SECURITY', $interactiveFooterLinks),
        tm_social_os(),
    ],

    'unifieds_minimal' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Home', '/'],
            ['Explore', '/explore'],
            ['Cart', '/cart'],
        ])),
        tm_menu('utility_header', 'Utility Header', tm_links([
            'Post Listing',
        ])),
        tm_menu('footer_column_1', 'Company', tm_links([
            'About',
            'Careers',
            'Press',
        ])),
        tm_menu('footer_column_2', 'Support', tm_links([
            'Contact',
            'Help',
            'FAQs',
        ])),
        tm_menu('footer_column_3', 'Legal', tm_links([
            'Terms',
            'Privacy',
            'Cookies',
        ])),
        tm_social_standard(),
    ],
];
