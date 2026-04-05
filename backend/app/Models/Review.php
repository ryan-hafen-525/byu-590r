<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $primaryKey = 'review_id';

    protected $fillable = [
        'media_id',
        'user_id',
        'rating',
        'review_text',
    ];

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id', 'media_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
