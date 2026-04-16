<?php

define('LARAVEL_START', microtime(true));

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\Admin\BookingManagementService;

$service = app(BookingManagementService::class);

ob_start();

echo "--- Testing Unified Bookings ---\n";

$bookingsAll = $service->getUnifiedBookings('all', 'all');
echo "All Bookings Total: " . $bookingsAll->total() . "\n";

if ($bookingsAll->total() > 0) {
    echo "Sample Relation Names in 'all':\n";
    $relations = $bookingsAll->getCollection()->map(function($b) { return $b->relation_name; })->unique();
    foreach ($relations as $rel) {
        echo " - $rel\n";
    }
}

echo "\n--- Testing Type 'property' ---\n";
$bookingsProp = $service->getUnifiedBookings('all', 'property');
echo "Property Bookings Total: " . $bookingsProp->total() . "\n";

echo "\n--- Testing Type 'service' ---\n";
$bookingsService = $service->getUnifiedBookings('all', 'service');
echo "Service Bookings Total: " . $bookingsService->total() . "\n";

$output = ob_get_clean();
file_put_contents(__DIR__ . '/scratch_test_bookings_out.txt', $output);
echo "Output written to scratch_test_bookings_out.txt\n";
