<?php

$dir = __DIR__ . '/app/Http/Controllers/Api/V1';
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
$fixedCount = 0;

foreach ($iterator as $file) {
    if ($file->isDir() || $file->getExtension() !== 'php') continue;
    
    $path = $file->getPathname();
    $content = file_get_contents($path);
    $original = $content;
    
    // Pattern 1: Multiline `response()->json(['data' => new Resource($var)])`
    $content = preg_replace_callback(
        '/return\s+response\(\)->json\(\s*\[\s*\'data\'\s*=>\s*new\s+([a-zA-Z0-9_\\]+)\(([^)]+)\)\s*\]\s*\);/s',
        function ($matches) {
            $resource = $matches[1];
            $variable = $matches[2];
            return "return \$this->successResponse(new {$resource}({$variable}));";
        },
        $content,
        -1,
        $count1
    );

    // Pattern 2: Multiline `response()->json(compact('var'))` without spaces
    // (Already covered mostly, but for safety)

    $totalFixes = $count1;
    
    if ($totalFixes > 0) {
        file_put_contents($path, $content);
        echo "Fixed [$totalFixes] multiline in: " . str_replace(__DIR__ . '/', '', $path) . "\n";
        $fixedCount += $totalFixes;
    }
}

echo "\nTotal V2 Fixes Applied: $fixedCount\n";
