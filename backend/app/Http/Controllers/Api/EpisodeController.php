<?php

namespace App\Http\Controllers\Api;

use App\Models\Season;
use App\Models\Episode;
use Illuminate\Http\Request;

class EpisodeController extends BaseController
{
    public function index($seasonId)
    {
        $season = Season::find($seasonId);
        if (!$season) {
            return $this->sendError('Season not found.');
        }

        $episodes = Episode::where('season_id', $seasonId)
            ->orderBy('episode_number', 'asc')
            ->get();

        return $this->sendResponse($episodes, 'Episodes retrieved successfully.');
    }

    public function store(Request $request, $seasonId)
    {
        $season = Season::find($seasonId);
        if (!$season) {
            return $this->sendError('Season not found.');
        }

        $request->validate([
            'episode_number' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'runtime_minutes' => 'nullable|integer|min:1',
        ]);

        $episode = Episode::create([
            'season_id' => $seasonId,
            'episode_number' => $request->episode_number,
            'title' => $request->title,
            'runtime_minutes' => $request->runtime_minutes,
        ]);

        return $this->sendResponse($episode, 'Episode created successfully.');
    }

    public function update(Request $request, $id)
    {
        $episode = Episode::find($id);
        if (!$episode) {
            return $this->sendError('Episode not found.');
        }

        $request->validate([
            'episode_number' => 'sometimes|integer|min:1',
            'title' => 'sometimes|string|max:255',
            'runtime_minutes' => 'nullable|integer|min:1',
        ]);

        if ($request->has('episode_number')) {
            $episode->episode_number = $request->episode_number;
        }
        if ($request->has('title')) {
            $episode->title = $request->title;
        }
        if ($request->has('runtime_minutes')) {
            $episode->runtime_minutes = $request->runtime_minutes;
        }

        $episode->save();

        return $this->sendResponse($episode, 'Episode updated successfully.');
    }

    public function destroy($id)
    {
        $episode = Episode::find($id);
        if (!$episode) {
            return $this->sendError('Episode not found.');
        }

        $episode->delete();

        return $this->sendResponse(null, 'Episode deleted successfully.');
    }
}
