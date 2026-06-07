<?php

namespace App\Models;

use App\Traits\HasBookingAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\ServiceAppointment
 * * Manages the lifecycle of a service booking from initial request 
 * through to completion or cancellation.
 */
class ServiceAppointment extends Model
{
    use HasFactory;
    use HasBookingAttributes;
    use LogsActivity;

    // --- Status Constants ---
    public const STATUS_PENDING   = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'service_appointments';

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
        'service_package_id',
        'name',
        'email',
        'phone',
        'user_id',
        'scheduled_at',
        'topic',
        'status',               // e.g., 'pending', 'confirmed', 'completed', 'cancelled'
        'notes',                // User-provided details at booking
        'admin_note',           // Provider / admin notes
        'price',                // Locked-in package or service price
        'payment_status',
        'transaction_id',
        'cancellation_reason',  // Provided if status changes to 'cancelled'
        'viewed_at',            // Tracked for provider notification badges
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_at' => 'datetime',
        'viewed_at'    => 'datetime',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
    ];

    // --- Relationships ---

    /**
     * The service being booked.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * The client who booked the appointment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Polymorphic relationship to payments.
     */
    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    // --- Activity Log Configuration ---

    /**
     * Define the activity log options for Spatie.
     */
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
            self::STATUS_PENDING   => ['label' => 'Pending', 'color' => 'warning'],
            self::STATUS_CONFIRMED => ['label' => 'Confirmed', 'color' => 'info'],
            self::STATUS_COMPLETED => ['label' => 'Completed', 'color' => 'success'],
            self::STATUS_CANCELLED => ['label' => 'Cancelled', 'color' => 'danger'],
            default               => ['label' => 'Unknown', 'color' => 'dark'],
        };
    }
}
