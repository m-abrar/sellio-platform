<?php

return [
    'autos_classic' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Home', '#home'],
            ['Listings', '#listings'],
            ['Auctions', '#auctions'],
            ['Dealers', '#dealers'],
            ['Contact', '#contact'],
        ], 'autos')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Sell Your Car', '#sell'],
        ])),
        tm_menu('footer_column_1', 'Quick Links', tm_links([
            ['Home', '#home'],
            ['Current Listings', '#listings'],
            ['Live Auctions', '#auctions'],
            ['Dealer Network', '#dealers'],
        ])),
        tm_menu('footer_column_2', 'Support', tm_links([
            'FAQs',
            'Terms & Conditions',
            'Privacy Policy',
            'Careers',
        ])),
    ],

    'autos_electric' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Home', '#home'],
            ['EV Models', '#ev-models'],
            ['Charging', '#charging'],
            ['Compare', '#compare'],
            ['Contact', '#contact'],
        ], 'autos')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Find Your EV',
        ])),
        tm_menu('footer_column_1', 'Explore', tm_links([
            ['EV Models', '#featured-evs'],
            ['Compare', '#compare-evs'],
            ['Charging Map', '#charging'],
            'Financing',
        ])),
        tm_menu('footer_column_2', 'Company', tm_links([
            'About Us',
            'Careers',
            'Press',
            'Partnerships',
        ])),
        tm_menu('footer_column_3', 'Legal & Support', tm_links([
            'Privacy Policy',
            'Terms of Service',
            'FAQ',
            'Contact Support',
        ])),
        tm_menu('social_footer', 'Social', tm_links([
            'Facebook',
            'Twitter',
            'Instagram',
        ])),
    ],

    'autos_luxury' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Home', '#home'],
            ['Collections', '#collections'],
            ['Brands', '#brands'],
            ['Dealers', '#dealers'],
            ['Contact', '#contact'],
        ], 'autos')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Book a Test Drive',
        ])),
        tm_menu('footer_column_1', 'Quick Links', tm_links([
            'Inventory',
            'Finance',
            'About Us',
            'FAQ',
        ])),
        tm_menu('footer_column_2', 'Support', tm_links([
            'Contact',
            'Dealers',
            'Privacy Policy',
            'Terms',
        ])),
        tm_menu('footer_column_3', 'Connect', tm_links([
            'info@velvetwheels.com',
        ])),
    ],

    'autos_modern' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Home', '/'],
            ['Listings', '/explore'],
            ['Brands', '#brands'],
            ['Compare', '#compare'],
        ], 'autos')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Sell Your Car', '/explore'],
        ])),
        tm_menu('footer_column_1', 'Company', tm_links([
            'About Us',
            'Careers',
            'Press',
            'Sitemap',
        ])),
        tm_menu('footer_column_2', 'Support', tm_links([
            'Help Center',
            'FAQ',
            'Contact Sales',
            ['Vehicle Reviews', '/explore'],
        ])),
        tm_menu('footer_column_3', 'Connect', tm_links([
            'Twitter',
            'LinkedIn',
            'Facebook',
            'Instagram',
        ])),
        tm_social_standard(),
    ],

    'autos_used' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Home', '#home'],
            ['Browse Cars', '#browse-cars'],
            ['Dealers', '#dealers'],
            ['Sell Your Car', '#sell-your-car'],
            ['Contact', '#contact'],
        ], 'autos')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Post Your Ad',
        ])),
        tm_menu('footer_column_1', 'Quick Links', tm_links([
            ['Browse Cars', '#featured-listings'],
            ['Sell Your Car', '#how-it-works'],
            ['Our Dealers', '#trusted-dealers'],
            'FAQs',
        ])),
        tm_menu('footer_column_2', 'About', tm_links([
            'About Us',
            'Terms of Service',
            'Privacy Policy',
            'Contact',
        ])),
        tm_menu('footer_column_3', 'Connect', tm_links([
            'Facebook',
            'Twitter',
            'Instagram',
            'LinkedIn',
        ])),
        tm_social_standard(),
    ],
];
