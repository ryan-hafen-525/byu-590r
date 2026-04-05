<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Genre extends Model
{
    protected $primaryKey = 'genre_id';

    protected $fillable = [
        'genre_name',
    ];

    public function media(): BelongsToMany
    {
        return $this->belongsToMany(Media::class, 'media_genre', 'genre_id', 'media_id');
    }
}
