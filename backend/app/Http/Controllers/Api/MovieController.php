<?php

namespace App\Http\Controllers\Api;

use App\Models\Movie;

class MovieController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $movies = Movie::orderBy('name', 'asc')->get();

        foreach ($movies as $movie) {
            $movie->movie_picture = $this->getS3Url($movie->movie_picture);
        }

        return $this->sendResponse($movies, 'Movies');
    }
}
