<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Episode extends Model
{
    protected $primaryKey = 'episode_id';

    protected $fillable = [
        'season_id',
        'episode_number',
        'title',
        'runtime_minutes',
    ];

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class, 'season_id', 'season_id');
    }
}
