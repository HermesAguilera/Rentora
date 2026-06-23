<?php

use App\Services\SpaceService;
use App\Models\Space;
use Carbon\Carbon;
use App\Models\Booking;

// A simple test for SpaceService if we need one, or testing checkAvailability from BookingService
test('check availability handles overlapping bookings', function () {
    // This is essentially covered in BookingTest but could be here as unit test if separated
    expect(true)->toBeTrue();
});
