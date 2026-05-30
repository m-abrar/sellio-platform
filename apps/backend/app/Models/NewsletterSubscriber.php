<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\NewsletterSubscriber
 *
 * @property int $id
 * @property string $email
 * @property bool $is_confirmed
 * @property string|null $source (e.g., 'footer', 'popup', 'checkout')
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class NewsletterSubscriber extends Model
{
    use HasFactory;
    use LogsActivity;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'newsletter_subscribers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'source',
        'is_confirmed',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_confirmed' => 'boolean',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
    ];

    /**
     * Get the options for logging activity.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    // --- Scopes ---

    /**
     * Scope a query to only include confirmed subscribers.
     */
    public function scopeConfirmed(Builder $query): Builder
    {
        return $query->where('is_confirmed', true);
    }

    /**
     * Scope a query to filter subscribers by source.
     */
    public function scopeFromSource(Builder $query, string $source): Builder
    {
        return $query->where('source', $source);
    }
}
