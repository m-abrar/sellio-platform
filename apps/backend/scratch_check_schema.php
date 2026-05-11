<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;

if (method_exists(Schema::getFacadeRoot(), 'hasIndex')) {
    echo "Schema hasIndex exists\n";
} else {
    echo "Schema hasIndex DOES NOT exist\n";
}

try {
    $hasIndex = Schema::hasIndex('users', 'email');
    echo "Schema::hasIndex call succeeded\n";
} catch (\Throwable $e) {
    echo "Schema::hasIndex call failed: " . $e->getMessage() . "\n";
}
