<?php

// app/Traits/HasAnalytics.php (or HasActivityMetrics.php)

namespace App\Traits;

use Spatie\Activitylog\Models\Activity;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\DB;

trait HasAnalytics
{
    /**
     * Define the relationship to the Spatie Activity Log.
     */
    public function activityMetrics(): MorphMany
    {
        // $this->morphMany(Activity::class, 'subject') links the listing to its activity
        return $this->morphMany(Activity::class, 'subject');
    }

    /**
     * ACCESSOR for total views tracked in the activity log.
     * @return int
     */
    public function getViewsCountAttribute(): int
    {
        $cacheKey = "views_count_{$this->getTable()}_{$this->id}";
        return cache()->remember($cacheKey, now()->addMinutes(10), function () {
            return $this->activityMetrics()->where('description', 'viewed_listing')->count();
        });
    }

    public function getLeadsCountAttribute(): int
    {
        $cacheKey = "leads_count_{$this->getTable()}_{$this->id}";
        return cache()->remember($cacheKey, now()->addMinutes(10), function () {
            return $this->activityMetrics()->where('description', 'submitted_lead')->count();
        });
    }
}
