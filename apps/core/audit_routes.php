<?php

$routes = json_decode(file_get_contents('routes.json'), true);

if (!$routes) {
    echo "No routes found.\n";
    exit(1);
}

// Filter for api/v1 paths
$apiV1Routes = array_filter($routes, function($r) {
    return strpos($r['uri'], 'api/v1') !== false;
});

$issues = [];
$grouped = [];

foreach ($apiV1Routes as $r) {
    $uri = $r['uri'];
    $method = $r['method'];
    $uriParts = explode('/', $uri);
    
    $nonRestful = false;
    $flags = [];

    // 1. Check for action verbs in URI
    $verbs = ['create', 'store', 'edit', 'update', 'delete', 'destroy', 'remove', 'add'];
    foreach ($verbs as $v) {
        if (in_array($v, $uriParts)) {
            // Exclude standard Auth / Password resets which are naturally state-verbs
            if (strpos($uri, 'auth') === false && strpos($uri, 'password') === false) {
                 $nonRestful = true;
                 $flags[] = "Contains Verb '$v'";
            }
        }
    }

    // 2. HTTP Method Correctness for Action Name
    $action = $r['action'] ?? '';
    if (strpos($action, '@index') !== false && !str_contains($method, 'GET')) $flags[] = "Index should be GET";
    if (strpos($action, '@show') !== false && !str_contains($method, 'GET')) $flags[] = "Show should be GET";
    if (strpos($action, '@store') !== false && !str_contains($method, 'POST')) $flags[] = "Store should be POST";
    if (strpos($action, '@update') !== false && !str_contains($method, 'PUT') && !str_contains($method, 'PATCH')) $flags[] = "Update should be PUT/PATCH";
    if (strpos($action, '@destroy') !== false && !str_contains($method, 'DELETE')) $flags[] = "Destroy should be DELETE";

    if ($nonRestful || !empty($flags)) {
        $issues[] = [
            'uri' => $uri,
            'method' => $method,
            'action' => $action,
            'flags' => $flags
        ];
    }
}

$out = "RESTful Compliance Issues (Including Dashboard):\n";
$out .= "================================================\n\n";

if (empty($issues)) {
    $out .= "No obvious RESTful naming discrepancies found in API paths.\n";
} else {
    foreach ($issues as $i) {
        $out .= "[" . $i['method'] . "] " . $i['uri'] . "\n";
        $out .= "  - Action: " . $i['action'] . "\n";
        $out .= "  - Flags: " . implode(', ', $i['flags']) . "\n";
        $out .= "----------------------------------------\n";
    }
}

file_put_contents('routes_audit_issues.txt', $out);
echo "Done! Saved to routes_audit_issues.txt";
