<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\Review
 * * A polymorphic review engine. 
 * Allows users to leave ratings and feedback for various entities (Properties, Autos, etc.)
 * with centralized moderation and activity logging.
 */
class Review extends Model
{
    use HasFactory, LogsActivity;

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
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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
