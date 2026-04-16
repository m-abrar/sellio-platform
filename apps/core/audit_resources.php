<?php

require __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Finder\Finder;

function scanControllers() {
    $finder = new Finder();
    $finder->files()->in(__DIR__ . '/app/Http/Controllers/Api/V1')->name('*.php');

    $violations = [];

    foreach ($finder as $file) {
        $content = $file->getContents();
        $lines = explode("\n", $content);
        
        foreach ($lines as $index => $line) {
            // 1. Check response wrappers containing variables instead of Resources
            if (preg_match('/(?:successResponse|response\(\)->json)\(\s*(?:compact|array_merge|\[)\s*\(/i', $line)) {
                $violations[] = [
                    'file' => $file->getRelativePathname(),
                    'line' => $line,
                    'line_no' => $index + 1,
                    'reason' => 'Returns raw compact() or array_merge() instead of API Resource'
                ];
            }
            
            // 2. Returning direct variables with no Resources
            if (preg_match('/return\s+\$(this|compact)\b/i', $line)) {
                $violations[] = [
                    'file' => $file->getRelativePathname(),
                    'line' => $line,
                    'line_no' => $index + 1,
                    'reason' => 'Returns raw variable or compact pack directly'
                ];
            }
        }
    }

    return $violations;
}

function scanResources() {
    $finder = new Finder();
    
    // Check if directory exists first
    if (!is_dir(__DIR__ . '/app/Http/Resources')) {
         return [['file' => 'N/A', 'line' => 'N/A', 'line_no' => 0, 'reason' => 'No Http/Resources directory found']];
    }
    
    $finder->files()->in(__DIR__ . '/app/Http/Resources')->name('*.php');
    $violations = [];

    foreach ($finder as $file) {
        $content = $file->getContents();
        $lines = explode("\n", $content);
        
        foreach ($lines as $index => $line) {
            // Find map keys: 'someKey' =>
            if (preg_match('/\'([a-zA-Z0-9_]+)\'\s*=>/i', $line, $matches)) {
                $key = $matches[1];
                
                // Check if it's camelCase (contains lowercase followed by uppercase)
                if (preg_match('/[a-z]+[A-Z]/', $key)) {
                    $violations[] = [
                        'file' => $file->getRelativePathname(),
                        'line' => $line,
                        'line_no' => $index + 1,
                        'reason' => "CamelCase key detected: '$key'"
                    ];
                }
            }
        }
    }

    return $violations;
}

$controllerViolations = scanControllers();
$resourceViolations = scanResources();

$report = "# API Data Transformation Audit\n\n";

$report .= "## 🚨 Non-Resource Returns (Controllers)\n";
if (empty($controllerViolations)) {
    $report .= "No raw model returns found!\n";
} else {
    foreach ($controllerViolations as $v) {
        $report .= "- **{$v['file']}** (Line {$v['line_no']}): `{$v['reason']}`\n";
        $report .= "  ```php\n" . trim($v['line']) . "\n  ```\n";
    }
}

$report .= "\n## 🚨 Inconsistent Field Naming (Resources)\n";
if (empty($resourceViolations)) {
    $report .= "All checked fields appear to be snake_case!\n";
} else {
    foreach ($resourceViolations as $v) {
        $report .= "- **{$v['file']}** (Line {$v['line_no']}): `{$v['reason']}`\n";
        $report .= "  ```php\n" . trim($v['line']) . "\n  ```\n";
    }
}

file_put_contents(__DIR__ . '/docs/data_audit_report.md', $report);
echo "Data audit report generated in docs/data_audit_report.md\n";
