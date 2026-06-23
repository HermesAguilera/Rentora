<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use OpenApi\Annotations as OA;
use App\Models\Review;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/v1/admin/reviews/flagged",
     *   tags={"Admin"},
     *   summary="List flagged reviews",
     *   description="⚠️ Requires admin role. Lists reviews flagged by users.",
     *   operationId="adminReviewsFlagged",
     *   security={{"sanctum": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="List of flagged reviews",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Review")),
     *       @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden — admin role required")
     * )
     */
    public function flagged()
    {
        $reviews = Review::where('is_flagged', true)
            ->with(['reviewer', 'booking'])
            ->paginate();

        return response()->json($reviews);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/admin/reviews/{uuid}/hide",
     *   tags={"Admin"},
     *   summary="Hide review",
     *   description="⚠️ Requires admin role. Hides a review.",
     *   operationId="adminReviewsHide",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Review hidden",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Review hidden")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden — admin role required"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function hide(Review $review)
    {
        $review->is_visible = false;
        $review->save();

        return response()->json(['message' => 'Review hidden']);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/admin/reviews/{uuid}/restore",
     *   tags={"Admin"},
     *   summary="Restore review",
     *   description="⚠️ Requires admin role. Restores a hidden review.",
     *   operationId="adminReviewsRestore",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Review restored",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Review restored")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden — admin role required"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function restore(Review $review)
    {
        $review->is_visible = true;
        $review->save();

        return response()->json(['message' => 'Review restored']);
    }
}
