<?php

use App\Models\Space;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Redis;

uses(RefreshDatabase::class);

test('guest can browse active spaces', function () {
    Space::factory()->count(3)->create(['status' => 'active']);
    
    $response = $this->getJson('/api/v1/spaces');

    $response->assertStatus(200)
             ->assertJsonCount(3, 'data');
});

test('guest cannot see draft/paused spaces in listing', function () {
    Space::factory()->create(['status' => 'active']);
    Space::factory()->create(['status' => 'draft']);
    Space::factory()->create(['status' => 'paused']);
    
    $response = $this->getJson('/api/v1/spaces');

    $response->assertStatus(200)
             ->assertJsonCount(1, 'data');
});

test('authenticated host can create a space', function () {
    $this->actingAsHost();

    $response = $this->postJson('/api/v1/spaces', [
        'title' => 'New Space',
        'description' => 'A beautiful space',
        'city' => 'Tegucigalpa',
        'type' => 'garage',
        'price_per_month' => 100,
    ]);

    $response->assertStatus(201)
             ->assertJsonPath('data.status', 'draft');
});

test('host cannot publish space with fewer than 5 photos', function () {
    $host = $this->actingAsHost();
    $space = Space::factory()->create(['user_id' => $host->id, 'status' => 'draft']);
    
    // Add 3 photos
    \App\Models\SpacePhoto::factory()->count(3)->create(['space_id' => $space->id]);

    $response = $this->postJson("/api/v1/spaces/{$space->uuid}/publish");

    $response->assertStatus(422);
});

test('host can publish space with 5+ photos', function () {
    $host = $this->actingAsHost();
    $space = Space::factory()->create(['user_id' => $host->id, 'status' => 'draft']);
    
    // Add 5 photos
    \App\Models\SpacePhoto::factory()->count(5)->create(['space_id' => $space->id]);

    $response = $this->postJson("/api/v1/spaces/{$space->uuid}/publish");

    $response->assertStatus(200)
             ->assertJsonPath('data.status', 'pending'); // Usually goes to pending first
});

test('non-owner cannot update space', function () {
    $this->actingAsHost();
    $space = Space::factory()->create(); // Owned by someone else

    $response = $this->patchJson("/api/v1/spaces/{$space->uuid}", [
        'title' => 'Updated Title',
    ]);

    $response->assertStatus(403);
});

test('view count increments via Redis', function () {
    Redis::shouldReceive('incr')->once();

    $space = Space::factory()->create(['status' => 'active']);
    
    $this->getJson("/api/v1/spaces/{$space->uuid}");
});
