<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Season extends Model
{
    protected $primaryKey = 'season_id';

    protected $fillable = [
        'media_id',
        'season_number',
    ];

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id', 'media_id');
    }

    public function episodes(): HasMany
    {
        return $this->hasMany(Episode::class, 'season_id', 'season_id');
    }
}
