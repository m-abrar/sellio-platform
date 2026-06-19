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
            Log::error('[SafeBroadcast] Broadcasting failed: '.$e->getMessage(), [
                'event'   => $event::class,
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);
        }
    }
}
