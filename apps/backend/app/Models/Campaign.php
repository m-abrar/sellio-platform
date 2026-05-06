<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

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
 * @property bool $is_active
 */
class Campaign extends Model
{
    use HasFactory, LogsActivity;

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
        'is_active'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date'   => 'datetime',
        'is_active'  => 'boolean'
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
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')
                  ->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', now());
            });
    }

    // --- UI Helpers ---

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        if (!$this->is_active) {
            return ['label' => 'Inactive', 'color' => 'secondary'];
        }

        $now = now();
        if ($this->start_date && $this->start_date->isFuture()) {
            return ['label' => 'Scheduled', 'color' => 'info'];
        }

        if ($this->end_date && $this->end_date->isPast()) {
            return ['label' => 'Expired', 'color' => 'danger'];
        }

        return ['label' => 'Running', 'color' => 'success'];
    }
}
