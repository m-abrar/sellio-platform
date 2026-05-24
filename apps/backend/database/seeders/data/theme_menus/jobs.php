<?php

return [
    'jobs_corporate' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Find Jobs', '#jobs'],
            ['Companies', '#companies'],
            ['Application Tracker', '#tracker'],
            ['Upload Resume', '#resume'],
        ])),
        tm_menu('utility_header', 'Utility', tm_links([
            'Sign In',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Post a Job',
        ])),
        tm_menu('footer_column_1', 'For Candidates', tm_links([
            'Browse Jobs',
            'Salary Tools',
            'Career Advice',
        ])),
        tm_menu('footer_column_2', 'For Employers', tm_links([
            'Post a Job',
            'Search Resumes',
            'ATS Integration',
        ])),
    ],

    'jobs_modern' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Discover', '#discover'],
            ['Top Companies', '#companies'],
            ['Salaries', '#salaries'],
            ['Career Paths', '#career'],
        ])),
        tm_menu('utility_header', 'Utility', tm_links([
            'Login',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Post a Job',
        ])),
        tm_menu('footer_bottom_bar', 'Legal', tm_links([
            'About',
            'Terms',
            'Privacy',
            'Contact',
        ])),
    ],

    'jobs_freelance' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Explore Gigs', '#explore'],
            ['How it Works', '#how-it-works'],
            ['GigHive Pro', '#pro'],
        ])),
        tm_menu('utility_header', 'Utility', tm_links([
            'Sign In',
            'Join',
        ])),
        tm_menu('footer_column_1', 'Categories', tm_links([
            'Graphics',
            'Digital Marketing',
            'Writing',
            'Video',
        ])),
        tm_menu('footer_column_2', 'About', tm_links([
            'Careers',
            'Press',
            'Partnerships',
            'Privacy',
        ])),
        tm_menu('footer_column_3', 'Support', tm_links([
            'Help',
            'Trust',
            'Selling',
            'Buying',
        ])),
    ],

    'jobs_blue_collar' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Find Jobs', '#jobs'],
            ['Trades Categories', '#jbc-trades-section'],
            ['Employers', '#jbc-employers-section'],
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Post a Job',
        ])),
        tm_menu('footer_column_1', 'Job Seekers', tm_links([
            'Browse Jobs',
            'Apprenticeships',
            'Resume Builder',
        ])),
        tm_menu('footer_column_2', 'Employers', tm_links([
            'Post a Job',
            'Pricing',
            'Recruiting Solutions',
        ])),
    ],

    'jobs_tech' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            ['Jobs', '#jobs'],
            ['Companies', '#companies'],
            ['Salaries', '#salaries'],
        ])),
        tm_menu('utility_header', 'Utility', tm_links([
            'Log in',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'Post a Job',
        ])),
        tm_menu('footer_column_1', 'Developers', tm_links([
            'Job Search',
            'Salary Calculator',
            'Create Profile',
        ])),
        tm_menu('footer_column_2', 'Employers', tm_links([
            'Post Jobs',
            'Search Developers',
            'Pricing',
        ])),
        tm_menu('footer_bottom_bar', 'Legal', tm_links([
            'Terms',
            'Privacy',
            'API',
        ])),
    ],

    'jobs_startup' => [
        tm_menu('main_header', 'Main Header Menu', tm_links([
            'VENTURES',
            'CAPITAL',
            'NETWORK',
            'MISSION',
        ])),
        tm_menu('action_buttons', 'Header Actions', tm_links([
            'CONNECT_HUB',
        ])),
        tm_menu('footer_column_1', 'VENTURES', tm_links([
            'Seed Hub',
            'Series Alpha',
            'Unicorn Registry',
            'Exit Protocol',
        ])),
        tm_menu('footer_column_2', 'RESOURCES', tm_links([
            'Equity Logic',
            'Funding Map',
            'Market Status',
        ])),
        tm_menu('footer_column_3', 'NETWORK', tm_links([
            'The Foundation',
            'Node Registry',
            'Contact Hub',
        ])),
    ],
];
