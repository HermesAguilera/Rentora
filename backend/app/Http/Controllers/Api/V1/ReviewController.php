<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use OpenApi\Annotations as OA;
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
     * @OA\Post(
     *   path="/api/v1/reviews",
     *   tags={"Reviews"},
     *   summary="Submit a review",
     *   description="Submits a review for a completed booking.",
     *   operationId="reviewStore",
     *   security={{"sanctum": {}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"booking_uuid","rating"},
     *       @OA\Property(property="booking_uuid", type="string", format="uuid"),
     *       @OA\Property(property="rating", type="integer", example=5),
     *       @OA\Property(property="comment", type="string", nullable=true, example="Great experience!")
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Review submitted successfully",
     *     @OA\JsonContent(ref="#/components/schemas/Review")
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=422, description="Validation error or already reviewed", @OA\JsonContent(ref="#/components/schemas/Error"))
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
     * @OA\Get(
     *   path="/api/v1/spaces/{uuid}/reviews",
     *   tags={"Reviews"},
     *   summary="Get space reviews",
     *   description="List all public reviews for a space (reviews of the host for that space).",
     *   operationId="reviewSpaceReviews",
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer")),
     *   @OA\Response(
     *     response=200,
     *     description="List of reviews",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Review")),
     *       @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
     *       @OA\Property(property="links", ref="#/components/schemas/PaginationLinks")
     *     )
     *   ),
     *   @OA\Response(response=404, description="Not Found")
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
     * @OA\Get(
     *   path="/api/v1/users/{uuid}/reviews",
     *   tags={"Reviews"},
     *   summary="Get user reviews",
     *   description="List all public reviews received by a user (either as host or renter).",
     *   operationId="reviewUserReviews",
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer")),
     *   @OA\Response(
     *     response=200,
     *     description="List of reviews",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Review")),
     *       @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
     *       @OA\Property(property="links", ref="#/components/schemas/PaginationLinks")
     *     )
     *   ),
     *   @OA\Response(response=404, description="Not Found")
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
     * @OA\Post(
     *   path="/api/v1/reviews/{uuid}/flag",
     *   tags={"Reviews"},
     *   summary="Flag a review",
     *   description="Flags a review for moderation.",
     *   operationId="reviewFlag",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"reason"},
     *       @OA\Property(property="reason", type="string", example="Inappropriate content")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Review flagged",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Review flagged")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function flag(Review $review, FlagReviewRequest $request)
    {
        $this->authorize('flag', $review);
        return response()->json(['message' => 'Review flagged']);
    }
}
