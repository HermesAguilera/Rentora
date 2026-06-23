<?php

namespace App\OpenApi\Schemas;

/**
 * @OA\Schema(
 *   schema="Booking",
 *   properties={
 *     @OA\Property(property="uuid", type="string", format="uuid"),
 *     @OA\Property(property="space", ref="#/components/schemas/Space"),
 *     @OA\Property(property="renter", ref="#/components/schemas/User"),
 *     @OA\Property(property="host", ref="#/components/schemas/User"),
 *     @OA\Property(property="status", type="string", enum={"pending", "confirmed", "paid", "active", "completed", "cancelled", "disputed"}),
 *     @OA\Property(property="start_date", type="string", format="date"),
 *     @OA\Property(property="end_date", type="string", format="date"),
 *     @OA\Property(property="months_duration", type="integer"),
 *     @OA\Property(property="price_per_month", type="number", format="float"),
 *     @OA\Property(property="total_amount", type="number", format="float"),
 *     @OA\Property(property="platform_fee_amount", type="number", format="float"),
 *     @OA\Property(property="host_payout_amount", type="number", format="float"),
 *     @OA\Property(property="cancellation_reason", type="string", nullable=true),
 *     @OA\Property(property="confirmed_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="cancelled_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="completed_at", type="string", format="date-time", nullable=true)
 *   }
 * )
 */
class BookingSchema
{
}
