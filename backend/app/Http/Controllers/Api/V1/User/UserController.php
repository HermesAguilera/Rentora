<?php

namespace App\Http\Controllers\Api\V1\User;

use Illuminate\Routing\Controller;
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
     *   path="/api/v1/users/me",
     *   tags={"Users"},
     *   summary="Get current user profile",
     *   description="Returns the authenticated user's private profile.",
     *   operationId="userMe",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Successful response",
     *     )
     *   ),
     * )
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserPrivateResource($request->user())
        ]);
    }

    /**
     *   path="/api/v1/users/me",
     *   tags={"Users"},
     *   summary="Update profile",
     *   description="Updates the authenticated user's profile.",
     *   operationId="userUpdateProfile",
     *   security={{"sanctum": {}}},
     *     required=true,
     *     )
     *   ),
     *     response=200,
     *     description="Profile updated",
     *     )
     *   ),
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
     *   path="/api/v1/users/me/avatar",
     *   tags={"Users"},
     *   summary="Upload avatar",
     *   description="Uploads a new avatar image for the user.",
     *   operationId="userUploadAvatar",
     *   security={{"sanctum": {}}},
     *     required=true,
     *       mediaType="multipart/form-data",
     *       )
     *     )
     *   ),
     *     response=200,
     *     description="Avatar updated",
     *     )
     *   ),
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
     *   path="/api/v1/users/{uuid}",
     *   tags={"Users"},
     *   summary="Get public user profile",
     *   description="Returns the public profile of a user by UUID.",
     *   operationId="userShow",
     *     response=200,
     *     description="Successful response",
     *     )
     *   ),
     * )
     */
    public function show(User $user): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($user)
        ]);
    }

    /**
     *   path="/api/v1/users/me/stats",
     *   tags={"Users"},
     *   summary="Get user stats",
     *   description="Returns statistics for the authenticated user (e.g. host stats, renter stats).",
     *   operationId="userStats",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Successful response",
     *     )
     *   ),
     * )
     */
    public function stats(Request $request): JsonResponse
    {
        $stats = $this->userService->getStats($request->user());
        return response()->json(['data' => $stats]);
    }
}
