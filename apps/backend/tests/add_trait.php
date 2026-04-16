<?php

$models = [
    'AutoInquiry.php',
    'EventBooking.php',
    'JobApplication.php',
    'ServiceQuote.php',
    'ServiceAppointment.php',
    'ClassifiedInquiry.php'
];

$dir = __DIR__ . '/../app/Models/';

foreach ($models as $filename) {
    $path = $dir . $filename;
    if (!file_exists($path)) {
        echo "File not found: $filename\n";
        continue;
    }

    $content = file_get_contents($path);

    // Check if already uses it
    if (str_contains($content, 'use HasBookingAttributes;')) {
        echo "$filename already has trait.\n";
        continue;
    }

    // 1. Insert namespace import above class
    $import = "use App\Traits\HasBookingAttributes;\n";
    if (str_contains($content, 'use Illuminate\Database\Eloquent\Model;')) {
        $content = str_replace('use Illuminate\Database\Eloquent\Model;', "use Illuminate\Database\Eloquent\Model;\n" . $import, $content);
    } else {
        // fallback fallback insert above class decl
        $content = preg_replace('/(class \w+ extends Model)/', $import . "\n$1", $content);
    }

    // 2. Insert use Trait inside class body
    $traitUse = "    use HasBookingAttributes;\n";
    $content = preg_replace('/(class \w+ extends Model\s*\{)/', "$1\n" . $traitUse, $content);

    file_put_contents($path, $content);
    echo "Added trait to $filename\n";
}
