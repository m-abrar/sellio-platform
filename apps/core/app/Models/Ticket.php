<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Ticket
 * * The Helpdesk engine. 
 * Facilitates communication between users and platform administrators 
 * for dispute resolution, technical support, and account inquiries.
 */
class Ticket extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'status',      // e.g., 'open', 'pending', 'resolved', 'closed', 'reopened'
        'priority',    // e.g., 'low', 'medium', 'high', 'urgent'
        'user_id',
        'viewed_at',   // Tracking for admin/staff read status
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'viewed_at'  => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // --- Relationships ---

    /**
     * The user (Customer, Agent, or Provider) who opened the ticket.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The conversation thread within the ticket.
     * (Assumes a TicketMessage or TicketReply model exists)
     */
    public function messages(): HasMany
    {
        return $this->hasMany(TicketMessage::class);
    }

    // --- Scopes ---

    /**
     * Filter tickets that still require administrative attention.
     */
    public function scopeUnresolved(Builder $query): Builder
    {
        return $query->whereIn('status', ['open', 'reopened', 'pending']);
    }

    /**
     * Filter tickets that have been finalized.
     */
    public function scopeResolved(Builder $query): Builder
    {
        return $query->whereIn('status', ['resolved', 'closed']);
    }

    /**
     * Filter tickets by high priority for urgent dashboard widgets.
     */
    public function scopeUrgent(Builder $query): Builder
    {
        return $query->where('priority', 'urgent');
    }
}
