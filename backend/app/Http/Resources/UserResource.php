<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid, // Always expose uuid, never id
            'name' => $this->full_name,
            'avatar_url' => $this->avatar_path ? \Illuminate\Support\Facades\Storage::disk('s3')->url($this->avatar_path) : null,
            'role' => $this->role?->value,
            'rating' => $this->average_rating ?? 0.0,
            'member_since' => $this->created_at?->diffForHumans(),
            'is_verified' => (bool) ($this->email_verified_at && $this->phone_verified_at && $this->identity_verified_at),
        ];
    }
}
