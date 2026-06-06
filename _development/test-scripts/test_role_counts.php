<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\User;

$colBuyer = User::where('is_buyer', true)->count();
$roleBuyer = User::role('buyer')->count();

$colPartner = User::where('is_partner', true)->count();
$rolePartner = User::role('partner')->count();

echo "BUYERS:\n";
echo "  By Column: $colBuyer\n";
echo "  By Role:   $roleBuyer\n\n";

echo "PARTNERS:\n";
echo "  By Column: $colPartner\n";
echo "  By Role:   $rolePartner\n";
