<?php

namespace App\Support;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Support\Facades\Log;

/**
 * Broadcast helpers that never fail the HTTP request when Pusher is misconfigured.
 */
final class SafeBroadcast
{
    public static function toOthers(ShouldBroadcast $event): void
    {
        try {
            broadcast($event)->toOthers();
        } catch (\Throwable $e) {
            Log::warning('Broadcast failed: '.$e->getMessage(), [
                'event' => $event::class,
            ]);
        }
    }
}
