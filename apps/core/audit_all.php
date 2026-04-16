<?php
require 'vendor/autoload.php';

$dir = __DIR__ . '/app/Http/Controllers/Api/V1';
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
$violations = [];

foreach ($iterator as $file) {
    if ($file->isDir() || $file->getExtension() !== 'php') continue;
    
    $path = $file->getPathname();
    $relPath = str_replace(__DIR__ . '/', '', $path);
    $lines = file($path);
    
    $currentMethod = 'Outside Method';
    
    foreach ($lines as $index => $line) {
        // Track Method Name
        if (preg_match('/public\s+function\s+([a-zA-Z0-9_]+)/', $line, $match)) {
            $currentMethod = $match[1];
        }
        
        // Find violation
        if (strpos($line, 'response()->json(') !== false) {
            $violations[] = [
                'file' => $relPath,
                'method' => $currentMethod,
                'line' => $index + 1,
                'code' => trim($line)
            ];
        }
    }
}

// Group by file
$grouped = [];
foreach ($violations as $v) {
    $grouped[$v['file']][] = $v;
}

$output = "# API Response Contract Audit\n\n";

foreach ($grouped as $file => $views) {
    $output .= "## File: `" . $file . "`\n\n";
    $output .= "| Method | Line | Code | Correction |\n";
    $output .= "| :--- | :--- | :--- | :--- |\n";
    foreach ($views as $v) {
        $code = $v['code'];
        $correction = '`$this->successResponse(...)`';
        if (strpos($code, 'compact(') !== false) {
            preg_match('/compact\(([^)]+)\)/', $code, $compactMatch);
            $vars = isset($compactMatch[1]) ? str_replace("'", "", $compactMatch[1]) : 'data';
            $correction = "`\$this->successResponse(\$viewData)`";
        }
        $output .= "| " . $v['method'] . " | " . $v['line'] . " | `" . htmlspecialchars($v['code']) . "` | " . $correction . " |\n";
    }
    $output .= "\n";
}

file_put_contents(__DIR__ . '/docs/full_audit_report.md', $output);
echo "Audit report generated in docs/full_audit_report.md\n";
