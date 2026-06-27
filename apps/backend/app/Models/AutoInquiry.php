<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use App\Traits\HasBookingAttributes;

/**
 * App\Models\AutoInquiry
 *
 * @property int $id
 * @property int $user_id
 * @property int $auto_id
 * @property string|null $message
 * @property \Illuminate\Support\Carbon|null $viewed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class AutoInquiry extends Model
{
    use HasFactory;
    use LogsActivity;
    use HasBookingAttributes;
    use SoftDeletes;


    // --- Status Constants ---
    public const STATUS_PENDING   = 'pending';
    public const STATUS_CONTACTED = 'contacted';
    public const STATUS_RESOLVED  = 'resolved';

    /**
     * The relationships that should always be eager loaded.
     */
    protected $with = ['auto'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'auto_id',
        'full_name',
        'email',
        'phone',
        'preferred_date',
        'preferred_time',
        'message',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'viewed_at'  => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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

    // --- Relationships ---

    /**
     * Get the user who made the inquiry.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the auto listing associated with the inquiry.
     */
    public function auto(): BelongsTo
    {
        return $this->belongsTo(Auto::class);
    }

    // --- UI Helpers ---

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING   => ['label' => 'Pending', 'color' => 'warning'],
            self::STATUS_CONTACTED => ['label' => 'Contacted', 'color' => 'info'],
            self::STATUS_RESOLVED  => ['label' => 'Resolved', 'color' => 'success'],
            default               => ['label' => 'Unknown', 'color' => 'dark'],
        };
    }
}

