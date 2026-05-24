<?php

return [
    'classifieds_deals' => [
        tm_menu('utility_topbar', 'Utility Topbar', tm_links([
            'Flash Sale',
        ])),
        tm_menu('utility_header', 'Utility Header', tm_links([
            ['Login', '#'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Post a Deal', '#'],
        ])),
        tm_menu('secondary_nav', 'Secondary Nav', tm_links([
            ['All Deals', '#'],
            ['Trending Now', '#'],
            ['Electronics', '#'],
            ['Fashion', '#'],
            ['Home & Garden', '#'],
            ['Vehicles', '#'],
            ['Tools', '#'],
            ['Gaming', '#'],
        ])),
        tm_menu('footer_column_1', 'Buyer Protection', tm_links([
            'Money Back Guarantee',
            'Safe Trading Guide',
            'Report a Seller / Listing',
            'Customer Support Hub',
        ])),
        tm_menu('footer_column_2', 'Sell on DealDash', tm_links([
            'Post a Bargain Item',
            'Merchant Dashboard',
            'Promote Listing Placement',
            'Partner Fee Schedule',
        ])),
        tm_menu('social_footer', 'Social', tm_links([
            'f',
            't',
            'in',
            'yt',
        ])),
    ],

    'classifieds_elite' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Collections',
            'Appraisals',
            'Concierge Hub',
            'Auctions',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Member Login',
        ])),
        tm_menu('footer_column_1', 'Collections', tm_links([
            'Fine Art',
            'Luxury Horology',
            'Rare Vintages',
            'Exotic Motors',
        ])),
        tm_menu('footer_column_2', 'Elite Services', tm_links([
            'Private Brokerage',
            'Asset Appraisals',
            'Vault Storage',
            'Estate Trusts',
        ])),
        tm_menu('footer_column_3', 'Connect', tm_links([
            'Concierge Line',
            'Investor Reports',
            'LinkedIn',
            'Instagram',
        ])),
    ],

    'classifieds_general' => [
        tm_menu('utility_header', 'Utility Header', tm_links([
            ['Log In', '#'],
            ['Sign Up', '#'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Post Ad', '#'],
        ])),
        tm_menu('footer_bottom_bar', 'Footer Bottom Bar', tm_links([
            'About Us',
            'Help & Support',
            'Trust & Safety',
            'Terms',
            'Privacy',
        ])),
    ],

    'classifieds_local' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Activity Feed', '#'],
            ['Messages', '#'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Post Item', '#'],
        ])),
        tm_menu('footer_column_1', 'Community Rules', tm_links([
            'Member Guidelines',
            'Verification',
            'Safe Exchange',
        ])),
        tm_menu('footer_column_2', 'Popular Channels', tm_links([
            'Neighborhood Freebies',
            'Kids & Baby',
            'Bikes & Trails',
        ])),
    ],

    'classifieds_modern' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Browse', '#'],
            ['Messages', '#'],
            ['Profile', '#'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Post Ad', '#'],
        ])),
        tm_menu('footer_bottom_bar', 'Footer Bottom Bar', tm_links([
            'Terms',
            'Privacy',
            'Safety',
            'Contact Support',
        ])),
    ],

    'classifieds_premium' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Businesses',
            'Appraisals',
            'Brokers',
            'Private Hub',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'List Business',
        ])),
        tm_menu('footer_column_1', 'Acquisitions', tm_links([
            'SaaS',
            'Hospitality',
            'Local Retail',
        ])),
        tm_menu('footer_column_2', 'Professional Services', tm_links([
            'Valuations',
            'M&A',
            'Due Diligence',
        ])),
        tm_menu('footer_column_3', 'Legal & Trust', tm_links([
            'Vetting',
            'NDA',
            'Escrow',
        ])),
    ],
];
