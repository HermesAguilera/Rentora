<?php

namespace App\Http\Controllers\Api\V1\Space;

use Illuminate\Routing\Controller;
use OpenApi\Annotations as OA;
use App\Models\Space;
use App\Models\SpacePhoto;
use App\Http\Requests\Space\UploadPhotoRequest;
use App\Http\Requests\Space\ReorderPhotosRequest;
use App\Jobs\ProcessSpacePhoto;
use App\Http\Resources\SpacePhotoResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SpacePhotoController extends Controller
{
    /**
     * @OA\Post(
     *   path="/api/v1/spaces/{uuid}/photos",
     *   tags={"Photos"},
     *   summary="Upload a photo",
     *   description="Uploads a new photo for a specific space.",
     *   operationId="spacePhotoStore",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *       @OA\Schema(
     *         @OA\Property(property="photo", type="string", format="binary")
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=202,
     *     description="Photo accepted for processing",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Foto en proceso."),
     *       @OA\Property(property="data", ref="#/components/schemas/SpacePhoto")
     *     )
     *   ),
     *   @OA\Response(response=400, description="Max photos reached"),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error")),
     *   @OA\Response(response=429, description="Too many requests")
     * )
     */
    public function store(UploadPhotoRequest $request, Space $space): JsonResponse
    {
        if ($space->photos()->count() >= 10) {
            return response()->json(['message' => 'Máximo 10 fotos permitidas.'], 400);
        }

        $file = $request->file('photo');
        $path = $file->store('temp_photos', 'local');

        $isPrimary = $space->photos()->count() === 0;

        $photo = $space->photos()->create([
            'original_path' => $path,
            'is_primary' => $isPrimary,
            'order' => $space->photos()->count(),
            'processing' => true,
        ]);

        ProcessSpacePhoto::dispatch($photo);

        return response()->json([
            'message' => 'Foto en proceso.',
            'data' => new SpacePhotoResource($photo)
        ], 202);
    }

    /**
     * @OA\Delete(
     *   path="/api/v1/spaces/{uuid}/photos/{photo_uuid}",
     *   tags={"Photos"},
     *   summary="Delete photo",
     *   description="Deletes a space photo. Cannot delete primary if it's the last one.",
     *   operationId="spacePhotoDestroy",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Parameter(name="photo_uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Photo deleted successfully",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Foto eliminada.")
     *     )
     *   ),
     *   @OA\Response(response=400, description="Cannot delete primary photo"),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy(Request $request, Space $space, SpacePhoto $photo): JsonResponse
    {
        $this->authorize('update', $space);

        if ($photo->space_id !== $space->id) {
            abort(404);
        }

        if ($photo->is_primary && $space->photos()->count() > 1) {
            return response()->json(['message' => 'No puedes eliminar la foto principal si hay otras fotos. Cambia la principal primero.'], 400);
        }

        $photo->delete();

        return response()->json(['message' => 'Foto eliminada.']);
    }

    /**
     * @OA\Patch(
     *   path="/api/v1/spaces/{uuid}/photos/reorder",
     *   tags={"Photos"},
     *   summary="Reorder photos",
     *   description="Updates the display order of photos.",
     *   operationId="spacePhotoReorder",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       @OA\Property(property="photo_uuids", type="array", @OA\Items(type="string", format="uuid"))
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Photos reordered",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Fotos reordenadas.")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function reorder(ReorderPhotosRequest $request, Space $space): JsonResponse
    {
        $uuids = $request->validated()['photo_uuids'];

        foreach ($uuids as $index => $uuid) {
            $space->photos()->where('uuid', $uuid)->update(['order' => $index]);
        }

        return response()->json(['message' => 'Fotos reordenadas.']);
    }

    /**
     * @OA\Patch(
     *   path="/api/v1/spaces/{uuid}/photos/{photo_uuid}/set-primary",
     *   tags={"Photos"},
     *   summary="Set primary photo",
     *   description="Sets a photo as the primary image for the space.",
     *   operationId="spacePhotoSetPrimary",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Parameter(name="photo_uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Primary photo updated",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Foto principal actualizada.")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function setPrimary(Request $request, Space $space, SpacePhoto $photo): JsonResponse
    {
        $this->authorize('update', $space);

        if ($photo->space_id !== $space->id) {
            abort(404);
        }

        $space->photos()->update(['is_primary' => false]);
        $photo->update(['is_primary' => true]);

        return response()->json(['message' => 'Foto principal actualizada.']);
    }
}
