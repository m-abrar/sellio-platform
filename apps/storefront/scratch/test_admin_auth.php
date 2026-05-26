<?php

require __DIR__ . '/../../backend/vendor/autoload.php';

$app = require __DIR__ . '/../../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::role('super-admin')->first() ?? App\Models\User::first();

if (! $user) {
    echo json_encode(['error' => 'NO_USER']) . PHP_EOL;
    exit(1);
}

Illuminate\Support\Facades\Auth::guard('web')->logout();

$session = app('session.store');
$session->start();
Illuminate\Support\Facades\Auth::guard('web')->login($user);
$session->save();

$sessionId = $session->getId();
$sessionCookieName = config('session.cookie');

function callAuthMe($app, string $sessionCookieName, string $sessionId, string $origin): array
{
    $request = Illuminate\Http\Request::create(
        '/api/v1/auth/me',
        'GET',
        [],
        [$sessionCookieName => $sessionId],
        [],
        [
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_HOST' => '127.0.0.1:8000',
            'HTTP_ORIGIN' => $origin,
            'HTTP_REFERER' => $origin . '/',
        ]
    );

    $response = $app->handle($request);

    return [
        'origin' => $origin,
        'status' => $response->getStatusCode(),
        'body_preview' => substr($response->getContent(), 0, 300),
    ];
}

echo json_encode([
    'session_cookie_name' => $sessionCookieName,
    'same_origin_ip' => callAuthMe($app, $sessionCookieName, $sessionId, 'http://127.0.0.1:3000'),
    'cross_site_localhost' => callAuthMe($app, $sessionCookieName, $sessionId, 'http://localhost:3000'),
], JSON_PRETTY_PRINT) . PHP_EOL;
