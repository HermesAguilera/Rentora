<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use App\Models\Review;
use App\Models\Booking;
use App\Models\Space;
use App\Models\User;
use App\Http\Requests\SubmitReviewRequest;
use App\Http\Requests\FlagReviewRequest;
use App\Http\Resources\ReviewResource;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     *   path="/api/v1/reviews",
     *   tags={"Reviews"},
     *   summary="Submit a review",
     *   description="Submits a review for a completed booking.",
     *   operationId="reviewStore",
     *   security={{"sanctum": {}}},
     *     required=true,
     *       required={"booking_uuid","rating"},
     *     )
     *   ),
     *     response=201,
     *     description="Review submitted successfully",
     *   ),
     * )
     */
    public function store(SubmitReviewRequest $request)
    {
        $booking = Booking::where('uuid', $request->validated('booking_uuid'))->firstOrFail();

        if ($booking->status !== \App\Enums\BookingStatus::COMPLETED) {
            return response()->json(['message' => 'Can only review completed bookings'], 422);
        }

        $user = $request->user();
        $isRenter = $user->id === $booking->renter_id;
        $isHost = $user->id === $booking->space->user_id;

        if (!$isRenter && !$isHost) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $revieweeType = $isRenter ? 'host' : 'renter';
        $revieweeId = $isRenter ? $booking->space->user_id : $booking->renter_id;

        $existing = Review::where('booking_id', $booking->id)
            ->where('reviewer_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already reviewed'], 422);
        }

        $review = new Review([
            'booking_id' => $booking->id,
            'reviewer_id' => $user->id,
            'reviewee_id' => $revieweeId,
            'reviewee_type' => $revieweeType,
            'rating' => $request->validated('rating'),
            'comment' => $request->validated('comment'),
            'is_visible' => false,
        ]);

        $review->save();

        return response()->json(new ReviewResource($review), 201);
    }

    /**
     *   path="/api/v1/spaces/{uuid}/reviews",
     *   tags={"Reviews"},
     *   summary="Get space reviews",
     *   description="List all public reviews for a space (reviews of the host for that space).",
     *   operationId="reviewSpaceReviews",
     *     response=200,
     *     description="List of reviews",
     *     )
     *   ),
     * )
     */
    public function spaceReviews(Space $space)
    {
        $reviews = Review::where('reviewee_type', 'host')
            ->where('reviewee_id', $space->user_id)
            ->whereHas('booking', function ($q) use ($space) {
                $q->where('space_id', $space->id);
            })
            ->where('is_visible', true)
            ->with('reviewer')
            ->paginate();

        return ReviewResource::collection($reviews);
    }

    /**
     *   path="/api/v1/users/{uuid}/reviews",
     *   tags={"Reviews"},
     *   summary="Get user reviews",
     *   description="List all public reviews received by a user (either as host or renter).",
     *   operationId="reviewUserReviews",
     *     response=200,
     *     description="List of reviews",
     *     )
     *   ),
     * )
     */
    public function userReviews(User $user)
    {
        $reviews = Review::where('reviewee_id', $user->id)
            ->where('is_visible', true)
            ->with('reviewer')
            ->paginate();

        return ReviewResource::collection($reviews);
    }

    /**
     *   path="/api/v1/reviews/{uuid}/flag",
     *   tags={"Reviews"},
     *   summary="Flag a review",
     *   description="Flags a review for moderation.",
     *   operationId="reviewFlag",
     *   security={{"sanctum": {}}},
     *     required=true,
     *       required={"reason"},
     *     )
     *   ),
     *     response=200,
     *     description="Review flagged",
     *     )
     *   ),
     * )
     */
    public function flag(Review $review, FlagReviewRequest $request)
    {
        $this->authorize('flag', $review);
        return response()->json(['message' => 'Review flagged']);
    }
}
