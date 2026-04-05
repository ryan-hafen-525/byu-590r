<?php

namespace App\Http\Controllers\Api;

use App\Models\Genre;

class GenreController extends BaseController
{
    public function index()
    {
        $genres = Genre::orderBy('genre_name', 'asc')->get();
        return $this->sendResponse($genres, 'Genres retrieved successfully.');
    }
}
