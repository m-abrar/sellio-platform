<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use Illuminate\Support\Facades\Route;

$id = 67;
$targetRoute = "admin.property-bookings.show";

$redirect = redirect()->route($targetRoute, $id);
echo "Target URL: " . $redirect->getTargetUrl() . "\n";

$redirect2 = redirect()->route($targetRoute, ['property_booking' => $id]);
echo "Target URL with Param: " . $redirect2->getTargetUrl() . "\n";
