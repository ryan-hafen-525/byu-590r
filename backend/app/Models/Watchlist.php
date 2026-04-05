<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Watchlist extends Model
{
    protected $primaryKey = 'watchlist_id';
    public $timestamps = false;

    protected $fillable = [
        'media_id',
        'user_id',
        'added_at',
    ];

    protected function casts(): array
    {
        return [
            'added_at' => 'datetime',
        ];
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id', 'media_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
