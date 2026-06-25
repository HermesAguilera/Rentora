<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     *   path="/api/v1/notifications",
     *   tags={"Notifications"},
     *   summary="List notifications",
     *   description="Returns the authenticated user's notifications. Pass ?unread=true to filter.",
     *   operationId="notificationIndex",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="List of notifications",
     *     )
     *   ),
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
     *   path="/api/v1/notifications/{id}/read",
     *   tags={"Notifications"},
     *   summary="Mark notification as read",
     *   description="Marks a specific notification as read.",
     *   operationId="notificationMarkAsRead",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Notification marked as read",
     *     )
     *   ),
     * )
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['message' => 'Marked as read']);
    }

    /**
     *   path="/api/v1/notifications/read-all",
     *   tags={"Notifications"},
     *   summary="Mark all as read",
     *   description="Marks all unread notifications as read for the authenticated user.",
     *   operationId="notificationMarkAllAsRead",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="All notifications marked as read",
     *     )
     *   ),
     * )
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All marked as read']);
    }

    /**
     *   path="/api/v1/notifications/unread-count",
     *   tags={"Notifications"},
     *   summary="Get unread count",
     *   description="Returns the total number of unread notifications for the user.",
     *   operationId="notificationUnreadCount",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Unread count",
     *     )
     *   ),
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
