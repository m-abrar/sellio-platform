<?php
$routes = json_decode(file_get_contents('routes.json'), true);
$grouped = [];
foreach ($routes as $r) {
    if (strpos($r['uri'], 'api/v1') !== false) {
        $parts = explode('/', $r['uri']);
        $module = $parts[2] ?? 'unknown';
        $grouped[$module][] = $r['method'];
    }
}
print_r(array_keys($grouped));
