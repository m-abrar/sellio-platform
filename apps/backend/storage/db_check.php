<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Property;
use App\Models\Category;
use App\Models\Location;

echo "--- DATABASE REGISTRY RECORD STATUS ---\n";
echo "Properties Count: " . Property::count() . "\n";
echo "Categories Count: " . Category::count() . "\n";
echo "Locations Count:  " . Location::count() . "\n";

echo "\n--- SAMPLE PROPERTIES ---\n";
foreach (Property::with(['location', 'category'])->take(3)->get() as $prop) {
    echo "ID: {$prop->id} | Title: {$prop->title} | Published: " . ($prop->is_published ? 'YES' : 'NO') . " | Category: " . ($prop->category->title ?? 'None') . "\n";
}
