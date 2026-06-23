<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use OpenApi\Annotations as OA;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/v1/notifications",
     *   tags={"Notifications"},
     *   summary="List notifications",
     *   description="Returns the authenticated user's notifications. Pass ?unread=true to filter.",
     *   operationId="notificationIndex",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="unread", in="query", required=false, @OA\Schema(type="boolean")),
     *   @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer")),
     *   @OA\Response(
     *     response=200,
     *     description="List of notifications",
     *     @OA\JsonContent(
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Notification")),
     *       @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
     *       @OA\Property(property="links", ref="#/components/schemas/PaginationLinks")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index(Request $request)
    {
        $query = $request->user()->notifications();

        if ($request->has('unread')) {
            $query->whereNull('read_at');
        }

        return $query->paginate();
    }

    /**
     * @OA\Patch(
     *   path="/api/v1/notifications/{id}/read",
     *   tags={"Notifications"},
     *   summary="Mark notification as read",
     *   description="Marks a specific notification as read.",
     *   operationId="notificationMarkAsRead",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *   @OA\Response(
     *     response=200,
     *     description="Notification marked as read",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Marked as read")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['message' => 'Marked as read']);
    }

    /**
     * @OA\Patch(
     *   path="/api/v1/notifications/read-all",
     *   tags={"Notifications"},
     *   summary="Mark all as read",
     *   description="Marks all unread notifications as read for the authenticated user.",
     *   operationId="notificationMarkAllAsRead",
     *   security={{"sanctum": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="All notifications marked as read",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="All marked as read")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All marked as read']);
    }

    /**
     * @OA\Get(
     *   path="/api/v1/notifications/unread-count",
     *   tags={"Notifications"},
     *   summary="Get unread count",
     *   description="Returns the total number of unread notifications for the user.",
     *   operationId="notificationUnreadCount",
     *   security={{"sanctum": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="Unread count",
     *     @OA\JsonContent(
     *       @OA\Property(property="count", type="integer", example=3)
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function unreadCount(Request $request)
    {
        $count = \Illuminate\Support\Facades\Cache::remember(
            'user.'.$request->user()->id.'.unread_notifications',
            60,
            fn () => $request->user()->unreadNotifications()->count()
        );

        return response()->json(['count' => $count]);
    }
}
