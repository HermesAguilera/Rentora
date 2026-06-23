<?php

namespace App\OpenApi\Schemas;

/**
 * @OA\Schema(
 *   schema="Review",
 *   properties={
 *     @OA\Property(property="uuid", type="string", format="uuid"),
 *     @OA\Property(property="reviewer", ref="#/components/schemas/User"),
 *     @OA\Property(property="rating", type="integer", example=5),
 *     @OA\Property(property="comment", type="string"),
 *     @OA\Property(property="reviewee_type", type="string", enum={"host", "renter"}),
 *     @OA\Property(property="created_at", type="string", example="Hace 2 días")
 *   }
 * )
 */
class ReviewSchema
{
}
