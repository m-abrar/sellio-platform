<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PropertyFee
 *
 * Handles additional costs associated with a property listing, such as 
 * cleaning fees, taxes, or service charges. Supports both fixed amounts 
 * and percentage-based calculations.
 *
 * @property int $id
 * @property int $property_id
 * @property string $title
 * @property float $amount
 * @property string $type
 * @property float|null $rate
 * @property string $charge_type
 */
class PropertyFee extends Model
{
    use HasFactory;

    // --- Fee Type Constants ---
    public const TYPE_FIXED      = 'fixed';
    public const TYPE_PERCENTAGE = 'percentage';

    // --- Charge Type Constants ---
    public const CHARGE_PER_STAY  = 'per_stay';
    public const CHARGE_PER_NIGHT = 'per_night';
    public const CHARGE_PER_GUEST = 'per_guest';

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

    /**
     * Calculate the fee amount based on booking context.
     */
    public function calculate(float $basePrice, int $nights = 1, int $guests = 1): float
    {
        $calculatedAmount = $this->type === self::TYPE_PERCENTAGE 
            ? ($basePrice * ($this->rate / 100)) 
            : (float) $this->amount;

        return match ($this->charge_type) {
            self::CHARGE_PER_NIGHT => $calculatedAmount * $nights,
            self::CHARGE_PER_GUEST => $calculatedAmount * $guests,
            default                => $calculatedAmount,
        };
    }
}
