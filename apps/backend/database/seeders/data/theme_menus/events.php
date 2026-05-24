<?php

return [
    'events_classic' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'The Repertoire',
            'Patrons',
            'Archives',
            'Institutional',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Patron Portal',
        ])),
        ...tm_footer_node_cols('REPERTOIRE', 'PATRONS', 'GOVERNANCE', tm_links([
            'Registry',
            'Archives',
            'Protocols',
            'Auth',
        ])),
        tm_social_os(),
    ],

    'events_corporate' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['SPEAKERS', '#ecc-speakers-section'],
            ['SCHEDULE', '#ecc-agenda-section'],
            ['EXPLORE', '/explore'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Register Now',
        ])),
        tm_menu('footer_column_1', 'EXPLORE', tm_links([
            ['Search Events', '/explore'],
            'Speakers',
            'Curated Agenda',
        ])),
        tm_menu('footer_bottom_bar', 'Legal', tm_links([
            'PRIVACY',
            'TERMS',
            'CODE_OF_CONDUCT',
        ])),
    ],

    'events_creative' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Protocols', '#evc-protocols-section'],
            ['Laboratory', '#evc-lab-section'],
            'Manifesto',
            'Node_Auth',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Experiment Mode',
        ])),
        ...tm_footer_node_cols('PROTOCOLS', 'LABORATORY', 'COMMUNITY', tm_links([
            'Hackathons',
            'Synthetic Art',
            'Bio-Digital',
            'Auth',
        ])),
        tm_social_os(),
    ],

    'events_festival' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Lineup', '#eff-stages-section'],
            ['Stages', '#eff-stages-section'],
            'Collective',
            'Vibe_Auth',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Vibe Sync',
        ])),
        ...tm_footer_node_cols('COLLECTIVE', 'STAGES', 'GOVERNANCE', tm_links([
            'Lineup',
            'Vibe Sync',
            'Patrons',
            'Auth',
        ])),
        tm_social_os(),
    ],

    'events_music' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'Home',
            ['Lineup', '#sonic-lineup-section'],
            ['Tickets', '#sonic-cta-section'],
            ['Gallery', '#sonic-gallery-section'],
            'Contact',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Buy Tickets',
        ])),
        ...tm_footer_node_cols('RESOURCES', 'COMMUNITY', 'LEGAL', tm_links([
            'Registry Access',
            'Artist Nodes',
            'Sonic Manifest',
            'Security Protocol',
        ])),
        tm_menu('social_footer', 'Social', tm_links([
            'INSTAGRAM',
            'DISCORD',
            'TWITTER',
        ])),
    ],
];
