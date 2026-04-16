<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'session_id', 'temp_total'];

    protected $casts = [
        'temp_total' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Optimized total calculation via Database
     */
    public function getTotalAttribute(): float
    {
        // Assuming CartItem has a 'total_price' or 'subtotal' column
        return (float) $this->items()->sum('total_price');
    }

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
