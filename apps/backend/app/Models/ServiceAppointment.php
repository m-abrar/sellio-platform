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

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'service_appointments';
    
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
}
