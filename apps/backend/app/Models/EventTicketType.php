<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\EventTicketType
 *
 * @property int $id
 * @property int $event_id
 * @property string $name
 * @property string|null $description
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class EventTicketType extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'event_id',
        'title',
        'base_price',
        'description',
        'max_quantity',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    // --- Relationships ---

    /**
     * Get the event that owns this ticket type definition.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the specific occurrences where this ticket type is offered.
     */
    public function occurrences(): BelongsToMany
    {
        return $this->belongsToMany(
            EventOccurrence::class,
            'event_occurrence_tickets',
            'event_ticket_type_id',
            'event_occurrence_id'
        )->withPivot(['available_quantity', 'base_price', 'sale_price']);
    }

    /**
     * Get the granular inventory records for this ticket type across all dates.
     */
    public function inventoryRecords(): HasMany
    {
        return $this->hasMany(EventOccurrenceTicket::class, 'event_ticket_type_id');
    }

    /**
     * Get all bookings associated with this ticket type.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(EventBooking::class, 'event_ticket_type_id');
    }

    // --- Scopes ---

    /**
     * Scope a query to only include active ticket types.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
