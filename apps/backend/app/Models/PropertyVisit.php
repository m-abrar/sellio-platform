<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PropertyVisit
 *
 * Handles physical tour requests and appointment scheduling.
 * Acts as a lead generation bridge between potential buyers/renters and agents.
 *
 * @property int $id
 * @property int $property_id
 * @property int|null $user_id
 * @property string $full_name
 * @property string $email
 * @property string $phone
 * @property \Illuminate\Support\Carbon $scheduled_at
 * @property string|null $notes
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $viewed_at
 */
class PropertyVisit extends Model
{
    use HasFactory;

    // --- Status Constants ---
    public const STATUS_PENDING   = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_COMPLETED = 'completed';

    /**
     * The relationships that should always be eager loaded.
     */
    protected $with = ['property'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'property_id',
        'user_id',
        'full_name',
        'email',
        'phone',
        'scheduled_at',
        'notes',
        'status',      // e.g., 'pending', 'confirmed', 'cancelled', 'completed'
        'viewed_at',   // Tracked for admin notification badges
    ];

    /**
     * The attributes that should be cast to native types.
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
     * Get the property associated with the visit request.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the registered user who requested the visit (optional for guest leads).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // --- UI Helpers ---

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING   => ['label' => 'Pending', 'color' => 'warning'],
            self::STATUS_CONFIRMED => ['label' => 'Confirmed', 'color' => 'success'],
            self::STATUS_CANCELLED => ['label' => 'Cancelled', 'color' => 'danger'],
            self::STATUS_COMPLETED => ['label' => 'Completed', 'color' => 'info'],
            default               => ['label' => 'Unknown', 'color' => 'dark'],
        };
    }
}
