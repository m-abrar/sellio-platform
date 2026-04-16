<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasBookingAttributes;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\ServiceQuote
 * * Manages the Request for Quote (RFQ) process.
 * Allows potential clients to submit project details and service providers 
 * to respond with estimated pricing and timelines.
 */
class ServiceQuote extends Model
{
    use HasBookingAttributes;

    use HasFactory, LogsActivity;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'service_quotes'; 

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'service_id',
        'user_id',
        'service_package_id', // Add this
        'scope_size',         // Add this
        'details',        // The project requirements submitted by the user
        'requested_date',  // Desired start date for the service
        'quoted_price',    // The estimate provided by the service provider
        'status',          // e.g., 'pending', 'quoted', 'accepted', 'rejected'
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
}
