<?php

require __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Finder\Finder;

$finder = new Finder();
$finder->files()->in(__DIR__ . '/app/Http/Controllers/Api/V1')->name('Api*Controller.php');

$report = [];

foreach ($finder as $file) {
    if ($file->getFilename() === 'ApiAmenityController.php' || $file->getFilename() === 'ApiFeatureController.php') {
        continue; // Skip small lookups
    }

    $content = $file->getContents();
    $classname = $file->getFilenameWithoutExtension();

    // Match public functions: index, search, category
    preg_match_all('/public\s+function\s+(index|search|category)\s*\(\s*([^)]*)\s*\)/i', $content, $matches, PREG_SET_ORDER);

    foreach ($matches as $match) {
        $method = $match[1];
        $params = $match[2];

        // Extract body to find ->paginate
        preg_match('/public\s+function\s+' . $method . '\s*\([^)]*\)[^{]*\{((?>[^{}]+|(?R))*)\}/s', $content, $bodyMatch);
        $body = $bodyMatch[1] ?? '';

        $hasPaginate = strpos($body, '->paginate(') !== false;
        $hasGet = strpos($body, '->get()') !== false;

        // Check Form Request type
        $requestClass = 'Request';
        if (preg_match('/(\w+Request)\s+\$request/', $params, $reqMatch)) {
            $requestClass = $reqMatch[1];
        }

        $report[$classname][$method] = [
            'params' => $params,
            'request_class' => $requestClass,
            'paginate' => $hasPaginate,
            'get' => $hasGet,
            'file' => $file->getRelativePathname()
        ];
    }
}

// Write report to markdown
$md = "# Listing Endpoints Audit\n\n";
$md .= "| Controller | Method | Request Class | Paginate | Get | File |\n";
$md .= "| --- | --- | --- | --- | --- | --- |\n";

foreach ($report as $class => $methods) {
    foreach ($methods as $method => $info) {
        $md .= sprintf(
            "| **%s** | `%s` | `%s` | %s | %s | %s |\n",
            $class,
            $method,
            $info['request_class'],
            $info['paginate'] ? '✅' : '❌',
            $info['get'] ? '⚠️ `get()`' : 'Implicit/No',
            $info['file']
        );
    }
}

file_put_contents(__DIR__ . '/docs/listing_audit_report.md', $md);
echo "Listing audit report generated in docs/listing_audit_report.md\n";
