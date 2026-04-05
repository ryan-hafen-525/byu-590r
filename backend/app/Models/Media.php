<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Media extends Model
{
    use SoftDeletes;

    protected $table = 'media';
    protected $primaryKey = 'media_id';

    protected $fillable = [
        'title',
        'synopsis',
        'poster_url',
        'media_type',
    ];

    public function movie(): HasOne
    {
        return $this->hasOne(Movie::class, 'media_id', 'media_id');
    }

    public function seasons(): HasMany
    {
        return $this->hasMany(Season::class, 'media_id', 'media_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'media_id', 'media_id');
    }

    public function watchlists(): HasMany
    {
        return $this->hasMany(Watchlist::class, 'media_id', 'media_id');
    }

    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class, 'media_genre', 'media_id', 'genre_id');
    }
}
