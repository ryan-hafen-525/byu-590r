<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    public function run(): void
    {
        $genres = [
            'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
            'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy',
        ];

        foreach ($genres as $name) {
            Genre::updateOrCreate(
                ['genre_name' => $name],
                ['genre_name' => $name]
            );
        }
    }
}
