<?php

$content = file_get_contents('api_audit_routes.json');

// Strip BOM if present
if (strpos($content, "\xEF\xBB\xBF") === 0) {
    $content = substr($content, 3);
}

$routes = json_decode($content, true);


if ($routes === null) {
    echo "JSON Decode Error: " . json_last_error_msg() . "\n";
    echo "Content length: " . strlen($content) . " bytes\n";
    echo "First 100 chars: " . substr($content, 0, 100) . "\n";
    exit(1);
}


$unprotectedStateChanges = [];
$unprotectedReads = [];

foreach ($routes as $r) {
    if (strpos($r['uri'], 'api/v1') === false) continue;

    $method = $r['method'];
    $uri = $r['uri'];
    $middleware = $r['middleware'] ?? [];

    if (is_string($middleware)) {
        $middleware = explode(',', $middleware);
    }

    $isProtected = false;
    foreach ($middleware as $m) {
        if (strpos($m, 'auth') !== false || strpos($m, 'sanctum') !== false) {
            $isProtected = true;
            break;
        }
    }

    if (!$isProtected) {
        if (str_contains($method, 'POST') || str_contains($method, 'PUT') || str_contains($method, 'PATCH') || str_contains($method, 'DELETE')) {
            $unprotectedStateChanges[] = "[$method] $uri";
        } else {
            $unprotectedReads[] = "[$method] $uri";
        }
    }
}

echo "=== UNPROTECTED STATE-CHANGING ROUTES (CRITICAL) ===\n";
if (empty($unprotectedStateChanges)) {
    echo "None found.\n";
} else {
    echo implode("\n", $unprotectedStateChanges) . "\n";
}

echo "\n=== UNPROTECTED READ ROUTES (INFO) ===\n";
if (empty($unprotectedReads)) {
    echo "None found.\n";
} else {
    echo implode("\n", $unprotectedReads) . "\n";
}
