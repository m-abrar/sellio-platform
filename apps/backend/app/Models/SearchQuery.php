<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SearchQuery extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'module',
        'keyword',
        'filters',
        'result_count',
        'user_id',
        'ip_address',
        'created_at',
    ];

    protected $casts = [
        'filters'      => 'array',
        'result_count' => 'integer',
        'created_at'   => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
