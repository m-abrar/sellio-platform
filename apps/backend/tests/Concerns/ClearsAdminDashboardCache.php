<?php

namespace Tests\Concerns;

use Illuminate\Support\Facades\Cache;

trait ClearsAdminDashboardCache
{
    protected function clearAdminDashboardCache(): void
    {
        Cache::forget('admin_dashboard_metrics_v2');
    }
}
