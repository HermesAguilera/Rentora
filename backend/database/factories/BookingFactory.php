<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Space;
use App\Models\User;
use App\Enums\BookingStatus;
use Illuminate\Support\Carbon;

class BookingFactory extends Factory
{
    public function definition(): array
    {
        $months = fake()->numberBetween(1, 6);
        $startDate = Carbon::instance(fake()->dateTimeBetween('+1 week', '+1 month'));
        
        return [
            'space_id' => Space::factory(),
            'renter_id' => User::factory(),
            'host_id' => User::factory()->host(),
            'status' => BookingStatus::CONFIRMED,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $startDate->copy()->addMonths($months)->format('Y-m-d'),
            'months_duration' => $months,
            'price_per_month' => fake()->randomFloat(2, 500, 5000),
            // total_amount, platform_fee_amount, and host_payout_amount 
            // will be automatically calculated by the BookingObserver.
            'total_amount' => 0,
            'platform_fee_amount' => 0,
            'host_payout_amount' => 0,
            'confirmed_at' => now(),
        ];
    }
}
