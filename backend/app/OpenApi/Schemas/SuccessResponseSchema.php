<?php

namespace App\OpenApi\Schemas;

/**
 * @OA\Schema(
 *   schema="SuccessResponse",
 *   properties={
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string"),
 *     @OA\Property(property="data", type="object")
 *   }
 * )
 */
class SuccessResponseSchema
{
}
