<?php

namespace App\Http\Controllers\Api\V1\Space;

use Illuminate\Routing\Controller;
use OpenApi\Annotations as OA;
use App\Models\Space;
use App\Services\SpaceService;
use App\Repositories\SpaceRepository;
use App\Http\Requests\Space\CreateSpaceRequest;
use App\Http\Requests\Space\UpdateSpaceRequest;
use App\Http\Resources\SpacePublicResource;
use App\Http\Resources\SpacePrivateResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use App\Enums\SpaceStatus;

class SpaceController extends Controller
{
    public function __construct(
        private SpaceService $spaceService,
        private SpaceRepository $spaceRepository
    ) {
    }

    /**
     * @OA\Get(
     *   path="/api/v1/spaces",
     *   tags={"Spaces"},
     *   summary="List active spaces",
     *   description="Browse publicly active storage spaces. Can be filtered by various parameters.",
     *   operationId="spaceIndex",
     *   @OA\Parameter(name="city", in="query", required=false, @OA\Schema(type="string")),
     *   @OA\Parameter(name="type", in="query", required=false, @OA\Schema(type="string", enum={"garage","room","warehouse"})),
     *   @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer")),
     *   @OA\Response(
     *     response=200,
     *     description="List of spaces",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Space")),
     *       @OA\Property(property="meta", type="object")
     *     )
     *   )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'type', 'city', 'neighborhood', 'min_price', 'max_price',
            'min_width', 'min_height', 'amenities', 'sort'
        ]);

        $paginator = $this->spaceRepository->searchSpaces($filters, $request->get('per_page', 15));

        return response()->json([
            'data' => SpacePublicResource::collection($paginator),
            'meta' => [
                'has_more' => $paginator->hasMorePages(),
                'next_cursor' => $paginator->nextCursor()?->encode(),
                'prev_cursor' => $paginator->previousCursor()?->encode(),
            ]
        ]);
    }

    /**
     * @OA\Get(
     *   path="/api/v1/spaces/{uuid}",
     *   tags={"Spaces"},
     *   summary="Get space details",
     *   description="Returns detailed information about a specific space, including availability calendar.",
     *   operationId="spaceShow",
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Space details",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", ref="#/components/schemas/Space")
     *     )
     *   ),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function show(Request $request, Space $space): JsonResponse
    {
        if ($space->status !== SpaceStatus::ACTIVE && (!$request->user() || $request->user()->id !== $space->host_id)) {
            abort(404);
        }

        $space->load(['host', 'photos' => fn($q) => $q->orderBy('order')]);
        
        $this->spaceService->incrementViewCount($space);

        $resourceClass = ($request->user() && $request->user()->id === $space->host_id) 
            ? SpacePrivateResource::class 
            : SpacePublicResource::class;

        $resource = new $resourceClass($space);
        
        $resource->additional([
            'availability_calendar' => $this->spaceService->calculateAvailability(
                $space, 
                now(), 
                now()->addMonths(3)
            )
        ]);

        return response()->json(['data' => $resource]);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/spaces",
     *   tags={"Spaces"},
     *   summary="Create a new space",
     *   description="Creates a new space in 'draft' status.",
     *   operationId="spaceStore",
     *   security={{"sanctum": {}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"title","type","price_per_month"},
     *       @OA\Property(property="title", type="string", example="Garage in City Center"),
     *       @OA\Property(property="type", type="string", enum={"garage","room","warehouse"}, example="garage"),
     *       @OA\Property(property="price_per_month", type="number", example=100)
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Space created successfully",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Espacio creado exitosamente como borrador."),
     *       @OA\Property(property="data", ref="#/components/schemas/Space")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function store(CreateSpaceRequest $request): JsonResponse
    {
        $space = $this->spaceService->createSpace($request->user(), $request->validated());
        return response()->json([
            'message' => 'Espacio creado exitosamente como borrador.',
            'data' => new SpacePrivateResource($space)
        ], 201);
    }

    /**
     * @OA\Patch(
     *   path="/api/v1/spaces/{uuid}",
     *   tags={"Spaces"},
     *   summary="Update a space",
     *   description="Updates space properties. Cannot update if there are active bookings.",
     *   operationId="spaceUpdate",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       @OA\Property(property="title", type="string", example="Updated Title")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Space updated successfully",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Espacio actualizado exitosamente."),
     *       @OA\Property(property="data", ref="#/components/schemas/Space")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=409, description="Conflict - active bookings exist"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function update(UpdateSpaceRequest $request, Space $space): JsonResponse
    {
        if ($space->bookings()->whereIn('status', ['active'])->exists()) {
            return response()->json(['message' => 'No puedes editar un espacio con reservaciones activas.'], 409);
        }

        $space = $this->spaceService->updateSpace($space, $request->validated());
        return response()->json([
            'message' => 'Espacio actualizado exitosamente.',
            'data' => new SpacePrivateResource($space->refresh())
        ]);
    }

    /**
     * @OA\Delete(
     *   path="/api/v1/spaces/{uuid}",
     *   tags={"Spaces"},
     *   summary="Delete a space",
     *   description="Deletes a space. Cannot delete if there are pending or active bookings.",
     *   operationId="spaceDestroy",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Space deleted successfully",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Espacio eliminado exitosamente.")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=409, description="Conflict")
     * )
     */
    public function destroy(Request $request, Space $space): JsonResponse
    {
        $this->authorize('delete', $space);

        if ($space->bookings()->whereIn('status', ['pending', 'active'])->exists()) {
            return response()->json(['message' => 'No puedes eliminar un espacio con reservaciones pendientes o activas.'], 409);
        }

        $space->delete();
        
        return response()->json(['message' => 'Espacio eliminado exitosamente.']);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/spaces/{uuid}/publish",
     *   tags={"Spaces"},
     *   summary="Submit space for review",
     *   description="Moves a draft space to pending status for admin review.",
     *   operationId="spacePublish",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Space published",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Espacio enviado a revisión exitosamente."),
     *       @OA\Property(property="data", ref="#/components/schemas/Space")
     *     )
     *   ),
     *   @OA\Response(response=400, description="Bad request (missing photos, etc)"),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function publish(Request $request, Space $space): JsonResponse
    {
        $this->authorize('publish', $space);

        try {
            $space = $this->spaceService->publishSpace($space);
            return response()->json([
                'message' => 'Espacio enviado a revisión exitosamente.',
                'data' => new SpacePrivateResource($space)
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * @OA\Post(
     *   path="/api/v1/spaces/{uuid}/pause",
     *   tags={"Spaces"},
     *   summary="Pause space listing",
     *   description="Temporarily hides an active space from public listings.",
     *   operationId="spacePause",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Space paused",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Espacio pausado exitosamente.")
     *     )
     *   ),
     *   @OA\Response(response=400, description="Bad request (space not active)"),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function pause(Request $request, Space $space): JsonResponse
    {
        $this->authorize('pause', $space);

        if ($space->status !== SpaceStatus::ACTIVE) {
            return response()->json(['message' => 'El espacio no está activo.'], 400);
        }

        $space->update(['status' => SpaceStatus::PAUSED]);
        return response()->json(['message' => 'Espacio pausado exitosamente.']);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/spaces/{uuid}/reactivate",
     *   tags={"Spaces"},
     *   summary="Reactivate paused space",
     *   description="Makes a paused space public again.",
     *   operationId="spaceReactivate",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Space reactivated",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Espacio reactivado exitosamente.")
     *     )
     *   ),
     *   @OA\Response(response=400, description="Bad request (space not paused)"),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function reactivate(Request $request, Space $space): JsonResponse
    {
        $this->authorize('reactivate', $space);

        if ($space->status !== SpaceStatus::PAUSED) {
            return response()->json(['message' => 'El espacio no está pausado.'], 400);
        }

        $space->update(['status' => SpaceStatus::ACTIVE]);
        return response()->json(['message' => 'Espacio reactivado exitosamente.']);
    }

    /**
     * @OA\Get(
     *   path="/api/v1/spaces/{uuid}/bookings",
     *   tags={"Spaces"},
     *   summary="Get space bookings",
     *   description="List all bookings for a specific space (Host only).",
     *   operationId="spaceBookings",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="List of bookings",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Booking"))
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function bookings(Request $request, Space $space): JsonResponse
    {
        $this->authorize('viewBookings', $space);

        $bookings = $space->bookings()
            ->when($request->query('status'), fn($q, $status) => $q->where('status', $status))
            ->orderBy('created_at', 'desc')
            ->paginate($request->query('per_page', 15));

        return response()->json($bookings);
    }

    /**
     * @OA\Get(
     *   path="/api/v1/me/spaces",
     *   tags={"Spaces"},
     *   summary="List my spaces",
     *   description="List all spaces owned by the authenticated user.",
     *   operationId="spaceMySpaces",
     *   security={{"sanctum": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="List of spaces",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Space"))
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function mySpaces(Request $request): JsonResponse
    {
        $spaces = $request->user()->spaces()
            ->with(['photos' => fn($q) => $q->where('is_primary', true)->limit(1)])
            ->orderBy('created_at', 'desc')
            ->paginate($request->query('per_page', 15));

        return response()->json($spaces);
    }
}
