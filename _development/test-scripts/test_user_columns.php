<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use Illuminate\Support\Facades\Schema;

echo "is_buyer: " . (Schema::hasColumn('users', 'is_buyer') ? 'YES' : 'NO') . "\n";
echo "is_partner: " . (Schema::hasColumn('users', 'is_partner') ? 'YES' : 'NO') . "\n";
