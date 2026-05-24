<?php

$heritageSpotlightLinks = tm_links([
    'Registry',
    'Archives',
    'Protocols',
    'Auth',
]);

return [
    'properties_classic' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['COLLECTION', '/explore'],
            ['AGENTS', '/explore'],
            ['PROVENANCE', '/explore'],
            ['REGISTRY', '/cart'],
        ], 'properties')),
        tm_menu('utility_header', 'Utility Header', tm_links([
            'LOGIN',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['INQUIRE', '/cart'],
        ])),
        tm_menu('footer_column_1', 'Collections', tm_links([
            'Manorial Estates',
            'Historic Chateaus',
            'Urban Heritage',
            'Legacy Registry',
        ])),
        tm_menu('footer_column_2', 'Heritage Spotlight', $heritageSpotlightLinks),
        tm_menu('footer_column_3', 'Registry Updates', tm_links([
            'Join Protocol',
            'Global Feed',
            'Archive Sync',
        ])),
        tm_menu('footer_bottom_bar', 'Legal', tm_links([
            'PRIVACY',
            'TERMS',
            'PROVENANCE',
        ])),
    ],

    'properties_commercial' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Registry', '#pc-inventory-section'],
            ['Yield Sync', '#pc-intelligence-section'],
            ['Institutional', '#pc-cta-section'],
            ['Master Auth', '#pc-cta-section'],
        ], 'properties')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['Audit Stable', '#pc-inventory-section'],
        ])),
        ...tm_footer_node_cols('ACQUISITION', 'AUDIT', 'GOVERNANCE', tm_node_links()),
        tm_social_os(),
    ],

    'properties_investment' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Registry',
            'Portfolio_Sync',
            'Institutional',
            'Master_Auth',
        ], 'properties')),
        ...tm_footer_node_cols('PORTFOLIO', 'INSTITUTIONAL', 'GOVERNANCE', tm_node_links()),
        tm_social_os(),
    ],

    'properties_luxury' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'COLLECTION',
            'RESIDENCES',
            'OFF-MARKET',
            'CONCIERGE',
        ], 'properties')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'INQUIRE',
        ])),
        tm_menu('footer_column_1', 'COLLECTION', tm_links([
            'The Residences',
            'Off-Market Nodes',
            'New Developments',
            'Island Portfolio',
        ])),
        tm_menu('footer_column_2', 'SERVICES', tm_links([
            'Private Concierge',
            'Asset Management',
            'Global Logistics',
            'Legal Protocol',
        ])),
        tm_menu('footer_column_3', 'INSTITUTION', tm_links([
            'The Registry',
            'Partnerships',
            'Contact',
            'Privacy',
        ])),
    ],

    'properties_map' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['CARTOGRAPHY', '/explore'],
            ['SPATIAL', '/explore'],
            ['REGISTRY', '/explore'],
            ['NODES', '/explore'],
        ], 'properties')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'SEARCH_SPATIAL',
        ])),
        tm_menu('footer_column_1', 'SPATIAL', tm_links([
            'Cartography',
            'Spatial Sync',
            'Grid Logic',
            'Registry',
        ])),
        tm_menu('footer_column_2', 'SYSTEMS', tm_links([
            'Geo Node',
            'Distribution',
            'Global Sync',
        ])),
        tm_menu('footer_column_3', 'NETWORK', tm_links([
            'Verification',
            'Governance',
            'Contact',
        ])),
    ],

    'properties_modern' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['RESIDENTIAL', '#urban-structure-grid'],
            ['COMMERCIAL', '#urban-precision-section'],
            ['DISTRICTS', '#urban-structure-grid'],
            ['SKYLINE', '#urban-hero-section'],
        ], 'properties')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['EXPLORE_UNITS', '#urban-structure-grid'],
        ])),
        tm_menu('footer_column_1', 'DISTRICTS', tm_links([
            'Downtown Node',
            'Skyline Grid',
            'Structural Hub',
            'Civic Logic',
        ])),
        tm_menu('footer_column_2', 'SYSTEMS', tm_links([
            'Unit Registry',
            'Distribution',
            'Global Sync',
        ])),
        tm_menu('footer_column_3', 'NETWORK', tm_links([
            'Verification',
            'Governance',
            'Contact Hub',
        ])),
    ],

    'properties_neighborhood' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Community',
            'Local_Guides',
            'Safety_Index',
            'Support',
        ], 'properties')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'JOIN_HOOD',
        ])),
        ...tm_footer_node_cols('COMMUNITY', 'GUIDES', 'LOCAL', tm_node_links()),
        tm_social_os(),
    ],

    'properties_platinum' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Collection', '#pl-showcase-section'],
            ['Insights', '#pl-protocol-section'],
            ['Concierge', '#pl-cta-section'],
            ['Private Auth', '#pl-cta-section'],
        ], 'properties')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            ['ACCESS_SECURE_NODE', '#pl-showcase-section'],
        ])),
        ...tm_footer_node_cols('ACQUISITION', 'RESOURCES', 'LEGAL', tm_node_links()),
        tm_social_os(),
    ],

    'properties_rental' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Discover',
            'Verified_Nodes',
            'Tenants',
            'Leasing_FAQ',
        ], 'properties')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'GET_STARTED',
        ])),
        ...tm_footer_node_cols('RESOURCES', 'TENANTS', 'LEGAL', tm_node_links()),
        tm_social_os(),
    ],

    'properties_showcase' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Collection',
            'Atelier_Specs',
            'Provenance_Data',
            'Private_Auth',
        ], 'properties')),
        ...tm_footer_node_cols('COLLECTION', 'ATELIER', 'INSTITUTIONAL', tm_node_links()),
        tm_social_os(),
    ],

    'properties_unified' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'All_Assets',
            'Intelligence',
            'Distribution',
            'Master_Auth',
        ], 'properties')),
        ...tm_footer_node_cols('NETWORK', 'VALUATION', 'GOVERNANCE', tm_node_links()),
        tm_social_os(),
    ],

    'properties_urban' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Districts',
            'Verticals',
            'Intelligence',
            'Node_Auth',
        ], 'properties')),
        ...tm_footer_node_cols('DISTRICTS', 'PROTOCOL', 'INSTITUTIONAL', tm_node_links()),
        tm_social_os(),
    ],

    'properties_vacation' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Destinations',
            'Experiences',
            'Retreats',
            'Local_Nodes',
        ], 'properties')),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'BOOK NOW',
        ])),
        ...tm_footer_node_cols('DESTINATIONS', 'PROTOCOL', 'COMPANY', tm_node_links()),
        tm_social_os(),
    ],
];
