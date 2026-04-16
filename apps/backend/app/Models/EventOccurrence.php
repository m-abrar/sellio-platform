<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\EventOccurrence
 *
 * @property int $id
 * @property int $event_id
 * @property \Illuminate\Support\Carbon $start_date_time
 * @property \Illuminate\Support\Carbon $end_date_time
 * @property int|null $max_attendees
 * @property float|null $duration_hours
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class EventOccurrence extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'event_id',
        'start_date_time',
        'end_date_time',
        'max_attendees',
        'duration_hours',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date_time' => 'datetime',
        'end_date_time'   => 'datetime',
        'max_attendees'   => 'integer',
        'duration_hours'  => 'decimal:2',
    ];

    // --- Relationships ---

    /**
     * Get the parent event for this specific occurrence.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the ticket types available for this occurrence via the pivot table.
     */
    public function ticketTypes(): BelongsToMany
    {
        return $this->belongsToMany(
            EventTicketType::class,
            'event_occurrence_tickets',
            'event_occurrence_id',
            'event_ticket_type_id'
        )->withPivot(['available_quantity', 'base_price', 'sale_price']);
    }

    /**
     * Get all bookings associated with this specific occurrence.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(EventBooking::class, 'event_occurrence_id');
    }

    /**
     * Get the granular inventory/stock records for this occurrence.
     */
    public function inventory(): HasMany
    {
        return $this->hasMany(EventOccurrenceTicket::class, 'event_occurrence_id');
    }
}
