<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
/**
 * for dispute resolution, technical support, and account inquiries.
 *
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property string $status
 * @property string $priority
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $viewed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    // --- Status Constants ---
    public const STATUS_OPEN        = 'open';
    public const STATUS_IN_PROGRESS = 'in-progress';
    public const STATUS_RESOLVED    = 'resolved';
    public const STATUS_CLOSED   = 'closed';
    public const STATUS_REOPENED = 'reopened';

    // --- Priority Constants ---
    public const PRIORITY_LOW    = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH   = 'high';
    public const PRIORITY_URGENT = 'urgent';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'status',      // e.g., 'open', 'in-progress', 'resolved', 'closed', 'reopened'
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
        return $query->whereIn('status', [
            self::STATUS_OPEN, 
            self::STATUS_REOPENED, 
            self::STATUS_IN_PROGRESS
        ]);
    }

    /**
     * Filter tickets that have been finalized.
     */
    public function scopeResolved(Builder $query): Builder
    {
        return $query->whereIn('status', [
            self::STATUS_RESOLVED, 
            self::STATUS_CLOSED
        ]);
    }

    /**
     * Filter tickets by high priority for urgent dashboard widgets.
     */
    public function scopeUrgent(Builder $query): Builder
    {
        return $query->where('priority', self::PRIORITY_URGENT);
    }

    // --- UI Helpers ---

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_OPEN        => ['label' => 'Open', 'color' => 'success', 'icon' => 'door-open'],
            self::STATUS_IN_PROGRESS => ['label' => 'In-Progress', 'color' => 'info', 'icon' => 'sync-alt'],
            self::STATUS_RESOLVED    => ['label' => 'Resolved', 'color' => 'info', 'icon' => 'check-circle'],
            self::STATUS_CLOSED      => ['label' => 'Closed', 'color' => 'secondary', 'icon' => 'lock'],
            self::STATUS_REOPENED    => ['label' => 'Reopened', 'color' => 'primary', 'icon' => 'redo-alt'],
            default                  => ['label' => 'Unknown', 'color' => 'dark', 'icon' => 'question-circle'],
        };
    }

    /**
     * Get a human-readable priority label with CSS classes.
     */
    public function getPriorityMeta(): array
    {
        return match ($this->priority) {
            self::PRIORITY_URGENT => ['label' => 'Urgent', 'color' => 'danger'],
            self::PRIORITY_HIGH   => ['label' => 'High', 'color' => 'warning'],
            self::PRIORITY_MEDIUM => ['label' => 'Medium', 'color' => 'primary'],
            self::PRIORITY_LOW    => ['label' => 'Low', 'color' => 'secondary'],
            default               => ['label' => 'Normal', 'color' => 'dark'],
        };
    }
}
