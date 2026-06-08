<?php

require __DIR__ . '/../../backend/vendor/autoload.php';
$app = require __DIR__ . '/../../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::role('super-admin')->first() ?? App\Models\User::first();
$cookieJar = tempnam(sys_get_temp_dir(), 'cookies');

$ch = curl_init('http://127.0.0.1:8000/login');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_COOKIEJAR => $cookieJar,
    CURLOPT_COOKIEFILE => $cookieJar,
]);
$loginPage = curl_exec($ch);
curl_close($ch);

preg_match('/name="_token" value="([^"]+)"/', (string) $loginPage, $matches);
$token = $matches[1] ?? '';

$ch = curl_init('http://127.0.0.1:8000/login');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'email' => $user->email,
        'password' => 'admin123',
        '_token' => $token,
    ]),
    CURLOPT_COOKIEJAR => $cookieJar,
    CURLOPT_COOKIEFILE => $cookieJar,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_HEADER => true,
]);
$loginResponse = curl_exec($ch);
$loginStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$ch = curl_init('http://127.0.0.1:8000/admin-bar/status');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_COOKIEJAR => $cookieJar,
    CURLOPT_COOKIEFILE => $cookieJar,
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
]);
$statusBody = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$ch = curl_init('http://127.0.0.1:3000/api/admin-bar/session');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_COOKIEJAR => $cookieJar,
    CURLOPT_COOKIEFILE => $cookieJar,
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
]);
$proxyBody = curl_exec($ch);
$proxyCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo json_encode([
    'login' => [
        'status' => $loginStatus,
        'has_token' => $token !== '',
        'response_preview' => substr((string) $loginResponse, 0, 200),
        'cookie_file' => file_get_contents($cookieJar),
    ],
    'web_status' => ['status' => $statusCode, 'body' => $statusBody],
    'storefront_proxy' => ['status' => $proxyCode, 'body' => $proxyBody],
], JSON_PRETTY_PRINT) . PHP_EOL;

@unlink($cookieJar);
