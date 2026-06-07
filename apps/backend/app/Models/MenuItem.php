<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\MenuItem
 *
 * @property int $id
 * @property int $menu_id
 * @property int|null $parent_id
 * @property string $label
 * @property string $url
 * @property string|null $target (_self, _blank)
 * @property string|null $icon
 * @property int $order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Menu $menu
 * @property-read \App\Models\MenuItem|null $parent
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\MenuItem[] $children
 */
class MenuItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'menu_id',
        'parent_id',
        'url',
        'order',
        'status',
        'admin_note',
        'module',
    ];

    /**
     * Strip markup from menu labels; social icons should use plain text titles.
     */
    protected function title(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => is_string($value) ? strip_tags($value) : $value
        );
    }

    /**
     * Sanitize URL to prevent stored XSS via javascript: or data: protocols.
     */
    protected function url(): Attribute
    {
        return Attribute::make(
            set: function ($value) {
                $sanitized = filter_var($value, FILTER_SANITIZE_URL);
                // Block dangerous protocols
                if (preg_match('/^(javascript|data|vbscript|file):/i', $sanitized)) {
                    return '#';
                }
                return $sanitized;
            }
        );
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'order' => 'integer',
    ];

    // --- Relationships ---

    /**
     * Get the menu that this item belongs to.
     */
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    /**
     * Get the parent menu item (for nested dropdowns).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }

    /**
     * Get the child menu items, ordered by their display sequence.
     */
    public function children(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('order');
    }

    public function childrenRecursive(): HasMany
    {
        return $this->children()->with('childrenRecursive');
    }

    // --- Scopes ---

    /**
     * Scope a query to only include top-level menu items.
     */
    public function scopeTopLevel(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope a query to order items by their display sequence.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order', 'asc');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }
}
