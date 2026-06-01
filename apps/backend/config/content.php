<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Laravel Blade Content Scope
    |--------------------------------------------------------------------------
    |
    | Blade public views are independent from storefront themes. The legacy
    | page_contents.theme_key column is used as a content scope for Blade.
    |
    */
    'blade_scope' => env('BLADE_CONTENT_SCOPE', 'laravel_blade'),
];
