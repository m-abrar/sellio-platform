<?php

require __DIR__ . '/../../backend/vendor/autoload.php';

$app = require __DIR__ . '/../../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::role('super-admin')->first() ?? App\Models\User::first();
Illuminate\Support\Facades\Auth::guard('web')->login($user);
$session = app('session.store');
$session->save();
$sessionId = $session->getId();
$cookieName = config('session.cookie');
$cookieHeader = "{$cookieName}={$sessionId}";

function curlGet(string $url, string $cookieHeader): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Cookie: {$cookieHeader}",
            'Accept: application/json',
        ],
    ]);
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['status' => $status, 'body' => $body];
}

echo json_encode([
    'web_status' => curlGet('http://127.0.0.1:8000/admin-bar/status', $cookieHeader),
    'storefront_proxy' => curlGet('http://127.0.0.1:3000/api/admin-bar/session', $cookieHeader),
], JSON_PRETTY_PRINT) . PHP_EOL;
