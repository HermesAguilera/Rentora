<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Space;
use App\Models\User;
use Carbon\Carbon;
use App\Enums\BookingStatus;

class BookingService
{
    public function createBooking(User $renter, Space $space, array $data): Booking
    {
        $pricing = $this->calculatePricing($space, $data['months_duration']);

        $booking = new Booking([
            'renter_id' => $renter->id,
            'host_id' => $space->host_id,
            'space_id' => $space->id,
            'start_date' => $data['start_date'],
            'months_duration' => $data['months_duration'],
            'end_date' => Carbon::parse($data['start_date'])->addMonths($data['months_duration']),
            'price_per_month' => $space->price_per_month,
            'total_amount' => $pricing['total'],
            'platform_fee_amount' => $pricing['fee'],
            'host_payout_amount' => $pricing['payout'],
            'status' => BookingStatus::PENDING,
        ]);
        
        $booking->save();

        return $booking;
    }

    public function checkAvailability(Space $space, Carbon $start, int $months): bool
    {
        $end = $start->copy()->addMonths($months);

        return !Booking::where('space_id', $space->id)
            ->whereIn('status', [BookingStatus::CONFIRMED->value, BookingStatus::ACTIVE->value])
            ->where(function ($query) use ($start, $end) {
                $query->whereBetween('start_date', [$start, $end])
                      ->orWhereBetween('end_date', [$start, $end])
                      ->orWhere(function ($q) use ($start, $end) {
                          $q->where('start_date', '<=', $start)
                            ->where('end_date', '>=', $end);
                      });
            })
            ->exists();
    }

    public function calculatePricing(Space $space, int $months): array
    {
        $total = $space->price_per_month * $months;
        $feePercentage = config('rentora.platform_fee_percentage', 10);
        $fee = $total * ($feePercentage / 100);
        $payout = $total - $fee;

        return [
            'total' => $total,
            'fee' => $fee,
            'payout' => $payout,
        ];
    }

    public function confirmBooking(Booking $booking, User $host): Booking
    {
        BookingStateMachine::transition($booking, BookingStatus::CONFIRMED);
        return $booking;
    }

    public function cancelBooking(Booking $booking, User $initiator, string $reason): Booking
    {
        $isRenter = $initiator->id === $booking->renter_id;
        $toStatus = $isRenter ? BookingStatus::CANCELLED_BY_RENTER : BookingStatus::CANCELLED_BY_HOST;

        $booking->cancellation_reason = $reason;
        BookingStateMachine::transition($booking, $toStatus);

        return $booking;
    }

    public function activateOverdueBookings(): void
    {
        Booking::where('status', BookingStatus::CONFIRMED->value)
            ->whereDate('start_date', '<=', Carbon::today())
            ->get()
            ->each(function ($booking) {
                BookingStateMachine::transition($booking, BookingStatus::ACTIVE);
            });
    }

    public function completeOverdueBookings(): void
    {
        Booking::where('status', BookingStatus::ACTIVE->value)
            ->whereDate('end_date', '<=', Carbon::today())
            ->get()
            ->each(function ($booking) {
                BookingStateMachine::transition($booking, BookingStatus::COMPLETED);
            });
    }
}
