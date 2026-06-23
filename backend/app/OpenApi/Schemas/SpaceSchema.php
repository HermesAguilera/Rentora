<?php

namespace App\OpenApi\Schemas;

/**
 * @OA\Schema(
 *   schema="Space",
 *   properties={
 *     @OA\Property(property="uuid", type="string", format="uuid"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="description", type="string"),
 *     @OA\Property(property="type", type="string", enum={"garage", "room", "warehouse", "other"}),
 *     @OA\Property(property="status", type="string", enum={"pending", "active", "paused", "rejected"}),
 *     @OA\Property(property="price_per_month", type="number", format="float"),
 *     @OA\Property(property="minimum_months", type="integer"),
 *     @OA\Property(property="width", type="number", format="float"),
 *     @OA\Property(property="height", type="number", format="float"),
 *     @OA\Property(property="depth", type="number", format="float"),
 *     @OA\Property(property="address", type="string"),
 *     @OA\Property(property="amenities", type="array", @OA\Items(type="string")),
 *     @OA\Property(property="primary_photo_url", type="string", format="uri", nullable=true),
 *     @OA\Property(property="average_rating", type="number", format="float"),
 *     @OA\Property(property="review_count", type="integer"),
 *     @OA\Property(property="is_complete", type="boolean"),
 *     @OA\Property(property="host", ref="#/components/schemas/User")
 *   }
 * )
 */
class SpaceSchema
{
}
