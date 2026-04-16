<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PropertyFee
 * * Handles additional costs associated with a property listing, such as 
 * cleaning fees, taxes, or service charges. Supports both fixed amounts 
 * and percentage-based calculations.
 */
class PropertyFee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'property_id',
        'title',       // e.g., "Cleaning Fee", "Tourism Tax"
        'amount',      // Fixed cost
        'type',        // e.g., "fixed", "percentage"
        'rate',        // Percentage value (if type is percentage)
        'charge_type', // e.g., "per_stay", "per_night", "per_guest"
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'rate'   => 'float',
    ];

    // --- Relationships ---

    /**
     * Get the property that this fee applies to.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
