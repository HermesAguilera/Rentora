<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Exceptions\InvalidBookingTransitionException;
use App\Events\BookingStatusChanged;
use App\Models\Booking;

class BookingStateMachine
{
    public static function canTransition(BookingStatus $from, BookingStatus $to): bool
    {
        $allowedTransitions = [
            BookingStatus::PENDING->value => [
                BookingStatus::CONFIRMED->value,
                BookingStatus::CANCELLED_BY_RENTER->value,
                BookingStatus::CANCELLED_BY_HOST->value,
            ],
            BookingStatus::CONFIRMED->value => [
                BookingStatus::ACTIVE->value,
                BookingStatus::CANCELLED_BY_RENTER->value,
                BookingStatus::CANCELLED_BY_HOST->value,
            ],
            BookingStatus::ACTIVE->value => [
                BookingStatus::COMPLETED->value,
                BookingStatus::DISPUTED->value,
                BookingStatus::CANCELLED_BY_RENTER->value,
                BookingStatus::CANCELLED_BY_HOST->value,
            ],
        ];

        return in_array($to->value, $allowedTransitions[$from->value] ?? []);
    }

    public static function transition(Booking $booking, BookingStatus $to): void
    {
        if (!self::canTransition($booking->status, $to)) {
            throw InvalidBookingTransitionException::make($booking->status, $to);
        }

        $oldStatus = $booking->status;
        $booking->status = $to;
        $booking->save();

        event(new BookingStatusChanged($booking, $oldStatus, $to));
    }
}
