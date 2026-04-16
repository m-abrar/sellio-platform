<?php

require 'vendor/autoload.php';

use Symfony\Component\Finder\Finder;

$finder = new Finder();
$finder->files()->in(__DIR__ . '/app/Http/Controllers/Api/V1')->name('*.php');

$report = [];

foreach ($finder as $file) {
    $path = $file->getRealPath();
    $content = file_get_contents($path);
    
    // Simple regex to find functions and extract body
    preg_match_all('/public\s+function\s+(\w+)\s*\((.*?)\)\s*(?::\s*[\w|\\\]+)?\s*\{((?:[^{}]++|\{(?3)\})*)\}/s', $content, $matches, PREG_SET_ORDER);

    $fileReport = [];
    foreach ($matches as $match) {
        $method = $match[1];
        $body = $match[3];
        $lines = count(explode("\n", $body));

        $smells = [];
        if (strpos($body, 'DB::') !== false) $smells[] = 'Direct DB Facade';
        if (strpos($body, '->create(') !== false || strpos($body, '::create(') !== false) $smells[] = 'Direct Creation';
        if (strpos($body, '->update(') !== false) $smells[] = 'Direct Update';
        if (strpos($body, '->hasFile(') !== false || strpos($body, '->file(') !== false) $smells[] = 'File Management';
        if (strpos($body, 'DB::beginTransaction') !== false) $smells[] = 'Transaction logic';

        if ($lines > 15 || count($smells) > 0) {
            $fileReport[] = [
                'method' => $method,
                'lines' => $lines,
                'smells' => $smells
            ];
        }
    }

    if (!empty($fileReport)) {
        $report[str_replace(__DIR__ . '/', '', $path)] = $fileReport;
    }
}

$out = "";
foreach ($report as $file => $methods) {
    $out .= "FILE: $file\n";
    foreach ($methods as $m) {
        $out .= "  - {$m['method']} ({$m['lines']} lines) [" . implode(', ', $m['smells']) . "]\n";
    }
    $out .= "----------------------------------------\n";
}

file_put_contents('controllers_audit.txt', $out);
echo "Done! Saved to controllers_audit.txt";
