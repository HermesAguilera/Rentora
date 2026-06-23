<?php

namespace App\Exceptions;

use Exception;
use App\Enums\BookingStatus;

class InvalidBookingTransitionException extends Exception
{
    public static function make(BookingStatus $from, BookingStatus $to): self
    {
        return new self("Cannot transition booking from {$from->value} to {$to->value}");
    }
}
