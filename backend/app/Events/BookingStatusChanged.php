<?php

namespace App\Events;

use App\Models\Booking;
use App\Enums\BookingStatus;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingStatusChanged
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Booking $booking,
        public BookingStatus $oldStatus,
        public BookingStatus $newStatus
    ) {}
}
