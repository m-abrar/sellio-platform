<?php

$healthFooterLinks = tm_links([
    'Registry',
    'Protocols',
    'Research',
    'Secure Auth',
]);

return [
    'services_corporate' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Home', '#home'],
            ['Services', '#services'],
            ['About', '#about'],
            ['Case Studies', '#case-studies'],
            ['Contact', '#contact'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Get a Quote', '#contact'],
        ])),
        tm_menu('footer_column_1', 'Quick Links', tm_links([
            ['Home', '#home'],
            ['Services', '#services'],
            ['About', '#about'],
            ['Case Studies', '#case-studies'],
        ])),
        tm_menu('footer_column_2', 'Our Services', tm_links([
            'Business Strategy',
            'Corporate Finance',
            'Digital Transformation',
            'M&A Advisory',
        ])),
    ],

    'services_creative' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Home', '#home'],
            ['Categories', '#categories'],
            ['Portfolios', '#portfolios'],
            ['Pricing', '#pricing'],
            ['Contact', '#contact'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Hire a Creative', '#'],
        ])),
        tm_menu('footer_column_1', 'About Us', tm_links([
            'Careers',
            'Our Story',
            'Press',
            'Blog',
        ])),
        tm_menu('footer_column_2', 'Services', tm_links([
            'Hire Creative',
            'Post Project',
            'Freelancer Sign Up',
            'Affiliate',
        ])),
        tm_menu('footer_column_3', 'Support & Legal', tm_links([
            'Help',
            'Terms',
            'Privacy',
            'Cookies',
        ])),
    ],

    'services_health' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Clinicians', '#registry'],
            ['Protocols', '#protocols'],
            ['Telemetry', '#telemetry'],
            ['Patient Portal', '#contact'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Secure Node Active',
        ])),
        ...tm_footer_node_cols('CLINICIANS', 'GOVERNANCE', 'SUPPORT', $healthFooterLinks),
        tm_social_os(),
    ],

    'services_local' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Home', '#local-hero-section'],
            ['Services', '#services'],
            ['Providers', '#providers'],
            ['Testimonials', '#testimonials'],
        ])),
        tm_menu('footer_column_1', 'About', tm_links([
            'About Us',
            'Services',
            'Careers',
            'FAQ',
        ])),
        tm_menu('footer_column_2', 'For Pros', tm_links([
            'Sign Up',
            'Provider Login',
            'Safety Guidelines',
        ])),
    ],

    'services_marketplace' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Home', '#sm-hero-section'],
            ['Categories', '#sm-categories-section'],
            ['Providers', '#sm-providers-section'],
            ['How It Works', '#sm-how-it-works'],
            ['Testimonials', '#sm-testimonials-section'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Post a Service', '#'],
        ])),
        tm_menu('footer_column_1', 'Quick Links', tm_links([
            'About',
            'Careers',
            'Blog',
            'Press',
        ])),
        tm_menu('footer_column_2', 'Providers', tm_links([
            'Join',
            'Login',
            'Pricing',
            'Trust',
        ])),
        tm_menu('footer_column_3', 'Support', tm_links([
            'Help',
            'Contact',
            'Privacy',
            'Terms',
        ])),
    ],
];
