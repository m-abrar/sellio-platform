<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$registry = require $root . '/introduction/public-content.php';
$errors = [];

$expect = static function (bool $condition, string $message) use (&$errors): void {
    if (!$condition) {
        $errors[] = $message;
    }
};

$readJson = static function (string $path): array {
    $decoded = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
    return is_array($decoded) ? $decoded : [];
};

$stack = array_column($registry['stack'], null, 'name');
$composer = $readJson($root . '/apps/backend/composer.json');
$storefront = $readJson($root . '/apps/storefront/package.json');
$mobile = $readJson($root . '/apps/mobile/package.json');

$expect(count($registry['verticals']) === 7, 'Public registry must contain exactly seven marketplace verticals.');
$expect(($composer['require']['laravel/framework'] ?? null) === '^12.0', 'Laravel registry claim must be rechecked against composer.json.');
$expect(($stack['Laravel']['version'] ?? null) === '12', 'Registry Laravel version is stale.');
$expect(str_starts_with((string) ($storefront['dependencies']['next'] ?? ''), '^16.'), 'Next.js package version is outside the advertised major.');
$expect(($stack['Next.js']['version'] ?? null) === '16', 'Registry Next.js version is stale.');
$expect(str_starts_with((string) ($storefront['dependencies']['react'] ?? ''), '19.'), 'React package version is outside the advertised major.');
$expect(($stack['React']['version'] ?? null) === '19', 'Registry React version is stale.');
$expect(str_starts_with((string) ($mobile['dependencies']['expo'] ?? ''), '~54.'), 'Expo package version is outside the advertised major.');
$expect(($stack['Expo']['version'] ?? null) === '54', 'Registry Expo version is stale.');
$expect(!in_array('PayPal', $registry['gateways'], true), 'PayPal must remain unadvertised until its runtime dependency is verified.');

foreach ($registry['urls'] as $key => $url) {
    if ($url !== null) {
        $expect(!str_contains($url, 'placeholder'), "URL '{$key}' still contains a placeholder.");
    }
}
foreach ($registry['claims'] as $key => $value) {
    $expect($value === null, "Unverified public claim '{$key}' must remain null until evidence is approved.");
}

$render = static function (string $path): string {
    ob_start();
    include $path;
    return (string) ob_get_clean();
};
$surfaces = [
    'listing description' => $render($root . '/introduction/listing-description/index.php'),
    'product tour' => $render($root . '/introduction/product-tour/index.php'),
];
$forbidden = ['Laravel 11', 'Next.js 15', 'Flutter SDK', '99% Speed', 'Trusted by Thousands', '5,000+'];
foreach ($surfaces as $label => $content) {
    foreach ($forbidden as $phrase) {
        $expect(!str_contains($content, $phrase), "{$label} contains retired phrase '{$phrase}'.");
    }
}

if ($errors !== []) {
    fwrite(STDERR, "Public content validation failed:\n- " . implode("\n- ", $errors) . "\n");
    exit(1);
}

echo "Public content registry validated successfully.\n";
