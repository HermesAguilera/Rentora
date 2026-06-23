<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class SpacePrivateResource extends SpaceResource
{
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        
        // Ensure owner specific fields are there
        $data['address'] = $this->address;
        $data['is_complete'] = $this->isComplete();
        $data['view_count'] = app(\App\Services\SpaceService::class)->getViewCount($this->resource);
        
        return $data;
    }
}
