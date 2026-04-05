<?php

namespace App\Http\Controllers\Api;

use App\Models\Watchlist;
use Illuminate\Http\Request;

class WatchlistController extends BaseController
{
    public function index(Request $request)
    {
        $watchlist = Watchlist::with(['media.genres', 'media.reviews', 'media.movie'])
            ->where('user_id', $request->user()->id)
            ->orderBy('added_at', 'desc')
            ->get();

        foreach ($watchlist as $item) {
            if ($item->media) {
                $item->media->poster_url = $this->getS3Url($item->media->poster_url);
                $item->media->avg_rating = $item->media->reviews->avg('rating');
            }
        }

        return $this->sendResponse($watchlist, 'Watchlist retrieved successfully.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'media_id' => 'required|exists:media,media_id',
        ]);

        $item = Watchlist::firstOrCreate([
            'media_id' => $request->media_id,
            'user_id' => $request->user()->id,
        ]);

        $item->load('media');

        return $this->sendResponse($item, 'Added to watchlist.');
    }

    public function destroy(Request $request, $id)
    {
        $item = Watchlist::where('watchlist_id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$item) {
            return $this->sendError('Watchlist item not found.');
        }

        $item->delete();

        return $this->sendResponse(null, 'Removed from watchlist.');
    }
}
