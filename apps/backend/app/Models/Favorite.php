<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * App\Models\Favorite
 *
 * @property int $id
 * @property int $user_id
 * @property int $favoritable_id
 * @property string $favoritable_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $favoritable
 */
class Favorite extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'favoritable_id',
        'favoritable_type',
    ];

    // --- Relationships ---

    /**
     * Get the parent favoritable model (Auto, Event, Property, etc.).
     */
    public function favoritable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user who owns the favorite.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
