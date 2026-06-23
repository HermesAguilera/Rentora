<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Space;

class SpacePhotoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'space_id' => Space::factory(),
            'path' => 'spaces/' . fake()->uuid() . '.jpg',
            'order' => fake()->numberBetween(0, 5),
            'is_primary' => false,
        ];
    }
}
