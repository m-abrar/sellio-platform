<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ExpoPushService
{
    public function send(User $user, array $notification): void
    {
        $tokens = $user->pushTokens()->pluck('token');
        if ($tokens->isEmpty()) return;

        $messages = $tokens->map(fn (string $token) => [
            'to' => $token,
            'sound' => 'default',
            'title' => $notification['title'] ?? __('Sellio notification'),
            'body' => $notification['message'] ?? '',
            'data' => [
                'route' => $notification['route'] ?? null,
                'type' => $notification['type'] ?? 'system',
            ],
        ])->values()->all();

        try {
            Http::timeout(8)
                ->acceptJson()
                ->post(config('services.expo_push.endpoint'), $messages)
                ->throw();
        } catch (\Throwable $error) {
            Log::warning('Expo push delivery failed.', ['user_id' => $user->id, 'error' => $error->getMessage()]);
        }
    }
}
