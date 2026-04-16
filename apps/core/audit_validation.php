<?php

require __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Finder\Finder;

$finder = new Finder();
$finder->files()->in(__DIR__ . '/app/Http/Controllers/Api/V1');

$inlineValidation = [];
$missingRequests = [];

foreach ($finder as $file) {
    if ($file->getExtension() !== 'php') continue;

    $contents = file_get_contents($file->getRealPath());
    $relativePath = $file->getRelativePathname();

    // Find all methods
    preg_match_all('/public\s+function\s+(\w+)\s*\(([^)]*)\)\s*\{/s', $contents, $matches, PREG_OFFSET_CAPTURE);

    foreach ($matches[1] as $index => $methodMatch) {
        $methodName = $methodMatch[0];
        $methodOffset = $methodMatch[1];
        
        $arguments = $matches[2][$index][0];

        // Find body of the method (approximate using braces level)
        $bodyStart = strpos($contents, '{', $methodOffset);
        $braceCount = 0;
        $body = '';
        for ($i = $bodyStart; $i < strlen($contents); $i++) {
            if ($contents[$i] === '{') $braceCount++;
            if ($contents[$i] === '}') $braceCount--;
            $body .= $contents[$i];
            if ($braceCount === 0) break;
        }

        // Checklist for validation
        // 1. Injected Class
        preg_match_all('/(\w+Request)\s+\$request/', $arguments, $requestMatches);
        $hasFormRequest = !empty($requestMatches[1]);

        // 2. Inline validation in body
        $hasInlineValidation = preg_match('/\$request->validate\(/', $body) || 
                              preg_match('/Validator::make\(/', $body) ||
                              preg_match('/\$this->validate\(/', $body);

        // 3. Direct creation/update checks
        $hasCreation = preg_match('/::create\(/', $body) || preg_match('/->update\(/', $body);

        if ($hasInlineValidation) {
            $inlineValidation[] = [
                'file' => $relativePath,
                'method' => $methodName,
                'type' => 'Inline Validation'
            ];
        }

        if ($hasCreation && !$hasFormRequest && !$hasInlineValidation) {
            $missingRequests[] = [
                'file' => $relativePath,
                'method' => $methodName,
                'type' => 'Missing Form Request (Direct Model Action)'
            ];
        }

        if (($methodName === 'store' || $methodName === 'update') && !$hasFormRequest) {
            $missingRequests[] = [
                'file' => $relativePath,
                'method' => $methodName,
                'type' => 'Standard creation method using raw Request'
            ];
        }
    }
}

// Write report
$report = "# Validation Audit Report\n\n";

$report .= "## 🚨 Inline Validation Detected\n";
$report .= "Controllers using `$request->validate(...)` instead of dedicated Form Requests:\n\n";

if (empty($inlineValidation)) {
    $report .= "✅ No inline validation found in API V1 controllers.\n\n";
} else {
    foreach ($inlineValidation as $item) {
        $report .= "- **{$item['file']}** (`{$item['method']}`)\n";
    }
    $report .= "\n";
}

$report .= "## ⚠️ Missing Form Request / Direct Model Usage\n";
$report .= "Methods that modify models without explicit Form Requests (using generic Request):\n\n";

if (empty($missingRequests)) {
    $report .= "✅ No missing Form Requests detected.\n";
} else {
    foreach ($missingRequests as $item) {
         $report .= "- **{$item['file']}** (`{$item['method']}`): {$item['type']}\n";
    }
}

file_put_contents(__DIR__ . '/docs/validation_audit_report.md', $report);
echo "Validation audit report generated in docs/validation_audit_report.md\n";
