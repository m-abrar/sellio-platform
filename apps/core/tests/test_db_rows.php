<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\ServiceAppointment;
use App\Models\PropertyBooking;

echo "ServiceAppointment IDs:\n";
$serviceIds = ServiceAppointment::orderBy('id', 'desc')->take(5)->pluck('id')->toArray();
echo implode(', ', $serviceIds) . "\n\n";

echo "PropertyBooking IDs:\n";
$propertyIds = PropertyBooking::orderBy('id', 'desc')->take(5)->pluck('id')->toArray();
echo implode(', ', $propertyIds) . "\n";
