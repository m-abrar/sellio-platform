<?php
$files = [
    'app/Http/Requests/Partner/AutoRequest.php',
    'app/Http/Requests/Partner/EventRequest.php',
    'app/Http/Requests/Partner/ServiceRequest.php',
    'app/Http/Requests/Partner/JobListingRequest.php',
    'app/Http/Requests/Partner/ClassifiedRequest.php'
];

foreach ($files as $file) {
    $path = "d:/Sellio/laravel/" . $file;
    if (!file_exists($path)) {
        echo "File not found: $file\n";
        continue;
    }
    
    $content = file_get_contents($path);
    
    // 1. Remove from rules()
    // Matches 'is_featured' => ['boolean'], or similar array syntax
    $content = preg_replace("/\s*'is_featured'\s*=>\s*\[[^\]]+\]\s*,?/", "", $content);
    
    // 2. Remove from prepareForValidation() if present
    // Matches 'is_featured' => $this->has('is_featured'),
    $content = preg_replace("/\s*'is_featured'\s*=>\s*\\\$this->has\('is_featured'\)\s*,?/", "", $content);
    
    file_put_contents($path, $content);
    echo "Updated $file\n";
}
