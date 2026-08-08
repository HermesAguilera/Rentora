<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\BookingStatus;
use App\Enums\SpaceStatus;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Space;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;

/** Cifras que se muestran en la landing pública. */
class PublicStatsController extends Controller
{
    public function index(): JsonResponse
    {
        $stats = Cache::remember('public.stats', 300, fn () => [
            'active_spaces' => Space::where('status', SpaceStatus::ACTIVE)->count(),
            'registered_users' => User::count(),
            'completed_bookings' => Booking::where('status', BookingStatus::COMPLETED)->count(),
            'average_rating' => round((float) Review::where('is_visible', true)->avg('rating'), 1),
            'platform_fee_percentage' => (float) config('rentora.platform_fee_percentage'),
        ]);

        return response()->json(['data' => $stats]);
    }
}
