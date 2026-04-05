<?php

namespace App\Http\Controllers\Api;

use App\Models\Media;
use App\Models\Season;
use Illuminate\Http\Request;

class SeasonController extends BaseController
{
    public function index($mediaId)
    {
        $media = Media::find($mediaId);
        if (!$media) {
            return $this->sendError('Media not found.');
        }

        $seasons = Season::with('episodes')
            ->where('media_id', $mediaId)
            ->orderBy('season_number', 'asc')
            ->get();

        return $this->sendResponse($seasons, 'Seasons retrieved successfully.');
    }

    public function store(Request $request, $mediaId)
    {
        $media = Media::find($mediaId);
        if (!$media || $media->media_type !== 'tv_show') {
            return $this->sendError('TV show not found.', [], 404);
        }

        $request->validate([
            'season_number' => 'required|integer|min:1',
        ]);

        $season = Season::create([
            'media_id' => $mediaId,
            'season_number' => $request->season_number,
        ]);

        return $this->sendResponse($season, 'Season created successfully.');
    }

    public function update(Request $request, $id)
    {
        $season = Season::find($id);
        if (!$season) {
            return $this->sendError('Season not found.');
        }

        $request->validate([
            'season_number' => 'required|integer|min:1',
        ]);

        $season->season_number = $request->season_number;
        $season->save();

        return $this->sendResponse($season, 'Season updated successfully.');
    }

    public function destroy($id)
    {
        $season = Season::find($id);
        if (!$season) {
            return $this->sendError('Season not found.');
        }

        $season->delete();

        return $this->sendResponse(null, 'Season deleted successfully.');
    }
}
