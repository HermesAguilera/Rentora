<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use OpenApi\Annotations as OA;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminDisputeController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/v1/admin/disputes",
     *   tags={"Admin"},
     *   summary="List all disputed bookings",
     *   description="⚠️ Requires admin role. Lists all bookings with status 'disputed'.",
     *   operationId="adminDisputesIndex",
     *   security={{"sanctum": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="List of disputes",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Booking")),
     *       @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden — admin role required")
     * )
     */
    public function index()
    {
        $disputes = Booking::where('status', \App\Enums\BookingStatus::DISPUTED)
            ->with(['renter', 'space.host'])
            ->paginate();

        return response()->json($disputes);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/admin/bookings/{uuid}/resolve-dispute",
     *   tags={"Admin"},
     *   summary="Resolve dispute",
     *   description="⚠️ Requires admin role. Resolves a disputed booking.",
     *   operationId="adminDisputesResolve",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"status","resolution_notes"},
     *       @OA\Property(property="status", type="string", enum={"completed","cancelled_by_renter","cancelled_by_host"}),
     *       @OA\Property(property="resolution_notes", type="string")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Dispute resolved",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Dispute resolved"),
     *       @OA\Property(property="booking", ref="#/components/schemas/Booking")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden — admin role required"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function resolve(Request $request, Booking $booking)
    {
        $request->validate([
            'status' => 'required|in:completed,cancelled_by_renter,cancelled_by_host',
            'resolution_notes' => 'required|string',
        ]);

        if ($booking->status !== \App\Enums\BookingStatus::DISPUTED) {
            return response()->json(['message' => 'Booking is not disputed'], 422);
        }

        $statusMap = [
            'completed' => \App\Enums\BookingStatus::COMPLETED,
            'cancelled_by_renter' => \App\Enums\BookingStatus::CANCELLED_BY_RENTER,
            'cancelled_by_host' => \App\Enums\BookingStatus::CANCELLED_BY_HOST,
        ];

        \App\Services\BookingStateMachine::transition($booking, $statusMap[$request->status]);
        
        $booking->resolution_notes = $request->resolution_notes;
        $booking->save();

        return response()->json(['message' => 'Dispute resolved', 'booking' => $booking]);
    }
}
