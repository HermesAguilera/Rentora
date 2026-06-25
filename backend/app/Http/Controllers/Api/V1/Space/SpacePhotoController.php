<?php

namespace App\Http\Controllers\Api\V1\Space;

use Illuminate\Routing\Controller;
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
     *   path="/api/v1/spaces/{uuid}/photos",
     *   tags={"Photos"},
     *   summary="Upload a photo",
     *   description="Uploads a new photo for a specific space.",
     *   operationId="spacePhotoStore",
     *   security={{"sanctum": {}}},
     *     required=true,
     *       mediaType="multipart/form-data",
     *       )
     *     )
     *   ),
     *     response=202,
     *     description="Photo accepted for processing",
     *     )
     *   ),
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
     *   path="/api/v1/spaces/{uuid}/photos/{photo_uuid}",
     *   tags={"Photos"},
     *   summary="Delete photo",
     *   description="Deletes a space photo. Cannot delete primary if it's the last one.",
     *   operationId="spacePhotoDestroy",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Photo deleted successfully",
     *     )
     *   ),
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
     *   path="/api/v1/spaces/{uuid}/photos/reorder",
     *   tags={"Photos"},
     *   summary="Reorder photos",
     *   description="Updates the display order of photos.",
     *   operationId="spacePhotoReorder",
     *   security={{"sanctum": {}}},
     *     required=true,
     *     )
     *   ),
     *     response=200,
     *     description="Photos reordered",
     *     )
     *   ),
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
     *   path="/api/v1/spaces/{uuid}/photos/{photo_uuid}/set-primary",
     *   tags={"Photos"},
     *   summary="Set primary photo",
     *   description="Sets a photo as the primary image for the space.",
     *   operationId="spacePhotoSetPrimary",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Primary photo updated",
     *     )
     *   ),
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
