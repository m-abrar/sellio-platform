<?php
/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 *
 * Defines the cross-origin security policies for the Sellio API surface.
 * Configures allowed origins, methods, and headers to facilitate secure
 * communication between the backend and external frontend clients or mobile applications.
 */
return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // 'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'admin-bar/*'],

    'allowed_methods' => ['*'],

    // Resolved dynamically on boot via CorsOriginResolver (admin settings + .env fallbacks).
    'allowed_origins' => [],

    'allowed_origins_patterns' => [
        '#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#',
        '#^https?://192\.168\.\d+\.\d+(:\d+)?$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];

