<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use Illuminate\Support\Facades\DB;

$roles = DB::table('roles')->pluck('name', 'id')->toArray();

$counts = DB::table('model_has_roles')
    ->select('role_id', DB::raw('count(*) as total'))
    ->groupBy('role_id')
    ->get();

echo "--- SPATIE ROLES ---\n";
foreach ($counts as $row) {
    echo ($roles[$row->role_id] ?? $row->role_id) . ": " . $row->total . "\n";
}

echo "--- BOOLEAN COLS ---\n";
echo "is_buyer=1: " . DB::table('users')->where('is_buyer', 1)->count() . "\n";
echo "is_partner=1: " . DB::table('users')->where('is_partner', 1)->count() . "\n";
