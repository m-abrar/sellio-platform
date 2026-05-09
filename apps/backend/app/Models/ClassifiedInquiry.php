<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use App\Traits\HasBookingAttributes;

/**
 * App\Models\ClassifiedInquiry
 *
 * @property int $id
 * @property int $user_id
 * @property int $classified_id
 * @property string|null $status
 * @property string|null $message
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class ClassifiedInquiry extends Pivot
{
    use HasFactory;
    use LogsActivity;
    use HasBookingAttributes;

    // --- Status Constants ---
    public const STATUS_PENDING   = 'pending';
    public const STATUS_CONTACTED = 'contacted';
    public const STATUS_SOLD      = 'sold';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'classified_inquiries';

    /**
     * Indicates if the IDs are auto-incrementing.
     * @var bool
     */
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'status',
        'message',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
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
     * Get the classified ad associated with the inquiry.
     */
    public function classifiedAd(): BelongsTo
    {
        return $this->belongsTo(Classified::class, 'classified_id');
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
            self::STATUS_SOLD      => ['label' => 'Sold', 'color' => 'success'],
            self::STATUS_CANCELLED => ['label' => 'Cancelled', 'color' => 'danger'],
            default               => ['label' => 'Unknown', 'color' => 'dark'],
        };
    }
}

