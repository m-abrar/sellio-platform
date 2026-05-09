<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasBookingAttributes;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\ServiceQuote
 *
 * Manages the Request for Quote (RFQ) process.
 * Allows potential clients to submit project details and service providers 
 * to respond with estimated pricing and timelines.
 */
class ServiceQuote extends Model
{
    use HasBookingAttributes, SoftDeletes;
    use HasFactory, LogsActivity;

    // --- Status Constants ---
    public const STATUS_PENDING  = 'pending';
    public const STATUS_QUOTED   = 'quoted';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_REJECTED = 'rejected';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'service_quotes';

    /**
     * The relationships that should always be eager loaded.
     */
    protected $with = ['service', 'user'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'service_id',
        'user_id',
        'service_package_id',
        'scope_size',
        'details',        // The project requirements submitted by the user
        'requested_date',  // Desired start date for the service
        'viewed_at',       // Tracked for provider notification badges
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'requested_date' => 'datetime',
        'quoted_price'   => 'decimal:2', // Standardized for financial precision
        'viewed_at'      => 'datetime',
        'created_at'     => 'datetime',
        'updated_at'     => 'datetime',
    ];

    // --- Relationships ---

    /**
     * The service for which the quote is requested.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * The potential client requesting the quote.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // --- Activity Log Configuration ---

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty() 
            ->dontSubmitEmptyLogs();
    }

    // --- UI Helpers ---

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING  => ['label' => 'Pending', 'color' => 'warning'],
            self::STATUS_QUOTED   => ['label' => 'Quoted', 'color' => 'info'],
            self::STATUS_ACCEPTED => ['label' => 'Accepted', 'color' => 'success'],
            self::STATUS_REJECTED => ['label' => 'Rejected', 'color' => 'danger'],
            default              => ['label' => 'Unknown', 'color' => 'dark'],
        };
    }
}

