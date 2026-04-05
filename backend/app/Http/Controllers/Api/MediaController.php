<?php

namespace App\Http\Controllers\Api;

use App\Models\Media;
use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends BaseController
{
    public function index(Request $request)
    {
        $query = Media::with(['genres', 'movie', 'seasons.episodes', 'reviews']);

        if ($request->has('type') && in_array($request->type, ['movie', 'tv_show'])) {
            $query->where('media_type', $request->type);
        }

        if ($request->has('genre')) {
            $query->whereHas('genres', function ($q) use ($request) {
                $q->where('genres.genre_id', $request->genre);
            });
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('synopsis', 'like', "%{$search}%");
            });
        }

        $media = $query->orderBy('title', 'asc')->get();

        foreach ($media as $item) {
            $item->poster_url = $this->getS3Url($item->poster_url);
            $item->avg_rating = $item->reviews->avg('rating');
        }

        return $this->sendResponse($media, 'Media retrieved successfully.');
    }

    public function show($id)
    {
        $media = Media::with(['genres', 'movie', 'seasons.episodes', 'reviews.user'])
            ->find($id);

        if (!$media) {
            return $this->sendError('Media not found.');
        }

        $media->poster_url = $this->getS3Url($media->poster_url);
        $media->avg_rating = $media->reviews->avg('rating');

        return $this->sendResponse($media, 'Media retrieved successfully.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'synopsis' => 'nullable|string',
            'media_type' => 'required|in:movie,tv_show',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'genre_ids' => 'nullable|array',
            'genre_ids.*' => 'exists:genres,genre_id',
            'release_date' => 'nullable|date',
            'runtime_minutes' => 'nullable|integer|min:1',
        ]);

        $media = Media::create([
            'title' => $request->title,
            'synopsis' => $request->synopsis,
            'media_type' => $request->media_type,
        ]);

        if ($request->hasFile('image')) {
            $extension = $request->file('image')->getClientOriginalExtension();
            $image_name = time() . '_media_' . $media->media_id . '.' . $extension;
            $path = $request->file('image')->storeAs('images', $image_name, 's3');
            Storage::disk('s3')->setVisibility($path, 'public');
            $media->poster_url = $path;
            $media->save();
        }

        if ($request->has('genre_ids')) {
            $media->genres()->sync($request->genre_ids);
        }

        if ($request->media_type === 'movie') {
            Movie::create([
                'media_id' => $media->media_id,
                'release_date' => $request->release_date,
                'runtime_minutes' => $request->runtime_minutes,
            ]);
        }

        $media->load(['genres', 'movie', 'seasons.episodes']);
        $media->poster_url = $this->getS3Url($media->poster_url);

        return $this->sendResponse($media, 'Media created successfully.');
    }

    public function update(Request $request, $id)
    {
        $media = Media::find($id);
        if (!$media) {
            return $this->sendError('Media not found.');
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'synopsis' => 'sometimes|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'genre_ids' => 'nullable|array',
            'genre_ids.*' => 'exists:genres,genre_id',
            'release_date' => 'nullable|date',
            'runtime_minutes' => 'nullable|integer|min:1',
        ]);

        if ($request->has('title')) {
            $media->title = $request->title;
        }
        if ($request->has('synopsis')) {
            $media->synopsis = $request->synopsis;
        }

        if ($request->hasFile('image')) {
            if ($media->poster_url) {
                Storage::disk('s3')->delete($media->poster_url);
            }
            $extension = $request->file('image')->getClientOriginalExtension();
            $image_name = time() . '_media_' . $media->media_id . '.' . $extension;
            $path = $request->file('image')->storeAs('images', $image_name, 's3');
            Storage::disk('s3')->setVisibility($path, 'public');
            $media->poster_url = $path;
        }

        $media->save();

        if ($request->has('genre_ids')) {
            $media->genres()->sync($request->genre_ids);
        }

        if ($media->media_type === 'movie') {
            $movie = $media->movie ?? new Movie(['media_id' => $media->media_id]);
            if ($request->has('release_date')) {
                $movie->release_date = $request->release_date;
            }
            if ($request->has('runtime_minutes')) {
                $movie->runtime_minutes = $request->runtime_minutes;
            }
            $movie->media_id = $media->media_id;
            $movie->save();
        }

        $media->load(['genres', 'movie', 'seasons.episodes']);
        $media->poster_url = $this->getS3Url($media->poster_url);

        return $this->sendResponse($media, 'Media updated successfully.');
    }

    public function destroy($id)
    {
        $media = Media::find($id);
        if (!$media) {
            return $this->sendError('Media not found.');
        }

        $media->delete();

        return $this->sendResponse(null, 'Media deleted successfully.');
    }
}
