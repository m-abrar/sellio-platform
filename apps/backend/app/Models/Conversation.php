<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * App\Models\Conversation
 *
 * @property int $id
 * @property int $user_id
 * @property int $partner_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * * @property-read \App\Models\User $user
 * @property-read \App\Models\User $partner
 * @property-read \App\Models\Message|null $lastMessage
 */
class Conversation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'partner_id',
        'inquiriable_type',
        'inquiriable_id',
    ];

    /**
     * The relationships that should always be eager loaded.
     *
     * @var array<int, string>
     */
    protected $with = [
        'partner',
        'lastMessage',
    ];

    // --- Relationships ---

    /**
     * Get the target entity being discussed (Property, Auto, Event, Service, Job, Classified, Product).
     */
    public function inquiriable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user who initiated the conversation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the conversation partner.
     */
    public function partner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'partner_id');
    }

    /**
     * Get all messages associated with the conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Get the most recent message in the conversation.
     */
    public function lastMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    // --- Scopes ---

    /**
     * Scope a query to only include conversations for a specific user.
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where(function (Builder $q) use ($userId) {
            $q->where('user_id', $userId)
              ->orWhere('partner_id', $userId);
        });
    }

    /**
     * Scope a query to find a conversation between two specific users.
     */
    public function scopeBetween(Builder $query, int $userA, int $userB): Builder
    {
        return $query->where(function (Builder $q) use ($userA, $userB) {
            $q->where('user_id', $userA)->where('partner_id', $userB);
        })->orWhere(function (Builder $q) use ($userA, $userB) {
            $q->where('user_id', $userB)->where('partner_id', $userA);
        });
    }

    // --- Attributes ---

}
