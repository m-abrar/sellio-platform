<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use App\Traits\Models\HasStatusModeration;

/**
 * App\Models\Campaign
 * * Represents a marketing campaign or promotional event.
 *
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $start_date
 * @property \Illuminate\Support\Carbon|null $end_date
 * @property string|null $type
 * @property string|null $color
 * @property string $status
 */
class Campaign extends Model
{
    use HasFactory, LogsActivity, HasStatusModeration;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'type',
        'color',
        'status'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date'   => 'datetime',
    ];

    /**
     * Get the options for logging activity.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    // --- Scopes ---

    /**
     * Scope a query to only include active and currently running campaigns.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('start_date')
                  ->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', now());
            });
    }

    // Centralized status logic provided by HasStatusModeration trait
}

