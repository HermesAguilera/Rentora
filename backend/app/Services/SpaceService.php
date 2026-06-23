<?php

namespace App\Services;

use App\Models\Space;
use App\Models\User;
use App\Enums\SpaceStatus;
use App\Events\SpaceSubmittedForReview;
use Illuminate\Support\Facades\Redis;
use Carbon\Carbon;
use Exception;

class SpaceService extends BaseService
{
    public function createSpace(User $host, array $data): Space
    {
        $data['host_id'] = $host->id;
        $data['status'] = SpaceStatus::DRAFT;
        
        return Space::create($data);
    }

    public function updateSpace(Space $space, array $data): Space
    {
        if ($space->status === SpaceStatus::ACTIVE) {
            $sensitiveChanges = array_intersect_key($data, array_flip(['price_per_month', 'address', 'city', 'neighborhood']));
            if (!empty($sensitiveChanges)) {
                $data['status'] = SpaceStatus::PENDING_REVIEW;
            }
        }

        $space->update($data);
        return $space;
    }

    public function publishSpace(Space $space): Space
    {
        $required = ['title', 'description', 'price_per_month', 'address', 'type'];
        
        foreach ($required as $field) {
            if (empty($space->$field)) {
                throw new Exception("El campo {$field} es obligatorio para publicar.");
            }
        }

        if ($space->photos()->count() < 5) {
            throw new Exception("Se requieren al menos 5 fotos para publicar.");
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
        $redisCount = (int) Redis::get("space:{$space->uuid}:views");
        return $space->view_count + $redisCount;
    }

    public function incrementViewCount(Space $space): void
    {
        Redis::incr("space:{$space->uuid}:views");
    }
}
