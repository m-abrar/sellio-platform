<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\Subscription
 * * The revenue engine. Manages user access levels, plan durations, 
 * and lifecycle states for SaaS-style monetization.
 */
class Subscription extends Model
{
    use HasFactory, LogsActivity;

    /**
     * Subscription Status Constants
     */
    public const STATUS_ACTIVE    = 'active';
    public const STATUS_ON_TRIAL  = 'on_trial';
    public const STATUS_PAST_DUE  = 'past_due';
    public const STATUS_PENDING   = 'pending';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_EXPIRED   = 'expired';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'plan_id',
        'user_id',
        'title',
        'status',
        'starts_at',
        'ends_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at'   => 'datetime',
    ];

    // --- Relationships ---

    /**
     * The subscriber (Agent or Service Provider).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The blueprint plan this subscription is based on.
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function quota(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(SubscriptionQuota::class);
    }

    /**
     * Polymorphic relationship to payments linked to this subscription.
     */
    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    // --- Scopes ---

    /**
     * Scope to filter only valid, paying, and unexpired subscriptions.
     */
    public function scopeActive(Builder $query): void
    {
        $query->whereIn('status', [self::STATUS_ACTIVE, self::STATUS_ON_TRIAL])
              ->where(function (Builder $q) {
                  $q->whereNull('ends_at')
                    ->orWhere('ends_at', '>', now());
              });
    }

    // --- Accessors (Modern Syntax) ---

    /**
     * Determine if the current subscription is in a trial period.
     */
    protected function isTrial(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === self::STATUS_ON_TRIAL
        );
    }

    /**
     * Determine if the subscription has expired.
     */
    protected function isExpired(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->ends_at && $this->ends_at->isPast()
        );
    }

    // --- UI Helpers ---

    /**
     * Get a human-readable status label with CSS classes and icons.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_ACTIVE    => ['label' => 'Active', 'color' => 'success', 'icon' => 'check-circle'],
            self::STATUS_ON_TRIAL  => ['label' => 'Trial', 'color' => 'info', 'icon' => 'hourglass-start'],
            self::STATUS_PAST_DUE  => ['label' => 'Past Due', 'color' => 'danger', 'icon' => 'exclamation-triangle'],
            self::STATUS_PENDING   => ['label' => 'Pending', 'color' => 'warning', 'icon' => 'clock'],
            self::STATUS_CANCELLED => ['label' => 'Cancelled', 'color' => 'secondary', 'icon' => 'times-circle'],
            self::STATUS_EXPIRED   => ['label' => 'Expired', 'color' => 'dark', 'icon' => 'calendar-times'],
            default               => ['label' => 'Unknown', 'color' => 'dark', 'icon' => 'question-circle'],
        };
    }

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
}
