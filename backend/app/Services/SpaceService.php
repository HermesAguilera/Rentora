<?php

namespace App\Services;

use App\Models\Space;
use App\Models\User;
use App\Enums\SpaceStatus;
use App\Events\SpaceSubmittedForReview;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use Exception;

class SpaceService
{
    public function createSpace(User $host, array $data): Space
    {
        $data['host_id'] = $host->id;
        $data['status'] = SpaceStatus::DRAFT;
        
        if (isset($data['address'])) {
            $data['address_line'] = $data['address'];
            unset($data['address']);
        }
        
        return Space::create($data);
    }

    public function updateSpace(Space $space, array $data): Space
    {
        if (isset($data['address'])) {
            $data['address_line'] = $data['address'];
            unset($data['address']);
        }

        if ($space->status === SpaceStatus::ACTIVE) {
            $sensitiveChanges = array_intersect_key($data, array_flip(['price_per_month', 'address_line', 'city', 'neighborhood']));
            if (!empty($sensitiveChanges)) {
                $data['status'] = SpaceStatus::PENDING_REVIEW;
            }
        }

        $space->update($data);
        return $space;
    }

    public function publishSpace(Space $space): Space
    {
        $required = ['title', 'description', 'price_per_month', 'address_line', 'type'];
        
        foreach ($required as $field) {
            if (empty($space->$field)) {
                $friendlyName = $field === 'address_line' ? 'address' : $field;
                throw new Exception("El campo {$friendlyName} es obligatorio para publicar.");
            }
        }

        $space->update(['status' => SpaceStatus::PENDING_REVIEW]);
        
        event(new SpaceSubmittedForReview($space));

        return $space;
    }

    public function calculateAvailability(Space $space, Carbon $from, Carbon $to): array
    {
        $bookings = $space->bookings()
            ->whereIn('status', ['confirmed', 'active'])
            ->where(function ($q) use ($from, $to) {
                $q->whereBetween('start_date', [$from, $to])
                  ->orWhereBetween('end_date', [$from, $to])
                  ->orWhere(function ($q2) use ($from, $to) {
                      $q2->where('start_date', '<=', $from)
                         ->where('end_date', '>=', $to);
                  });
            })
            ->get(['start_date', 'end_date']);

        return $bookings->map(function ($booking) {
            return [
                'start' => $booking->start_date->toDateString(),
                'end' => $booking->end_date->toDateString(),
            ];
        })->toArray();
    }

    public function getViewCount(Space $space): int
    {
        $cacheCount = (int) Cache::get("space:{$space->uuid}:views", 0);
        return $space->view_count + $cacheCount;
    }

    public function incrementViewCount(Space $space): void
    {
        Cache::increment("space:{$space->uuid}:views");
    }
}
