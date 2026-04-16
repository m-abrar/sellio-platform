<?php
require __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Str;

$types = ['PropertyBooking', 'ServiceAppointment', 'EventBooking', 'JobApplication', 'AutoInquiry', 'ClassifiedInquiry'];

foreach ($types as $type) {
    $plural = Str::plural($type);
    $kebab = Str::kebab($plural);
    echo "Type: $type | Plural: $plural | Kebab: $kebab\n";
}
