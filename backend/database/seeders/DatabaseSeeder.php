<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Space;
use App\Models\SpacePhoto;
use App\Models\Booking;
use App\Models\Review;
use App\Enums\UserRole;
use App\Enums\BookingStatus;
use App\Enums\RevieweeType;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1 Admin
        User::factory()->admin()->create([
            'first_name' => 'Admin',
            'last_name' => 'Rentora',
            'email' => 'admin@rentora.com',
        ]);

        // 5 Hosts
        $hosts = User::factory(5)->host()->create();

        // 10 Renters
        $renters = User::factory(10)->create([
            'role' => UserRole::RENTER,
        ]);

        // 2-4 Spaces per Host
        foreach ($hosts as $host) {
            $spaces = Space::factory(rand(2, 4))->create([
                'host_id' => $host->id,
            ]);

            // Add Photos for each space
            foreach ($spaces as $space) {
                SpacePhoto::factory()->create([
                    'space_id' => $space->id,
                    'is_primary' => true,
                    'order' => 0,
                ]);
                SpacePhoto::factory(rand(1, 3))->create([
                    'space_id' => $space->id,
                    'is_primary' => false,
                ]);
            }
        }

        // Create bookings
        $spaces = Space::all();

        foreach ($renters as $renter) {
            // Give each renter 1-2 bookings
            for ($i = 0; $i < rand(1, 2); $i++) {
                $space = $spaces->random();
                $isCompleted = fake()->boolean(40); // 40% chance of being completed
                
                $booking = Booking::factory()->create([
                    'space_id' => $space->id,
                    'host_id' => $space->host_id,
                    'renter_id' => $renter->id,
                    'price_per_month' => $space->price_per_month,
                    'status' => $isCompleted ? BookingStatus::COMPLETED : BookingStatus::ACTIVE,
                ]);

                // Create reviews for completed bookings
                if ($isCompleted) {
                    // Renter reviews Host
                    Review::factory()->create([
                        'booking_id' => $booking->id,
                        'reviewer_id' => $renter->id,
                        'reviewee_id' => $space->host_id,
                        'reviewee_type' => RevieweeType::HOST,
                    ]);

                    // Host reviews Renter
                    Review::factory()->create([
                        'booking_id' => $booking->id,
                        'reviewer_id' => $space->host_id,
                        'reviewee_id' => $renter->id,
                        'reviewee_type' => RevieweeType::RENTER,
                    ]);
                }
            }
        }
    }
}
