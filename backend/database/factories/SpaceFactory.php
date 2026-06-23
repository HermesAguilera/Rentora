<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Enums\SpaceType;
use App\Enums\SpaceStatus;

class SpaceFactory extends Factory
{
    public function definition(): array
    {
        $allAmenities = ['electricity', 'water_access', '24h_access', 'security_camera', 'covered'];
        
        return [
            'host_id' => User::factory()->host(),
            'title' => fake('es_HN')->words(3, true),
            'description' => fake('es_HN')->paragraph(),
            'type' => fake()->randomElement(SpaceType::cases()),
            'status' => SpaceStatus::ACTIVE,
            'price_per_month' => fake()->randomFloat(2, 500, 5000),
            'minimum_months' => 1,
            'address_line' => fake('es_HN')->streetAddress(),
            'neighborhood' => fake('es_HN')->streetName(),
            'city' => 'Tegucigalpa',
            'department' => 'Francisco Morazán',
            'country' => 'HN',
            'latitude' => fake()->latitude(13.9, 14.2),
            'longitude' => fake()->longitude(-87.3, -87.1),
            'amenities' => fake()->randomElements($allAmenities, fake()->numberBetween(1, 4)),
            'published_at' => now(),
        ];
    }
}
