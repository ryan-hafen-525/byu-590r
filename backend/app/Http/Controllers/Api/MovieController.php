<?php

namespace App\Http\Controllers\Api;

use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

    /**
     * Store a newly created movie.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        $movie = Movie::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        if ($request->hasFile('image')) {
            $extension = $request->file('image')->getClientOriginalExtension();
            $image_name = time() . '_movie_' . $movie->id . '.' . $extension;
            $path = $request->file('image')->storeAs('images', $image_name, 's3');
            Storage::disk('s3')->setVisibility($path, 'public');
            $movie->movie_picture = $path;
            $movie->save();
        }

        $movie->movie_picture = $this->getS3Url($movie->movie_picture);

        return $this->sendResponse($movie, 'Movie created successfully.');
    }

    /**
     * Update the specified movie.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        $movie = Movie::findOrFail($id);

        if ($request->has('name')) {
            $movie->name = $request->name;
        }
        if ($request->has('description')) {
            $movie->description = $request->description;
        }

        if ($request->hasFile('image')) {
            if ($movie->movie_picture) {
                Storage::disk('s3')->delete($movie->movie_picture);
            }
            $extension = $request->file('image')->getClientOriginalExtension();
            $image_name = time() . '_movie_' . $movie->id . '.' . $extension;
            $path = $request->file('image')->storeAs('images', $image_name, 's3');
            Storage::disk('s3')->setVisibility($path, 'public');
            $movie->movie_picture = $path;
        }

        $movie->save();
        $movie->movie_picture = $this->getS3Url($movie->movie_picture);

        return $this->sendResponse($movie, 'Movie updated successfully.');
    }

    /**
     * Remove the specified movie.
     */
    public function destroy($id)
    {
        $movie = Movie::findOrFail($id);
        $movie->delete();

        return $this->sendResponse(null, 'Movie deleted successfully.');
    }
}
