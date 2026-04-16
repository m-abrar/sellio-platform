<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;

echo "--- Testing Route Parameter Matching ---\n";

$urls = [
    'http://localhost/dashboard/admin/bookings/properties',
    'http://localhost/dashboard/admin/bookings/properties/pending',
    'http://localhost/dashboard/admin/bookings/services',
];

foreach ($urls as $url) {
    echo "\nURL: $url\n";
    $request = Request::create($url, 'GET');
    
    try {
        $route = app('router')->getRoutes()->match($request);
        echo "Matched Route: " . $route->getName() . "\n";
        echo "Parameters:\n";
        print_r($route->parameters());
        echo "Defaults:\n";
        print_r($route->defaults);
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
