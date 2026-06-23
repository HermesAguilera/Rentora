<?php

namespace App\Http\Controllers\Api\V1\User;

use Illuminate\Routing\Controller;
use OpenApi\Annotations as OA;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Requests\User\UploadAvatarRequest;
use App\Services\UserService;
use App\Http\Resources\UserPrivateResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(private UserService $userService)
    {
    }

    /**
     * @OA\Get(
     *   path="/api/v1/users/me",
     *   tags={"Users"},
     *   summary="Get current user profile",
     *   description="Returns the authenticated user's private profile.",
     *   operationId="userMe",
     *   security={{"sanctum": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="Successful response",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", ref="#/components/schemas/User")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserPrivateResource($request->user())
        ]);
    }

    /**
     * @OA\Patch(
     *   path="/api/v1/users/me",
     *   tags={"Users"},
     *   summary="Update profile",
     *   description="Updates the authenticated user's profile.",
     *   operationId="userUpdateProfile",
     *   security={{"sanctum": {}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       @OA\Property(property="first_name", type="string", maxLength=50, example="Carlos"),
     *       @OA\Property(property="last_name", type="string", maxLength=50, example="Mejía"),
     *       @OA\Property(property="phone", type="string", nullable=true, example="+50412345678")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Profile updated",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Perfil actualizado exitosamente."),
     *       @OA\Property(property="data", ref="#/components/schemas/User")
     *     )
     *   ),
     *   @OA\Response(response=400, description="Bad Request"),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->updateProfile($request->user(), $request->validated());
            return response()->json([
                'message' => 'Perfil actualizado exitosamente.',
                'data' => new UserPrivateResource($user)
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    /**
     * @OA\Post(
     *   path="/api/v1/users/me/avatar",
     *   tags={"Users"},
     *   summary="Upload avatar",
     *   description="Uploads a new avatar image for the user.",
     *   operationId="userUploadAvatar",
     *   security={{"sanctum": {}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *       @OA\Schema(
     *         @OA\Property(property="avatar", type="string", format="binary")
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Avatar updated",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Avatar actualizado exitosamente."),
     *       @OA\Property(property="avatar_url", type="string", format="uri"),
     *       @OA\Property(property="data", ref="#/components/schemas/User")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error")),
     *   @OA\Response(response=429, description="Too many requests")
     * )
     */
    public function uploadAvatar(UploadAvatarRequest $request): JsonResponse
    {
        $url = $this->userService->uploadAvatar($request->user(), $request->file('avatar'));
        
        return response()->json([
            'message' => 'Avatar actualizado exitosamente.',
            'avatar_url' => $url,
            'data' => new UserPrivateResource($request->user()->refresh())
        ]);
    }

    /**
     * @OA\Get(
     *   path="/api/v1/users/{uuid}",
     *   tags={"Users"},
     *   summary="Get public user profile",
     *   description="Returns the public profile of a user by UUID.",
     *   operationId="userShow",
     *   @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Successful response",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", ref="#/components/schemas/User")
     *     )
     *   ),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function show(User $user): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($user)
        ]);
    }

    /**
     * @OA\Get(
     *   path="/api/v1/users/me/stats",
     *   tags={"Users"},
     *   summary="Get user stats",
     *   description="Returns statistics for the authenticated user (e.g. host stats, renter stats).",
     *   operationId="userStats",
     *   security={{"sanctum": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="Successful response",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", type="object")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function stats(Request $request): JsonResponse
    {
        $stats = $this->userService->getStats($request->user());
        return response()->json(['data' => $stats]);
    }
}
