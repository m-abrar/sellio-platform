<?php

$dir = __DIR__ . '/app/Http/Controllers/Api/V1';
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
$fixedCount = 0;
$skippedCount = 0;
$skippedFiles = [];

foreach ($iterator as $file) {
    if ($file->isDir() || $file->getExtension() !== 'php') continue;
    
    $path = $file->getPathname();
    $content = file_get_contents($path);
    $original = $content;
    
    // Pattern 1: compact('var') OR compact('var1', 'var2')
    // Matches: response()->json(compact('quotes'))
    $content = preg_replace_callback(
        '/return\s+response\(\)->json\(\s*compact\(([^)]+)\)\s*\);/',
        function ($matches) {
            $vars = $matches[1]; // e.g. 'quotes' or 'a','b'
            return "return \$this->successResponse(compact({$vars}));";
        },
        $content,
        -1,
        $count1
    );
    
    // Pattern 2: response()->json(['status' => 'success', 'message' => '...'])
    $content = preg_replace_callback(
        '/return\s+response\(\)->json\(\s*\[\s*\'status\'\s*=>\s*\'success\'\s*,\s*\'message\'\s*=>\s*([^\]]+)\]\s*\);/',
        function ($matches) {
            $message = $matches[1];
            return "return \$this->successResponse(null, {$message});";
        },
        $content,
        -1,
        $count2
    );

    // Pattern 3: response()->json(['message' => '...'])
    $content = preg_replace_callback(
        '/return\s+response\(\)->json\(\s*\[\s*\'message\'\s*=>\s*([^\]]+)\]\s*\);/',
        function ($matches) {
            $message = $matches[1];
            return "return \$this->successResponse(null, {$message});";
        },
        $content,
        -1,
        $count3
    );

    // Pattern 3b: response()->json(['message' => '...'], 201)
    $content = preg_replace_callback(
        '/return\s+response\(\)->json\(\s*\[\s*\'message\'\s*=>\s*([^\]]+)\]\s*,\s*(\d+)\s*\);/',
        function ($matches) {
            $message = trim($matches[1]);
            $code = $matches[2];
            return "return \$this->successResponse(null, {$message}, {$code});";
        },
        $content,
        -1,
        $count3b
    );

    $totalFixes = $count1 + $count2 + $count3 + $count3b;
    
    if ($totalFixes > 0) {
        file_put_contents($path, $content);
        echo "Fixed [$totalFixes] in: " . str_replace(__DIR__ . '/', '', $path) . "\n";
        $fixedCount += $totalFixes;
    }
    
    // Check if remaining response()->json still exists
    if (strpos($content, 'response()->json(') !== false) {
        $skippedCount++;
        $skippedFiles[] = str_replace(__DIR__ . '/', '', $path);
    }
}

echo "\n--- Summary ---\n";
echo "Total Fixes Applied: $fixedCount\n";
echo "Files with Skipped Items: $skippedCount\n";
if (!empty($skippedFiles)) {
    echo "Files needing manual fixes:\n - " . implode("\n - ", array_unique($skippedFiles)) . "\n";
}
