<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Booking;
use App\Models\Space;
use App\Services\BookingService;
use App\Http\Requests\CreateBookingRequest;
use App\Http\Requests\CancelBookingRequest;
use App\Http\Requests\DisputeBookingRequest;
use App\Http\Resources\BookingResource;
use Illuminate\Http\Request;

class BookingController extends BaseApiController
{
    use AuthorizesRequests;

    public function __construct(private BookingService $bookingService) {}

    /**
     *   path="/api/v1/bookings",
     *   tags={"Bookings"},
     *   summary="Create booking request",
     *   description="Creates a new booking request for a space.",
     *   operationId="bookingStore",
     *   security={{"sanctum": {}}},
     *     required=true,
     *       required={"space_uuid","start_date","months_duration"},
     *     )
     *   ),
     *     response=201,
     *     description="Booking created",
     *   ),
     * )
     */
    public function store(CreateBookingRequest $request)
    {
        $space = Space::where('uuid', $request->validated('space_uuid'))->firstOrFail();

        if ($space->user_id === $request->user()->id) {
            return response()->json(['message' => 'Cannot book your own space'], 403);
        }

        if (!$this->bookingService->checkAvailability($space, \Carbon\Carbon::parse($request->validated('start_date')), $request->validated('months_duration'))) {
            return response()->json(['message' => 'Space is not available for the requested period'], 422);
        }

        $booking = $this->bookingService->createBooking($request->user(), $space, $request->validated());

        return response()->json(new BookingResource($booking), 201);
    }

    /**
     *   path="/api/v1/bookings",
     *   tags={"Bookings"},
     *   summary="List bookings",
     *   description="Lists bookings for the authenticated user (as renter or host).",
     *   operationId="bookingIndex",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="List of bookings",
     *     )
     *   ),
     * )
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $as = $request->query('as', 'renter');

        $query = Booking::query()->with(['space.primaryPhoto', 'renter', 'host']);

        if ($as === 'host') {
            $query->whereHas('space', function ($q) use ($user) {
                $q->where('host_id', $user->id);
            });
        } else {
            $query->where('renter_id', $user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('space_uuid')) {
            $query->whereHas('space', function ($q) use ($request) {
                $q->where('uuid', $request->query('space_uuid'));
            });
        }

        return BookingResource::collection($query->paginate());
    }

    /**
     *   path="/api/v1/bookings/{uuid}",
     *   tags={"Bookings"},
     *   summary="Get booking details",
     *   description="Returns detailed information about a specific booking.",
     *   operationId="bookingShow",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Booking details",
     *     )
     *   ),
     * )
     */
    public function show(Booking $booking, Request $request)
    {
        $this->authorize('view', $booking);
        $booking->load(['space.primaryPhoto', 'renter', 'host']);
        return new BookingResource($booking);
    }

    /**
     *   path="/api/v1/bookings/{uuid}/confirm",
     *   tags={"Bookings"},
     *   summary="Confirm booking",
     *   description="Host confirms a pending booking request.",
     *   operationId="bookingConfirm",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Booking confirmed",
     *     )
     *   ),
     * )
     */
    public function confirm(Booking $booking, Request $request)
    {
        $this->authorize('confirm', $booking);
        $this->bookingService->confirmBooking($booking, $request->user());
        return new BookingResource($booking);
    }

    /**
     *   path="/api/v1/bookings/{uuid}/cancel",
     *   tags={"Bookings"},
     *   summary="Cancel booking",
     *   description="Cancel a booking (by host or renter).",
     *   operationId="bookingCancel",
     *   security={{"sanctum": {}}},
     *     required=true,
     *       required={"cancellation_reason"},
     *     )
     *   ),
     *     response=200,
     *     description="Booking cancelled",
     *     )
     *   ),
     * )
     */
    public function cancel(Booking $booking, CancelBookingRequest $request)
    {
        $this->authorize('cancel', $booking);
        $this->bookingService->cancelBooking($booking, $request->user(), $request->validated('cancellation_reason'));
        return new BookingResource($booking);
    }

    /**
     *   path="/api/v1/bookings/{uuid}/complete",
     *   tags={"Bookings"},
     *   summary="Complete booking",
     *   description="Marks an active booking as completed.",
     *   operationId="bookingComplete",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Booking completed",
     *     )
     *   ),
     * )
     */
    public function complete(Booking $booking, Request $request)
    {
        $this->authorize('complete', $booking);
        \App\Services\BookingStateMachine::transition($booking, \App\Enums\BookingStatus::COMPLETED);
        return new BookingResource($booking);
    }

    /**
     *   path="/api/v1/bookings/{uuid}/dispute",
     *   tags={"Bookings"},
     *   summary="Dispute booking",
     *   description="Raises a dispute for an active booking.",
     *   operationId="bookingDispute",
     *   security={{"sanctum": {}}},
     *     required=true,
     *       required={"reason"},
     *     )
     *   ),
     *     response=200,
     *     description="Booking disputed",
     *     )
     *   ),
     * )
     */
    public function dispute(Booking $booking, DisputeBookingRequest $request)
    {
        $this->authorize('dispute', $booking);
        \App\Services\BookingStateMachine::transition($booking, \App\Enums\BookingStatus::DISPUTED);
        return new BookingResource($booking);
    }
}
