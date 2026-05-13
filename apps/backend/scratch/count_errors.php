<?php
$basePath = "d:\\Sellio\\apps\\backend";
$auditFile = $basePath . "\\.audit\\04_views_admin.md";

$content = file_get_contents($auditFile);
preg_match_all('/`(resources\\\\views\\\\admin\\\\[^`]+)`/', $content, $matches);

$targetFiles = $matches[1];
$errorFiles = [];

foreach ($targetFiles as $relPath) {
    $absPath = $basePath . "\\" . $relPath;
    if (!file_exists($absPath)) continue;
    
    $fileContent = file_get_contents($absPath);
    $hasError = false;
    
    if (stripos($fileContent, '<style') !== false) {
        $hasError = true;
    } elseif (preg_match('/<script(?![^>]*src=)/i', $fileContent)) {
        $hasError = true;
    } elseif (stripos($fileContent, 'style="') !== false || stripos($fileContent, "style='") !== false) {
        $hasError = true;
    } elseif (preg_match('/\s+on\w+=/i', $fileContent)) {
        $hasError = true;
    }
    
    if ($hasError) {
        $errorFiles[] = $relPath;
    }
}

echo "TOTAL_TARGET_FILES: " . count($targetFiles) . "\n";
echo "TOTAL_ERROR_FILES: " . count($errorFiles) . "\n";
echo "NON_COMPLIANT_FILES:\n";
foreach ($errorFiles as $file) {
    echo "- " . $file . "\n";
}
?>
