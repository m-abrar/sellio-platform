<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class LineItem extends Model implements HasMedia
{
    use InteractsWithMedia;

    public const PRIMARY_MEDIA = 'line_item_icon';

    protected $fillable = [
        'title',
        'description',
        'type',
        'amount',
        'applies_on',
        'order',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'order' => 'integer',
    ];
}
