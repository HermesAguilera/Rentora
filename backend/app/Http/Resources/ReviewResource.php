<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'rating' => (int) $this->rating,
            'comment' => $this->comment,
            'reviewee_type' => $this->reviewee_type?->value,
            'is_visible' => (bool) $this->is_visible,
            'reviewer' => new UserResource($this->whenLoaded('reviewer')),
            'created_at' => $this->created_at,
        ];
    }
}
