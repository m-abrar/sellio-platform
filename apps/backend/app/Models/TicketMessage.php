<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property int $id
 * @property int $ticket_id
 * @property int $user_id
 * @property string $body
 * @property \Illuminate\Support\Carbon|null $read_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class TicketMessage extends Model
{
    use HasFactory;

    /**
     * All of the relationships to be touched.
     *
     * @var array
     */
    protected $touches = ['ticket'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ticket_id',
        'user_id',
        'body',
        'read_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'read_at' => 'datetime',
    ];

    // --- Relationships ---

    /**
     * Get the ticket this message belongs to.
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * Get the sender of the message.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // --- Accessors ---

    /**
     * Determine if the message was sent by a staff member/admin.
     */
    protected function isStaff(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user?->is_admin ?? false
        );
    }
}
