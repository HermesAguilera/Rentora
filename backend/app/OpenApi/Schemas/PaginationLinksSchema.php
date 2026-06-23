<?php

namespace App\OpenApi\Schemas;

/**
 * @OA\Schema(
 *   schema="PaginationLinks",
 *   properties={
 *     @OA\Property(property="first", type="string", format="uri"),
 *     @OA\Property(property="last", type="string", format="uri"),
 *     @OA\Property(property="prev", type="string", format="uri", nullable=true),
 *     @OA\Property(property="next", type="string", format="uri", nullable=true)
 *   }
 * )
 */
class PaginationLinksSchema
{
}
