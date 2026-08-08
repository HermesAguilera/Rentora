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
            'order' => (int) $this->order,
            'url' => $this->path ? Storage::disk('public')->url($this->path) : null,
        ];
    }
}
