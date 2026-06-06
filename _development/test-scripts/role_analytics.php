<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use Illuminate\Support\Facades\DB;

$roles = DB::table('roles')->select('id', 'name')->get()->keyBy('id')->toArray();

$counts = DB::table('model_has_roles')
    ->select('role_id', DB::raw('count(*) as total'))
    ->groupBy('role_id')
    ->get();

echo "Role Counts from model_has_roles:\n";
foreach ($counts as $row) {
    $roleName = $roles[$row->role_id]->name ?? "Unknown (#" . $row->role_id . ")";
    echo "  Role: $roleName | Total assigned: " . $row->total . "\n";
}

echo "\nBoolean Column Counts:\n";
echo "  is_buyer=1:   " . DB::table('users')->where('is_buyer', 1)->count() . "\n";
echo "  is_partner=1: " . DB::table('users')->where('is_partner', 1)->count() . "\n";
