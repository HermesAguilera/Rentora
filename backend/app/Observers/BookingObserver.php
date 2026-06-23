<?php

namespace App\Observers;

use App\Models\Booking;

class BookingObserver
{
    /**
     * Handle the Booking "creating" event.
     */
    public function creating(Booking $booking): void
    {
        // 10% platform fee
        $platformFeePercentage = 0.10;
        
        // Calculate totals based on snapshot price
        $booking->total_amount = $booking->price_per_month * $booking->months_duration;
        $booking->platform_fee_amount = $booking->total_amount * $platformFeePercentage;
        $booking->host_payout_amount = $booking->total_amount - $booking->platform_fee_amount;
    }
}
