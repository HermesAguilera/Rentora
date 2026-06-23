<?php

namespace App\OpenApi\Schemas;

/**
 * @OA\Schema(
 *   schema="User",
 *   properties={
 *     @OA\Property(property="uuid", type="string", format="uuid", example="550e8400-e29b-41d4-a716-446655440000"),
 *     @OA\Property(property="first_name", type="string", example="Carlos"),
 *     @OA\Property(property="last_name", type="string", example="Mejía"),
 *     @OA\Property(property="full_name", type="string", example="Carlos Mejía"),
 *     @OA\Property(property="email", type="string", format="email", example="carlos@ejemplo.hn"),
 *     @OA\Property(property="phone", type="string", nullable=true, example="+50498765432"),
 *     @OA\Property(property="role", type="string", enum={"renter","host","both","admin"}),
 *     @OA\Property(property="status", type="string", enum={"pending_verification","active","suspended","banned"}),
 *     @OA\Property(property="is_verified", type="boolean", description="True when email + phone + identity are all verified"),
 *     @OA\Property(property="average_rating", type="number", format="float", nullable=true, example=4.7),
 *     @OA\Property(property="member_since", type="string", example="Junio 2025"),
 *     @OA\Property(property="avatar_url", type="string", format="uri", nullable=true)
 *   }
 * )
 */
class UserSchema
{
}
