<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BookingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, Booking $booking): bool
    {
        return $user->id === $booking->renter_id || $user->id === $booking->host_id;
    }

    public function confirm(User $user, Booking $booking): bool
    {
        \Illuminate\Support\Facades\Log::info('--- AUTHORIZATION DEBUG ---');
        \Illuminate\Support\Facades\Log::info('Logged in User ID: ' . $user->id);
        \Illuminate\Support\Facades\Log::info('Booking Host ID: ' . $booking->host_id);
        \Illuminate\Support\Facades\Log::info('Match: ' . ($user->id == $booking->host_id ? 'YES' : 'NO'));
        
        return (int)$user->id === (int)$booking->host_id;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return $user->id === $booking->renter_id || $user->id === $booking->host_id;
    }

    public function complete(User $user, Booking $booking): bool
    {
        return $user->id === $booking->host_id;
    }

    public function dispute(User $user, Booking $booking): bool
    {
        return $user->id === $booking->renter_id;
    }
}
