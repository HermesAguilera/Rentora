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
            'created_at' => $this->created_at,
        ];
    }
}
