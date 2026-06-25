<?php

use App\Models\Space;
use App\Models\User;
use App\Enums\SpaceStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can approve a space', function () {
    $this->actingAsAdmin();
    $space = Space::factory()->create(['status' => SpaceStatus::PENDING_REVIEW]);

    $response = $this->postJson("/api/v1/admin/spaces/{$space->uuid}/approve");

    $response->assertStatus(200)
             ->assertJsonPath('space.status', SpaceStatus::ACTIVE->value);
});

test('admin can reject a space with reason', function () {
    $this->actingAsAdmin();
    $space = Space::factory()->create(['status' => SpaceStatus::PENDING_REVIEW]);

    $response = $this->postJson("/api/v1/admin/spaces/{$space->uuid}/reject", [
        'rejection_reason' => 'Photos are blurry',
    ]);

    $response->assertStatus(200)
             ->assertJsonPath('space.status', SpaceStatus::REJECTED->value);
});

test('non-admin cannot access admin endpoints', function () {
    $this->actingAsHost(); // NOT an admin

    $response = $this->getJson('/api/v1/admin/stats');

    $response->assertStatus(403);
});

test('admin can suspend a user', function () {
    $this->actingAsAdmin();
    $user = User::factory()->create(['status' => 'active']);

    $response = $this->postJson("/api/v1/admin/users/{$user->uuid}/suspend", [
        'reason' => 'Violation of terms',
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'status' => 'suspended',
    ]);
});
