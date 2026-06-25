<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpaceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isOwner = $request->user() && $request->user()->id === $this->host_id;

        $data = [
            'id' => $this->uuid,
            'title' => $this->title,
            'type' => $this->type,
            'city' => $this->city,
            'neighborhood' => $this->neighborhood,
            'price_per_month' => (float) $this->price_per_month,
            'size_description' => $this->getSizeDescription(),
            'amenities' => $this->amenities ?? [],
            'status' => $this->status?->value,
            'average_rating' => (float) $this->average_rating,
            'review_count' => (int) $this->review_count,
            'primary_photo_url' => $this->getPrimaryPhotoUrl(),
            'host' => new UserResource($this->whenLoaded('host')),
            'photos' => SpacePhotoResource::collection($this->whenLoaded('photos')->sortBy('order')),
        ];

        if ($isOwner) {
            $data['address'] = $this->address_line;
            $data['is_complete'] = $this->isComplete();
            $data['view_count'] = $this->view_count;
        }

        return $data;
    }

    protected function getSizeDescription(): ?string
    {
        if ($this->width_meters && $this->depth_meters && $this->height_meters) {
            return "{$this->width_meters}m × {$this->depth_meters}m × {$this->height_meters}m";
        }
        return null;
    }

    protected function getPrimaryPhotoUrl(): ?string
    {
        $primary = $this->photos->firstWhere('is_primary', true) ?? $this->photos->first();
        if ($primary && $primary->medium_path) {
            return \Illuminate\Support\Facades\Storage::disk('s3')->url($primary->medium_path);
        }
        return null;
    }

    protected function isComplete(): bool
    {
        $required = ['title', 'description', 'price_per_month', 'address_line', 'type'];
        foreach ($required as $field) {
            if (empty($this->$field)) {
                return false;
            }
        }
        return $this->photos->count() >= 5;
    }
}
