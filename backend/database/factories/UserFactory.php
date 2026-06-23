<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Enums\UserRole;
use App\Enums\UserStatus;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'first_name' => fake('es_HN')->firstName(),
            'last_name' => fake('es_HN')->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => '+504 ' . fake()->numerify('####-####'),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => UserRole::RENTER,
            'status' => UserStatus::ACTIVE,
            'remember_token' => Str::random(10),
        ];
    }

    public function host(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::HOST,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::ADMIN,
        ]);
    }
}
