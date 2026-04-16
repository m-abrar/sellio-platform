<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\EventOccurrenceTicket
 *
 * @property int $id
 * @property int $event_occurrence_id
 * @property int $event_ticket_type_id
 * @property int $available_quantity
 * @property float|null $base_price
 * @property float|null $sale_price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class EventOccurrenceTicket extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'event_occurrence_tickets';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'event_occurrence_id',
        'event_ticket_type_id',
        'available_quantity',
        'base_price',
        'sale_price',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'available_quantity' => 'integer',
        'base_price'         => 'decimal:2',
        'sale_price'         => 'decimal:2',
    ];

    // --- Relationships ---

    /**
     * Get the specific event occurrence this ticket inventory belongs to.
     */
    public function occurrence(): BelongsTo
    {
        return $this->belongsTo(EventOccurrence::class, 'event_occurrence_id');
    }

    /**
     * Get the general ticket type definition for this inventory record.
     */
    public function ticketType(): BelongsTo
    {
        return $this->belongsTo(EventTicketType::class, 'event_ticket_type_id');
    }
}
