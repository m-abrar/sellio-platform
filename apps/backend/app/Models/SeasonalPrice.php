<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\SeasonalPrice
 * * Enables dynamic pricing for rental properties. 
 * Allows properties to override the base 'price_per_night' during specific 
 * date ranges (e.g., Summer Peak, Holiday Season).
 */
class SeasonalPrice extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'property_id',
        'title',
        'start_date',
        'end_date',
        'price',       // The override price for this period
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'price'      => 'decimal:2', // Ensures consistent precision for calculations
    ];

    // --- Relationships ---

    /**
     * Get the property that this seasonal pricing applies to.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    // --- Scopes ---

    /**
     * Scope a query to only include seasonal prices that are currently active.
     */
    public function scopeActive($query)
    {
        $today = now()->toDateString();
        return $query->where('start_date', '<=', $today)
                     ->where('end_date', '>=', $today);
    }
}
