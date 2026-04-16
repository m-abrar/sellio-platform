<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * App\Models\PropertyScore
 * * Represents performance or lifestyle metrics for a property.
 * Commonly used for Walk Scores, Bike Scores, Energy Efficiency (EPC), 
 * or Safety ratings.
 */
class PropertyScore extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'property_scores';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'property_id',
        'title',       // e.g., "Walk Score", "Energy Efficiency"
        'description', // e.g., "Very Walkable", "Grade A"
        'score',       // The numerical value
        'units',       // e.g., "/ 100", "kWh/m2", "★"
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'score' => 'decimal:2',
    ];

    // --- Relationships ---

    /**
     * Get the property that this score belongs to.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    // --- Accessors ---

    /**
     * Combines the score and units for a professional UI display.
     * Example: "85 / 100" or "A++ Grade"
     */
    protected function fullScore(): Attribute
    {
        return Attribute::make(
            get: fn () => rtrim(rtrim($this->score, '0'), '.') . ' ' . $this->units
        );
    }
}
