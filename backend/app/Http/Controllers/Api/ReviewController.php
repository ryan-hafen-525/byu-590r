<?php

namespace App\Http\Controllers\Api;

use App\Models\Media;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends BaseController
{
    public function index($mediaId)
    {
        $media = Media::find($mediaId);
        if (!$media) {
            return $this->sendError('Media not found.');
        }

        $reviews = Review::with('user')
            ->where('media_id', $mediaId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->sendResponse($reviews, 'Reviews retrieved successfully.');
    }

    public function store(Request $request, $mediaId)
    {
        $media = Media::find($mediaId);
        if (!$media) {
            return $this->sendError('Media not found.');
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'nullable|string',
        ]);

        $user = $request->user();

        $review = Review::updateOrCreate(
            ['media_id' => $mediaId, 'user_id' => $user->id],
            ['rating' => $request->rating, 'review_text' => $request->review_text]
        );

        $review->load('user');

        return $this->sendResponse($review, 'Review saved successfully.');
    }

    public function destroy($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return $this->sendError('Review not found.');
        }

        $review->delete();

        return $this->sendResponse(null, 'Review deleted successfully.');
    }
}
