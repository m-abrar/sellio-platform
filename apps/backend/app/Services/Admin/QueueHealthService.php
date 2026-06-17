<?php

namespace App\Services\Admin;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class QueueHealthService
{
    // Jobs sitting unprocessed longer than this → worker is likely down.
    private const STALE_SECONDS = 90;

    public function getStatus(): array
    {
        $connection = config('queue.default', 'sync');

        // sync driver processes jobs immediately in-request — no worker needed.
        if ($connection === 'sync') {
            return [
                'connection'  => $connection,
                'worker_up'   => true,
                'stale_jobs'  => 0,
                'failed_jobs' => 0,
            ];
        }

        return Cache::remember('admin_queue_health', 60, function () use ($connection) {
            $staleJobs  = $this->countStaleJobs($connection);
            $failedJobs = $this->countRecentFailedJobs();

            // If there are stale jobs that haven't been picked up, the worker is down.
            // Zero stale jobs is NOT proof it's running, but it's the best signal
            // available without Horizon.
            return [
                'connection'  => $connection,
                'worker_up'   => $staleJobs === 0,
                'stale_jobs'  => $staleJobs,
                'failed_jobs' => $failedJobs,
            ];
        });
    }

    private function countStaleJobs(string $connection): int
    {
        try {
            $table = config("queue.connections.{$connection}.table", 'jobs');
            $cutoff = now()->subSeconds(self::STALE_SECONDS)->getTimestamp();

            return DB::table($table)
                ->whereNull('reserved_at')
                ->where('available_at', '<=', $cutoff)
                ->count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function countRecentFailedJobs(): int
    {
        try {
            return DB::table('failed_jobs')
                ->where('failed_at', '>=', now()->subHour())
                ->count();
        } catch (\Throwable) {
            return 0;
        }
    }
}
