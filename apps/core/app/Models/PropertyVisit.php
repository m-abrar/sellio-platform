<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PropertyVisit
 * * Handles physical tour requests and appointment scheduling.
 * Acts as a lead generation bridge between potential buyers/renters and agents.
 */
class PropertyVisit extends Model
{
    use HasFactory;

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
}
