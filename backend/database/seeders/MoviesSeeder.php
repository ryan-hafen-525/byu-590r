<?php

namespace Database\Seeders;

use App\Models\Movie;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class MoviesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $movies = [
            [
                'name' => 'Star Wars: Revenge of the Sith',
                'description' => 'The final chapter of the prequel trilogy. Anakin Skywalker completes his journey to the dark side as the Galactic Republic transforms into the Empire and the Jedi Order falls.',
                'movie_picture' => 'images/rots.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Project Hail Mary',
                'description' => 'A lone astronaut wakes up on a spaceship with no memory of how he got there. He must solve an impossible scientific mystery and save Earth from an extinction-level threat.',
                'movie_picture' => 'images/phm.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Interstellar',
                'description' => 'A team of explorers travel through a wormhole in space in an attempt to find a new habitable planet for humanity as Earth faces environmental catastrophe.',
                'movie_picture' => 'images/interstellar.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'The Martian',
                'description' => 'An astronaut is stranded on Mars after his team assumes he is dead. He must use his ingenuity and scientific knowledge to survive and find a way to signal Earth for rescue.',
                'movie_picture' => 'images/martian.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'The Italian Job',
                'description' => 'A team of thieves plan an elaborate gold heist in Los Angeles to get revenge on a former associate who double-crossed them and stole their previous haul.',
                'movie_picture' => 'images/italianjob.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ];

        foreach ($movies as $movie) {
            Movie::updateOrCreate(
                ['name' => $movie['name']],
                $movie
            );
        }
    }
}
