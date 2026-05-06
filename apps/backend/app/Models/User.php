<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use App\Traits\Subscribable;
use Bavix\Wallet\Interfaces\Customer;
use Bavix\Wallet\Interfaces\Wallet;
use Bavix\Wallet\Traits\CanPay;
use Bavix\Wallet\Traits\HasWallet;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens; 
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Models\HasMarketplaceMetrics;

/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string|null $username
 * @property string|null $company
 * @property string|null $bio
 * @property string|null $years_of_experience
 * @property string|null $social_avatar_url
 * @property string|null $date_of_birth
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property bool $is_admin
 * @property bool $is_partner
 * @property bool $is_buyer
 * @property bool $is_verified
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class User extends Authenticatable implements Wallet, Customer, HasMedia, MustVerifyEmail
{
    use HasFactory, Notifiable, HasRoles, Subscribable, SoftDeletes;
    use LogsActivity, HasWallet, CanPay, HasMarketplaceMetrics;
    use HasImageAccess, InteractsWithMedia;
    use HasApiTokens;

    public const PRIMARY_MEDIA = 'avatar';
    public const GALLERY_MEDIA = 'cover_photos';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'username',
        'is_buyer',
        'social_avatar_url',
        'password',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'avatar_url',
        // 'wallet_balance',
        // 'new_messages',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_buyer'          => 'boolean',
            'is_admin'          => 'boolean',
            'is_partner'        => 'boolean',
            'is_verified'       => 'boolean',
        ];
    }

    public function getIsSuperAdminAttribute(): bool
    {
        return $this->hasRole('super-admin');
    }
    
    // =========================================================================
    // SECTION 1: CORE & SYSTEM SETTINGS
    // =========================================================================

    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    protected function walletBalance(): Attribute
    {
        return Attribute::make(
            get: fn () => ($this->balance ?? 0) / 100,
        );
    }

    // =========================================================================
    // SECTION 2: MESSAGING ENGINE
    // =========================================================================

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'user_id');
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function allConversations(): Builder
    {
        return Conversation::where('user_id', $this->id)
                           ->orWhere('partner_id', $this->id);
    }

    public function receivedMessages()
    {
        $conversationIds = $this->allConversations()->pluck('id');
        return Message::whereIn('conversation_id', $conversationIds)
                      ->where('sender_id', '!=', $this->id);
    }

    public function unreadMessages()
    {
        return $this->receivedMessages()->whereNull('read_at');
    }

    protected function newMessages(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->unreadMessages()->count(),
        );
    }

    protected function lastMessage(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->receivedMessages()->latest('created_at')->first(),
        );
    }

    // =========================================================================
    // SECTION 3: PARTNER DASHBOARD (SELLER LOGIC)
    // =========================================================================

    public function properties(): HasMany   { return $this->hasMany(Property::class); }
    public function events(): HasMany       { return $this->hasMany(Event::class); }
    public function jobs(): HasMany         { return $this->hasMany(JobListing::class); }
    public function services(): HasMany     { return $this->hasMany(Service::class); }
    public function classifieds(): HasMany  { return $this->hasMany(Classified::class); }
    public function autos(): HasMany        { return $this->hasMany(Auto::class); }
    public function withdrawals(): HasMany  { return $this->hasMany(Withdrawal::class); }
    public function reviews(): MorphMany    { return $this->morphMany(Review::class, 'reviewable'); }
    public function subscriptions(): HasMany { return $this->hasMany(Subscription::class); }
    public function subscription(): HasOne  { return $this->hasOne(Subscription::class)->where('title', 'default'); }

    // Marketplace metrics and dashboard calculations moved to App\Traits\Models\HasMarketplaceMetrics

    // =========================================================================
    // SECTION 4: BUYER DASHBOARD (USER AS CUSTOMER LOGIC)
    // =========================================================================

    public function propertyBookings(): HasMany   { return $this->hasMany(PropertyBooking::class); }
    public function eventBookings(): HasMany      { return $this->hasMany(EventBooking::class); }
    public function jobApplications(): HasMany    { return $this->hasMany(JobApplication::class); }
    public function serviceQuotes(): HasMany      { return $this->hasMany(ServiceQuote::class); }
    public function serviceAppointments(): HasMany { return $this->hasMany(ServiceAppointment::class); }
    public function userFavorites(): HasMany      { return $this->hasMany(Favorite::class); }
    public function tickets(): HasMany            { return $this->hasMany(Ticket::class); }

    public function classifiedInquiries(): BelongsToMany
    {
        return $this->belongsToMany(Classified::class, 'classified_inquiries', 'user_id', 'classified_id')
            ->withPivot('status', 'message')
            ->withTimestamps();
    }

    // Buyer dashboard calculations moved to App\Traits\Models\HasMarketplaceMetrics

    // =========================================================================
    // SECTION 5: ADMINLTE & MISC HELPERS
    // =========================================================================

    public function adminlte_image()       { return $this->avatar_url; }
    public function adminlte_desc()        { return $this->email ?? 'Member'; }
    public function adminlte_profile_url() { return route('admin.profile.edit'); }

    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                // 1. First Priority: Social Login URL
                if (!empty($this->social_avatar_url)) {
                    // Ensure the URL is absolute
                    return str_starts_with($this->social_avatar_url, 'http') 
                        ? $this->social_avatar_url 
                        : asset($this->social_avatar_url);
                }
                // 2. Second Priority: Spatie Media Library
                $collection = defined('static::PRIMARY_MEDIA') ? static::PRIMARY_MEDIA : 'avatar';
                $mediaUrl = $this->getFirstMediaUrl($collection, 'avatar');
                if ($mediaUrl) {
                    return $mediaUrl;
                }

                // 3. Third Priority: UI-Avatars (Dynamic name-based)
                if (!empty($this->name)) {
                    $color = config('ui.avatar_color', '6366f1');
                    return "https://ui-avatars.com/api/?name=" . urlencode($this->name) . "&background={$color}&color=fff&size=150&font-size=0.35";
                }

                // 4. Final Priority: Static Fallback from Trait
                return $this->getFallbackImage('avatar');
            }
        );
    }

    public function hasReachedMaxListings(): bool
    {
        $plan = $this->getPlan();
        if (!$plan) return false;
        $maxLimit = (int)($plan->max_listings ?? 999);
        return $maxLimit < 999 && ($this->listings_active_count >= $maxLimit);
    }

    public function scopeOrderByRating(Builder $query, string $direction = 'desc'): Builder
    {
        return $query->withAvg('reviews', 'rating')->orderBy('reviews_avg_rating', $direction);
    }

    public function rating(string $type): string
    {
        $mapping = [
            'auto'     => ['class' => Auto::class,     'relation' => 'autos'],
            'property' => ['class' => Property::class, 'relation' => 'properties'],
        ];
        if (!isset($mapping[$type])) return number_format(0, 1);
        $modelClass = $mapping[$type]['class'];
        $relationName = $mapping[$type]['relation'];
        $listingIds = $this->$relationName()->pluck('id');
        if ($listingIds->isEmpty()) return number_format(0, 1);
        $averageRating = Review::query()
            ->whereIn('reviewable_id', $listingIds)
            ->where('reviewable_type', $modelClass)
            ->where('status', 'approved')
            ->avg('rating');
        return number_format($averageRating ?? 0, 1);
    }

    public function getMaxListingsLimit(): int
    {
        $plan = $this->getPlan();
        if (!$plan) return 1;
        return (int)($plan->max_listings ?? 999);
    }
}
