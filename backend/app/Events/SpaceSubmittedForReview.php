<?php

namespace App\Events;

use App\Models\Space;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SpaceSubmittedForReview
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Space $space)
    {
    }
}
