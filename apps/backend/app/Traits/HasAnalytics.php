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
        // NOTE: This will result in an N+1 query if not eager loaded using withCount
        return $this->activityMetrics()->where('description', 'viewed_listing')->count();
    }

    /**
     * ACCESSOR for total leads tracked in the activity log (e.g., successful inquiry/booking).
     * @return int
     */
    public function getLeadsCountAttribute(): int
    {
        // NOTE: This MUST be overridden in the specific listing model
        // if leads are tracked outside the activity log (e.g., in a bookings table).
        // For simplicity here, we assume a 'submitted_lead' log exists.
        return $this->activityMetrics()->where('description', 'submitted_lead')->count();
    }
}
