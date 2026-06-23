<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SpacePhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'is_primary' => (bool) $this->is_primary,
            'order' => $this->order,
            'processing' => (bool) $this->processing,
            'failed' => (bool) $this->failed,
            'urls' => [
                'large' => $this->large_path ? Storage::disk('s3')->url($this->large_path) : null,
                'medium' => $this->medium_path ? Storage::disk('s3')->url($this->medium_path) : null,
                'thumbnail' => $this->thumbnail_path ? Storage::disk('s3')->url($this->thumbnail_path) : null,
            ],
        ];
    }
}
