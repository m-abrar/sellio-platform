<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Menu
 *
 * @property int $id
 * @property string $app_key
 * @property string $title
 * @property string $location_key
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\MenuItem[] $items
 */
class Menu extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'app_key',
        'title',
        'location_key',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    // --- Relationships ---

    /**
     * Get all items associated with this menu, ordered by display sequence.
     */
    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class)->orderBy('order');
    }

    // --- Scopes ---

    /**
     * Scope a query to only include active menus.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to find a menu by its location key (e.g., 'header', 'footer').
     */
    public function scopeByLocation(Builder $query, string $location): Builder
    {
        return $query->where('location_key', $location);
    }
}
