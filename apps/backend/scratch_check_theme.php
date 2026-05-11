<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Theme;

$data = [
    'theme_key'   => 'test_theme',
    'variables' => ["--color-primary" => "#1e4d4e"],
];

try {
    $theme = Theme::create($data);
    echo "Theme created successfully\n";
} catch (\Throwable $e) {
    echo "Theme creation failed: " . $e->getMessage() . "\n";
    if (method_exists($e, 'getQuery')) {
        echo "SQL: " . $e->getSql() . "\n";
    }
}
