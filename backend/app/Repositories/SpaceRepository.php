<?php

namespace App\Repositories;

use App\Models\Space;
use App\Enums\SpaceStatus;
use Illuminate\Pagination\CursorPaginator;

class SpaceRepository
{
    public function searchSpaces(array $filters, int $perPage = 15): CursorPaginator
    {
        $query = Space::query()
            ->select([
                'id', 'uuid', 'host_id', 'title', 'type', 'price_per_month',
                'city', 'neighborhood', 'width_meters', 'depth_meters', 'height_meters', 'status',
                'created_at'
            ])
            ->where('status', SpaceStatus::ACTIVE)
            ->with([
                'host:id,uuid,first_name,last_name,avatar_path,created_at',
                'photos' => function ($q) {
                    $q->where('is_primary', true)->orWhere('order', 0)->limit(1);
                }
            ]);

        $query->when(isset($filters['type']), fn($q) => $q->where('type', $filters['type']))
              ->when(isset($filters['city']), fn($q) => $q->where('city', $filters['city']))
              ->when(isset($filters['neighborhood']), fn($q) => $q->where('neighborhood', $filters['neighborhood']))
              ->when(isset($filters['min_price']), fn($q) => $q->where('price_per_month', '>=', $filters['min_price']))
              ->when(isset($filters['max_price']), fn($q) => $q->where('price_per_month', '<=', $filters['max_price']))
              ->when(isset($filters['min_width']), fn($q) => $q->where('width_meters', '>=', $filters['min_width']))
              ->when(isset($filters['min_height']), fn($q) => $q->where('height_meters', '>=', $filters['min_height']))
              ->when(isset($filters['min_length']), fn($q) => $q->where('depth_meters', '>=', $filters['min_length']))
              ->when(isset($filters['amenities']), function ($q) use ($filters) {
                  // Assuming amenities is JSON column in spaces table
                  foreach ((array) $filters['amenities'] as $amenity) {
                      $q->whereJsonContains('amenities', $amenity);
                  }
              });

        $sort = $filters['sort'] ?? 'newest';
        
        match ($sort) {
            'price_asc' => $query->orderBy('price_per_month', 'asc')->orderBy('id', 'asc'),
            'price_desc' => $query->orderBy('price_per_month', 'desc')->orderBy('id', 'desc'),
            default => $query->orderBy('created_at', 'desc')->orderBy('id', 'desc'),
        };

        return $query->cursorPaginate($perPage);
    }
}
