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
 * App\Models\JobApplication
 *
 * @property int $id
 * @property int $job_listing_id
 * @property int $user_id
 * @property string $status
 * @property string|null $cover_letter
 * @property \Illuminate\Support\Carbon|null $viewed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\JobListing $job
 * @property-read \App\Models\User $user
 */
class JobApplication extends Model
{
    use HasFactory;
    use LogsActivity;
    use HasBookingAttributes;
    use SoftDeletes;

    // --- Status Constants ---
    public const STATUS_PENDING   = 'pending';
    public const STATUS_REVIEWING = 'reviewing';
    public const STATUS_ACCEPTED  = 'accepted';
    public const STATUS_REJECTED  = 'rejected';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'job_applications';

    /**
     * The relationships that should always be eager loaded.
     */
    protected $with = ['job', 'user'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_listing_id',
        'cover_letter',
        'viewed_at',
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
     * Get the job listing associated with this application.
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(JobListing::class, 'job_listing_id');
    }

    /**
     * Get the candidate (user) who applied for the job.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // --- UI Helpers ---

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING   => ['label' => 'Pending', 'color' => 'warning'],
            self::STATUS_REVIEWING => ['label' => 'Reviewing', 'color' => 'info'],
            self::STATUS_ACCEPTED  => ['label' => 'Accepted', 'color' => 'success'],
            self::STATUS_REJECTED  => ['label' => 'Rejected', 'color' => 'danger'],
            default               => ['label' => 'Unknown', 'color' => 'dark'],
        };
    }
}

