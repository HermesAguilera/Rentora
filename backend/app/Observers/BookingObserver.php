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
        $feePercentage = (float) config('rentora.platform_fee_percentage');

        // Calculate totals based on snapshot price
        $booking->total_amount = $booking->price_per_month * $booking->months_duration;
        $booking->platform_fee_amount = round($booking->total_amount * ($feePercentage / 100), 2);
        $booking->host_payout_amount = $booking->total_amount - $booking->platform_fee_amount;
    }

    /** Avisa al anfitrión que tiene una solicitud nueva por revisar. */
    public function created(Booking $booking): void
    {
        if ($booking->status !== \App\Enums\BookingStatus::PENDING) {
            return;
        }

        $booking->loadMissing(['space', 'renter', 'host']);

        $booking->host?->notify(new \App\Notifications\BookingStatusNotification(
            $booking,
            'Nueva solicitud de reserva',
            "{$booking->renter?->full_name} quiere alquilar {$booking->space?->title} por {$booking->months_duration} mes(es).",
            // El anfitrión acepta o rechaza desde su panel.
            '/dashboard',
        ));
    }
}
