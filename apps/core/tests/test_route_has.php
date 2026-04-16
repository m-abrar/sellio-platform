<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use Illuminate\Support\Facades\Route;

$types = ['PropertyBooking', 'ServiceAppointment'];

foreach ($types as $type) {
    $plural = \Illuminate\Support\Str::plural($type);
    $kebab = \Illuminate\Support\Str::kebab($plural);
    $targetRoute = "admin.{$kebab}.show";
    $has = Route::has($targetRoute) ? "YES" : "NO";
    echo "Type: $type | Target Route: $targetRoute | Has: $has\n";
}
