<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PropertyNeighborhood
 * * Represents nearby points of interest (POIs) for a property.
 * Essential for providing location context and improving SEO/UX on property detail pages.
 */
class PropertyNeighborhood extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'property_neighborhoods';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'property_id',
        'title',          // e.g., "Grand Central Station", "Central Park"
        'description',    // e.g., "World famous train hub"
        'distance_miles', // Distance from the property
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'distance_miles' => 'float',
    ];

    // --- Relationships ---

    /**
     * Get the property that this neighborhood point belongs to.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    // --- Accessors ---

    /**
     * Helper to show distance based on locale preferences (if metric support is added).
     * This is a value-add for international buyers.
     */
    public function getDistanceFormattedAttribute(): string
    {
        return $this->distance_miles . ' miles';
    }
}
