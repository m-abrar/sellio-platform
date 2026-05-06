<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * App\Models\PaymentGateway
 *
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $class_name
 * @property bool $is_active
 * @property string $mode (sandbox, live)
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\GatewayCredential|null $credentials
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\GatewayFieldBlueprint[] $blueprints
 */
class PaymentGateway extends Model
{
    use HasFactory;

    // --- Mode Constants ---
    public const MODE_SANDBOX = 'sandbox';
    public const MODE_LIVE    = 'live';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'class_name',
        'is_active',
        'mode',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active'  => 'boolean',
        'sort_order' => 'integer',
    ];

    // --- Relationships ---

    /**
     * Get the encrypted credentials for this gateway.
     */
    public function credentials(): HasOne
    {
        return $this->hasOne(GatewayCredential::class);
    }

    /**
     * Get the dynamic field blueprints for this gateway's admin settings.
     */
    public function blueprints(): HasMany
    {
        return $this->hasMany(GatewayFieldBlueprint::class)->orderBy('sort_order');
    }

    // --- Accessors ---

    /**
     * Retrieve the configuration array based on the current gateway mode (sandbox/live).
     */
    protected function activeConfig(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->relationLoaded('credentials') && !$this->credentials) {
                    return [];
                }

                $configKey = "{$this->mode}_config";
                $configData = $this->credentials->{$configKey};

                return is_array($configData) ? $configData : [];
            }
        );
    }

    // --- Scopes ---

    /**
     * Scope a query to only include active gateways.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order gateways by display sequence.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order', 'asc');
    }
}
