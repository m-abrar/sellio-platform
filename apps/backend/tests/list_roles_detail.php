<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use Spatie\Permission\Models\Role;

$roles = Role::select('name', 'guard_name')->get()->toArray();
echo "Roles with Guards:\n";
print_r($roles);
