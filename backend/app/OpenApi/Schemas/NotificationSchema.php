<?php

namespace App\OpenApi\Schemas;

/**
 * @OA\Schema(
 *   schema="Notification",
 *   properties={
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="type", type="string"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="body", type="string"),
 *     @OA\Property(property="action_url", type="string", format="uri", nullable=true),
 *     @OA\Property(property="action_label", type="string", nullable=true),
 *     @OA\Property(property="read_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time")
 *   }
 * )
 */
class NotificationSchema
{
}
