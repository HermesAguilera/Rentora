<?php

namespace App\OpenApi\Schemas;

/**
 * @OA\Schema(
 *   schema="SpacePhoto",
 *   properties={
 *     @OA\Property(property="uuid", type="string", format="uuid"),
 *     @OA\Property(property="path", type="string"),
 *     @OA\Property(property="order", type="integer"),
 *     @OA\Property(property="is_primary", type="boolean"),
 *     @OA\Property(property="processing", type="boolean"),
 *     @OA\Property(property="thumbnail_url", type="string", format="uri"),
 *     @OA\Property(property="medium_url", type="string", format="uri"),
 *     @OA\Property(property="large_url", type="string", format="uri")
 *   }
 * )
 */
class SpacePhotoSchema
{
}
