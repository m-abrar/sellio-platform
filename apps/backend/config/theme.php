<?php
/**
 * Frontend Appearance & Theme Mapping Configuration
 *
 * This file serves as the design orchestration layer for the Sellio platform.
 * It defines the global fallback CSS variables for the storefront and maps
 * vertical-specific theme identifiers (Properties, Events, Autos, etc.)
 * to their respective architectural controllers.
 */
return [
    /*
    |--------------------------------------------------------------------------
    | Default Theme Name
    |--------------------------------------------------------------------------
    |
    | Used when no theme is active or selected. This is the global fallback.
    |
    */
    'default_theme' => 'unifieds_default',
    /*
    |--------------------------------------------------------------------------
    | THEME VARIABLE FALLBACKS
    |--------------------------------------------------------------------------
    | These are the default fallback CSS variable values for when no custom
    | theme settings are defined. They will be merged dynamically in your
    | controllers when generating front-end styles.
    |--------------------------------------------------------------------------
    */
    'default_variables' => [
        // 🎨 Colors
        '--color-primary'       => '#1b4e9b',
        '--color-secondary'     => '#6c757d',
        '--color-accent'        => '#ff9800',
        '--color-background'    => '#ffffff',
        '--color-text'          => '#212529',
        '--color-text-light'    => '#6c757d',

        // ✍️ Typography
        '--font-family-base'    => '"Inter", sans-serif',
        '--font-family-heading' => '"Poppins", sans-serif',

        // 📏 Layout & Radius
        '--radius-base'         => '0.375rem',
        '--radius-button'       => '0.375rem',
        '--layout-container-width' => '1140px',

        // 🌫️ Effects
        '--shadow-card'         => '0 1px 3px rgba(0, 0, 0, 0.1)',
    ],

    /*
    |--------------------------------------------------------------------------
    | THEMES LAYOUT MAP
    |--------------------------------------------------------------------------
    | Maps template slugs to their respective controllers and methods.
    | This allows dynamic routing and template rendering for different
    | module types (Properties, Events, Autos, etc).
    |--------------------------------------------------------------------------
    */
    'map' => [
    // Unified / All-in-One
    'unifieds_default'      => \App\Http\Controllers\UnifiedHomeController::class,
    'unifieds_standard'     => \App\Http\Controllers\UnifiedHomeController::class,
    'unifieds_mega'         => \App\Http\Controllers\UnifiedHomeController::class,
    'unifieds_minimal'      => \App\Http\Controllers\UnifiedHomeController::class,
    'unifieds_modern'       => \App\Http\Controllers\UnifiedHomeController::class,
    'unifieds_classic'      => \App\Http\Controllers\UnifiedHomeController::class,
    'unifieds_interactive'  => \App\Http\Controllers\UnifiedHomeController::class,
    'unifieds_marketplace'  => \App\Http\Controllers\UnifiedHomeController::class,

    // Properties / Real Estate
    'properties_default'    => \App\Http\Controllers\PropertyController::class,
    'properties_classic'    => \App\Http\Controllers\PropertyController::class,
    'properties_modern'     => \App\Http\Controllers\PropertyController::class,
    'properties_luxury'     => \App\Http\Controllers\PropertyController::class,
    'properties_deluxe'     => \App\Http\Controllers\PropertyController::class,
    'properties_urban'      => \App\Http\Controllers\PropertyController::class,
    'properties_rental'     => \App\Http\Controllers\PropertyController::class,
    'properties_vacation'   => \App\Http\Controllers\PropertyController::class,
    'properties_map'        => \App\Http\Controllers\PropertyController::class,
    'properties_unified'    => \App\Http\Controllers\PropertyController::class,
    'properties_commercial' => \App\Http\Controllers\PropertyController::class,
    'properties_showcase'   => \App\Http\Controllers\PropertyController::class,
    'properties_neighborhood' => \App\Http\Controllers\PropertyController::class,
    'properties_investment' => \App\Http\Controllers\PropertyController::class,

    // Events
    'events_default'        => \App\Http\Controllers\EventController::class,
    'events_classic'        => \App\Http\Controllers\EventController::class,
    'events_creative'       => \App\Http\Controllers\EventController::class,
    'events_corporate'      => \App\Http\Controllers\EventController::class,
    'events_music'          => \App\Http\Controllers\EventController::class,
    'events_festival'       => \App\Http\Controllers\EventController::class,

    // Autos / Vehicles
    'autos_default'         => \App\Http\Controllers\AutoController::class,
    'autos_classic'         => \App\Http\Controllers\AutoController::class,
    'autos_modern'          => \App\Http\Controllers\AutoController::class,
    'autos_used'            => \App\Http\Controllers\AutoController::class,
    'autos_luxury'          => \App\Http\Controllers\AutoController::class,
    'autos_electric'        => \App\Http\Controllers\AutoController::class,

    // Services
    'services_default'      => \App\Http\Controllers\ServiceController::class,
    'services_corporate'    => \App\Http\Controllers\ServiceController::class,
    'services_marketplace'  => \App\Http\Controllers\ServiceController::class,
    'services_creative'     => \App\Http\Controllers\ServiceController::class,
    'services_local'        => \App\Http\Controllers\ServiceController::class,
    'services_health'       => \App\Http\Controllers\ServiceController::class,

    // Jobs
    'jobs_default'          => \App\Http\Controllers\JobController::class,
    'jobs_corporate'        => \App\Http\Controllers\JobController::class,
    'jobs_startup'          => \App\Http\Controllers\JobController::class,
    'jobs_tech'             => \App\Http\Controllers\JobController::class,
    'jobs_blue_collar'      => \App\Http\Controllers\JobController::class,
    'jobs_freelance'        => \App\Http\Controllers\JobController::class,

    // Classifieds
    'classifieds_default'   => \App\Http\Controllers\ClassifiedController::class,
    'classifieds_general'   => \App\Http\Controllers\ClassifiedController::class,
    'classifieds_modern'    => \App\Http\Controllers\ClassifiedController::class,
    'classifieds_local'     => \App\Http\Controllers\ClassifiedController::class,
    'classifieds_deals'     => \App\Http\Controllers\ClassifiedController::class,
    'classifieds_premium'   => \App\Http\Controllers\ClassifiedController::class,
    ],
];
