<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\DB;

/**
 * App\Models\Cart
 *
 * @property int $id
 * @property int|null $user_id
 * @property string|null $session_id
 * @property float $temp_total
 */
class Cart extends Model
{
    use HasFactory;

    /**
     * The relationships that should always be eager loaded.
     */
    protected $with = ['items'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['user_id', 'session_id'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'temp_total' => 'decimal:2',
    ];

    // --- Relationships ---

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    // --- Accessors ---

    /**
     * Optimized total calculation via Database.
     */
    protected function total(): Attribute
    {
        return Attribute::make(
            get: fn () => (float) $this->items->sum('total_price')
        );
    }

    // --- Logic ---

    /**
     * Merge a guest cart into the authenticated user's cart.
     */
    public static function mergeGuestCart(string $sessionId, int $userId): void
    {
        DB::transaction(function () use ($sessionId, $userId) {
            $guestCart = self::with('items')->where('session_id', $sessionId)->first();
            
            if (!$guestCart) return;

            $userCart = self::firstOrCreate(['user_id' => $userId]);
            // Eager load items to perform matching in memory
            $userItems = $userCart->items;

            foreach ($guestCart->items as $guestItem) {
                // Match items in memory using Collection methods to avoid N+1 queries
                $existingItem = $userItems->where('product_id', $guestItem->product_id)
                    ->filter(function ($item) use ($guestItem) {
                        return $item->attribute_ids === $guestItem->attribute_ids &&
                               $item->addon_ids === $guestItem->addon_ids;
                    })->first();

                if ($existingItem) {
                    $existingItem->increment('quantity', $guestItem->quantity);
                    $guestItem->delete();
                } else {
                    $guestItem->update(['cart_id' => $userCart->id]);
                }
            }

            $guestCart->delete();
        });
    }
}
