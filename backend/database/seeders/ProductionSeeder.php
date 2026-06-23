<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Support\Facades\Hash;

class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        // Safe to run in production: only creates the main admin user if not exists
        User::firstOrCreate(
            ['email' => 'admin@rentora.com'],
            [
                'first_name' => 'Admin',
                'last_name' => 'Rentora',
                'password' => Hash::make('rentora_secure_password_123!'),
                'role' => UserRole::ADMIN,
                'status' => UserStatus::ACTIVE,
                'email_verified_at' => now(),
            ]
        );
    }
}
