<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use App\Models\User;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    public function actingAsRenter(): User
    {
        $user = User::factory()->create(['role' => 'renter']);
        $this->actingAs($user);
        return $user;
    }

    public function actingAsHost(): User
    {
        $user = User::factory()->create(['role' => 'host']);
        $this->actingAs($user);
        return $user;
    }

    public function actingAsAdmin(): User
    {
        $user = User::factory()->create(['role' => 'admin']);
        $this->actingAs($user);
        return $user;
    }
}
