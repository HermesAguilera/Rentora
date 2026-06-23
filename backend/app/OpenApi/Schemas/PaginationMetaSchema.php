<?php

namespace App\OpenApi\Schemas;

/**
 * @OA\Schema(
 *   schema="PaginationMeta",
 *   properties={
 *     @OA\Property(property="current_page", type="integer"),
 *     @OA\Property(property="last_page", type="integer"),
 *     @OA\Property(property="per_page", type="integer"),
 *     @OA\Property(property="total", type="integer"),
 *     @OA\Property(property="from", type="integer"),
 *     @OA\Property(property="to", type="integer")
 *   }
 * )
 */
class PaginationMetaSchema
{
}
