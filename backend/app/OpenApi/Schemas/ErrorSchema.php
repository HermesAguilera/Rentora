<?php

namespace App\OpenApi\Schemas;

/**
 * @OA\Schema(
 *   schema="Error",
 *   properties={
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Validation error"),
 *     @OA\Property(property="errors", type="object", nullable=true)
 *   }
 * )
 */
class ErrorSchema
{
}
