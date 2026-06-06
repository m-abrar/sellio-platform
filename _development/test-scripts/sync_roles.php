<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\User;

$syncCount = 0;

User::where('id', '>', 2)->get()->each(function ($user) use (&$syncCount) {
    if ($user->is_partner) {
        if (!$user->hasRole('partner')) {
            $user->syncRoles(['partner']); // sync replaces old ones safely
            $syncCount++;
        }
    } elseif ($user->is_buyer) {
        if (!$user->hasRole('buyer')) {
            $user->syncRoles(['buyer']);
            $syncCount++;
        }
    }
});

echo "Successfully synchronized Spatie roles for $syncCount users!\n";
