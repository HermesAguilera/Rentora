<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class SpacePublicResource extends SpaceResource
{
    public function toArray(Request $request): array
    {
        // Public resource doesn't show exact address and some host-only stats
        $data = parent::toArray($request);
        unset($data['address'], $data['is_complete'], $data['view_count']);
        
        return $data;
    }
}
