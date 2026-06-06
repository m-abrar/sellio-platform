<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use Illuminate\Support\Facades\DB;

$driver = DB::getDriverName();
echo "Database Driver: $driver\n\n";

$tables = ['users', 'blogs', 'property_bookings', 'service_quotes'];

foreach ($tables as $table) {
    if (!Illuminate\Support\Facades\Schema::hasTable($table)) {
        echo "Table '$table' does not exist.\n\n";
        continue;
    }

    echo "--- INDEXES FOR '$table' ---\n";
    if ($driver === 'sqlite') {
        $indexes = DB::select("PRAGMA index_list($table)");
        foreach ($indexes as $idx) {
            echo "  Index: " . $idx->name . " (Unique: " . ($idx->unique ? 'YES' : 'NO') . ")\n";
        }
    } else { // mysql
        try {
            $indexes = DB::select("SHOW INDEX FROM $table");
            foreach ($indexes as $idx) {
                echo "  Column: " . $idx->Column_name . " | Index Name: " . $idx->Key_name . "\n";
            }
        } catch (\Exception $e) {
            echo "  Could not fetch: " . $e->getMessage() . "\n";
        }
    }
    echo "\n";
}
