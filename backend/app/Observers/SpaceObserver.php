<?php

namespace App\Observers;

use App\Models\Space;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SpaceObserver
{
    /**
     * Handle the Space "creating" event.
     */
    public function creating(Space $space): void
    {
        if (empty($space->host_id) && Auth::check()) {
            $space->host_id = Auth::id();
        }
    }

    /**
     * Handle the Space "updated" event.
     */
    public function updated(Space $space): void
    {
        if ($space->isDirty('status')) {
            // Placeholder: Notify admin about status change
            // In a real app, dispatch a notification to admin users
            Log::info("Space {$space->id} status changed to {$space->status->value}");
        }
    }
}
