<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

/**
 * App\Models\Review
 * * A polymorphic review engine. 
 * Allows users to leave ratings and feedback for various entities (Properties, Autos, etc.)
 * with centralized moderation and activity logging.
 */
class Review extends Model
{
    use HasFactory, LogsActivity, SoftDeletes;

    public const MAX_RATING = 5;

    public const STATUS_PENDING  = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'reviewable_id',
        'reviewable_type',
        'rating',
        'comment',
        'status',    // e.g., 'pending', 'approved', 'rejected'
        'viewed_at', // Important for admin "New Review" badges
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating'     => 'integer',
        'viewed_at'  => 'datetime',
    ];

    // --- Relationships ---

    /**
     * The polymorphic parent model (Property, Auto, etc.).
     */
    public function reviewable(): MorphTo
    {
        return $this->morphTo();
    }
    
    /**
     * The author of the review.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // --- Scopes ---

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    public function scopeByRating(Builder $query, int $rating): Builder
    {
        return $query->where('rating', $rating);
    }

    public function scopeNew(Builder $query): Builder
    {
        return $query->whereNull('viewed_at');
    }

    // --- Activity Log Configuration ---

    /**
     * Configure the activity log options for audit trails.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty() 
            ->dontSubmitEmptyLogs();
    }
}
