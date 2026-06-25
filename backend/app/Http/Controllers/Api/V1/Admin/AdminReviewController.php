<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    /**
     *   path="/api/v1/admin/reviews/flagged",
     *   tags={"Admin"},
     *   summary="List flagged reviews",
     *   description="⚠️ Requires admin role. Lists reviews flagged by users.",
     *   operationId="adminReviewsFlagged",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="List of flagged reviews",
     *     )
     *   ),
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
     *   path="/api/v1/admin/reviews/{uuid}/hide",
     *   tags={"Admin"},
     *   summary="Hide review",
     *   description="⚠️ Requires admin role. Hides a review.",
     *   operationId="adminReviewsHide",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Review hidden",
     *     )
     *   ),
     * )
     */
    public function hide(Review $review)
    {
        $review->is_visible = false;
        $review->save();

        return response()->json(['message' => 'Review hidden']);
    }

    /**
     *   path="/api/v1/admin/reviews/{uuid}/restore",
     *   tags={"Admin"},
     *   summary="Restore review",
     *   description="⚠️ Requires admin role. Restores a hidden review.",
     *   operationId="adminReviewsRestore",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Review restored",
     *     )
     *   ),
     * )
     */
    public function restore(Review $review)
    {
        $review->is_visible = true;
        $review->save();

        return response()->json(['message' => 'Review restored']);
    }
}
