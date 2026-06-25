<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminDisputeController extends Controller
{
    /**
     *   path="/api/v1/admin/disputes",
     *   tags={"Admin"},
     *   summary="List all disputed bookings",
     *   description="⚠️ Requires admin role. Lists all bookings with status 'disputed'.",
     *   operationId="adminDisputesIndex",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="List of disputes",
     *     )
     *   ),
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
     *   path="/api/v1/admin/bookings/{uuid}/resolve-dispute",
     *   tags={"Admin"},
     *   summary="Resolve dispute",
     *   description="⚠️ Requires admin role. Resolves a disputed booking.",
     *   operationId="adminDisputesResolve",
     *   security={{"sanctum": {}}},
     *     required=true,
     *       required={"status","resolution_notes"},
     *     )
     *   ),
     *     response=200,
     *     description="Dispute resolved",
     *     )
     *   ),
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
