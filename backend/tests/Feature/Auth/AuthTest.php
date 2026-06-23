<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can register with valid data', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'role' => 'renter',
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['access_token', 'user']);
});

test('registration fails with invalid email', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'not-an-email',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'role' => 'renter',
    ]);

    $response->assertStatus(422)
             ->assertJsonValidationErrors('email');
});

test('registration fails with weak password', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com',
        'password' => 'weak',
        'password_confirmation' => 'weak',
        'role' => 'renter',
    ]);

    $response->assertStatus(422)
             ->assertJsonValidationErrors('password');
});

test('user can login with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => bcrypt('Password123!'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'john@example.com',
        'password' => 'Password123!',
    ]);

    $response->assertStatus(200)
             ->assertJsonStructure(['access_token', 'user']);
});

test('login fails with wrong password', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => bcrypt('Password123!'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'john@example.com',
        'password' => 'WrongPassword!',
    ]);

    $response->assertStatus(401);
});

test('login fails with correct credentials but suspended account', function () {
    $user = User::factory()->create([
        'email' => 'suspended@example.com',
        'password' => bcrypt('Password123!'),
        'status' => 'suspended',
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'suspended@example.com',
        'password' => 'Password123!',
    ]);

    // Usually login succeeds but middleware blocks, or login throws 403
    $response->assertStatus(403);
});

test('user can logout', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->postJson('/api/v1/auth/logout');

    $response->assertStatus(200);
});

test('throttle kicks in after 5 failed login attempts', function () {
    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrong',
        ]);
    }

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'test@example.com',
        'password' => 'wrong',
    ]);

    $response->assertStatus(429);
});
