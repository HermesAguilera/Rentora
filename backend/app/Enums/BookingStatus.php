<?php

namespace App\Enums;

enum BookingStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case ACTIVE = 'active';
    case COMPLETED = 'completed';
    case DISPUTED = 'disputed';
    case CANCELLED_BY_RENTER = 'cancelled_by_renter';
    case CANCELLED_BY_HOST = 'cancelled_by_host';
}
