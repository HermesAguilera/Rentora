<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use OpenApi\Annotations as OA;
use App\Models\Booking;
use App\Models\Space;
use App\Services\BookingService;
use App\Http\Requests\CreateBookingRequest;
use App\Http\Requests\CancelBookingRequest;
use App\Http\Requests\DisputeBookingRequest;
use App\Http\Resources\BookingResource;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    /**
     * @OA\Post(
     *   path="/api/v1/bookings",
     *   tags={"Bookings"},
     *   summary="Create booking request",
     *   description="Creates a new booking request for a space.",
     *   operationId="bookingStore",
     *   security={{"sanctum": {}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"space_uuid","start_date","months_duration"},
     *       @OA\Property(property="space_uuid", type="string", format="uuid"),
     *       @OA\Property(property="start_date", type="string", format="date", example="2026-07-01"),
     *       @OA\Property(property="months_duration", type="integer", example=2)
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Booking created",
     *     @OA\JsonContent(ref="#/components/schemas/Booking")
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Cannot book your own space"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=422, description="Validation error or space unavailable", @OA\JsonContent(ref="#/components/schemas/Error"))
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
     * @OA\Get(
     *   path="/api/v1/bookings",
     *   tags={"Bookings"},
     *   summary="List bookings",
     *   description="Lists bookings for the authenticated user (as renter or host).",
     *   operationId="bookingIndex",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="as", in="query", required=false, description="Role to view as (renter/host)", @OA\Schema(type="string", enum={"renter","host"}, default="renter")),
     *   @OA\Parameter(name="status", in="query", required=false, @OA\Schema(type="string")),
     *   @OA\Parameter(name="space_uuid", in="query", required=false, @OA\Schema(type="string", format="uuid")),
     *   @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer")),
     *   @OA\Response(
     *     response=200,
     *     description="List of bookings",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Booking")),
     *       @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
     *       @OA\Property(property="links", ref="#/components/schemas/PaginationLinks")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $as = $request->query('as', 'renter');

        $query = Booking::query()->with(['space.primaryPhoto', 'renter', 'host']);

        if ($as === 'host') {
            $query->whereHas('space', function ($q) use ($user) {
                $q->where('user_id', $user->id);
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
     * @OA\Get(
     *   path="/api/v1/bookings/{uuid}",
     *   tags={"Bookings"},
     *   summary="Get booking details",
     *   description="Returns detailed information about a specific booking.",
     *   operationId="bookingShow",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Booking details",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", ref="#/components/schemas/Booking")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function show(Booking $booking, Request $request)
    {
        $this->authorize('view', $booking);
        $booking->load(['space.primaryPhoto', 'renter', 'host']);
        return new BookingResource($booking);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/bookings/{uuid}/confirm",
     *   tags={"Bookings"},
     *   summary="Confirm booking",
     *   description="Host confirms a pending booking request.",
     *   operationId="bookingConfirm",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Booking confirmed",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", ref="#/components/schemas/Booking")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=409, description="Invalid state transition")
     * )
     */
    public function confirm(Booking $booking, Request $request)
    {
        $this->authorize('confirm', $booking);
        $this->bookingService->confirmBooking($booking, $request->user());
        return new BookingResource($booking);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/bookings/{uuid}/cancel",
     *   tags={"Bookings"},
     *   summary="Cancel booking",
     *   description="Cancel a booking (by host or renter).",
     *   operationId="bookingCancel",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"cancellation_reason"},
     *       @OA\Property(property="cancellation_reason", type="string", example="Plans changed")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Booking cancelled",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", ref="#/components/schemas/Booking")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=409, description="Invalid state transition"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function cancel(Booking $booking, CancelBookingRequest $request)
    {
        $this->authorize('cancel', $booking);
        $this->bookingService->cancelBooking($booking, $request->user(), $request->validated('cancellation_reason'));
        return new BookingResource($booking);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/bookings/{uuid}/complete",
     *   tags={"Bookings"},
     *   summary="Complete booking",
     *   description="Marks an active booking as completed.",
     *   operationId="bookingComplete",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Booking completed",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", ref="#/components/schemas/Booking")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=409, description="Invalid state transition")
     * )
     */
    public function complete(Booking $booking, Request $request)
    {
        $this->authorize('complete', $booking);
        \App\Services\BookingStateMachine::transition($booking, \App\Enums\BookingStatus::COMPLETED);
        return new BookingResource($booking);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/bookings/{uuid}/dispute",
     *   tags={"Bookings"},
     *   summary="Dispute booking",
     *   description="Raises a dispute for an active booking.",
     *   operationId="bookingDispute",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"reason"},
     *       @OA\Property(property="reason", type="string", example="Damage to items")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Booking disputed",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", ref="#/components/schemas/Booking")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=409, description="Invalid state transition"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function dispute(Booking $booking, DisputeBookingRequest $request)
    {
        $this->authorize('dispute', $booking);
        \App\Services\BookingStateMachine::transition($booking, \App\Enums\BookingStatus::DISPUTED);
        return new BookingResource($booking);
    }
}
