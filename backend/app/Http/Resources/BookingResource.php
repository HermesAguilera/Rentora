<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'space' => new SpacePublicResource($this->whenLoaded('space')),
            'renter' => new UserResource($this->whenLoaded('renter')),
            'host' => new UserResource($this->whenLoaded('host')),
            'status' => $this->status->value,
            'start_date' => $this->start_date->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'months_duration' => $this->months_duration,
            'total_amount' => (float) $this->total_amount,
            'platform_fee_amount' => (float) $this->platform_fee_amount,
            // Se calcula del monto real de la reserva, no de la config: una reserva
            // creada con otra tarifa debe seguir mostrando la que se le aplicó.
            'platform_fee_percentage' => $this->total_amount > 0
                ? round($this->platform_fee_amount / $this->total_amount * 100, 2)
                : (float) config('rentora.platform_fee_percentage'),
            'host_payout_amount' => (float) $this->host_payout_amount,
            'payment_confirmed_at' => $this->payment_confirmed_at,
            'created_at' => $this->created_at,
        ];
    }
}
