<?php

use App\Models\Space;
use App\Models\Booking;
use App\Enums\BookingStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

uses(RefreshDatabase::class);

test('renter can request booking for active space', function () {
    $renter = $this->actingAsRenter();
    $space = Space::factory()->create(['status' => 'active']);

    $response = $this->postJson('/api/v1/bookings', [
        'space_uuid' => $space->uuid,
        'start_date' => Carbon::tomorrow()->format('Y-m-d'),
        'months_duration' => 2,
    ]);

    $response->assertStatus(201)
             ->assertJsonPath('data.status', BookingStatus::PENDING->value);
});

test('renter cannot book their own space', function () {
    $host = $this->actingAsHost();
    $space = Space::factory()->create(['user_id' => $host->id, 'status' => 'active']);

    $response = $this->postJson('/api/v1/bookings', [
        'space_uuid' => $space->uuid,
        'start_date' => Carbon::tomorrow()->format('Y-m-d'),
        'months_duration' => 2,
    ]);

    $response->assertStatus(403);
});

test('renter cannot double-book overlapping dates', function () {
    $renter = $this->actingAsRenter();
    $space = Space::factory()->create(['status' => 'active']);

    Booking::factory()->create([
        'space_id' => $space->id,
        'start_date' => Carbon::tomorrow(),
        'end_date' => Carbon::tomorrow()->addMonths(2),
        'status' => BookingStatus::CONFIRMED,
    ]);

    $response = $this->postJson('/api/v1/bookings', [
        'space_uuid' => $space->uuid,
        'start_date' => Carbon::tomorrow()->addMonth()->format('Y-m-d'),
        'months_duration' => 1,
    ]);

    $response->assertStatus(422);
});

test('host can confirm a pending booking', function () {
    $host = $this->actingAsHost();
    $space = Space::factory()->create(['user_id' => $host->id, 'status' => 'active']);
    $booking = Booking::factory()->create([
        'space_id' => $space->id,
        'status' => BookingStatus::PENDING,
    ]);

    $response = $this->postJson("/api/v1/bookings/{$booking->uuid}/confirm");

    $response->assertStatus(200)
             ->assertJsonPath('data.status', BookingStatus::CONFIRMED->value);
});

test('non-host cannot confirm booking', function () {
    $this->actingAsHost(); // different host
    $booking = Booking::factory()->create(['status' => BookingStatus::PENDING]);

    $response = $this->postJson("/api/v1/bookings/{$booking->uuid}/confirm");

    $response->assertStatus(403);
});

test('invalid state transitions throw correct exception', function () {
    $this->withoutExceptionHandling();
    $host = $this->actingAsHost();
    $space = Space::factory()->create(['user_id' => $host->id]);
    $booking = Booking::factory()->create([
        'space_id' => $space->id,
        'status' => BookingStatus::ACTIVE, // Cannot confirm an already active booking
    ]);

    $this->expectException(\App\Exceptions\InvalidBookingTransitionException::class);

    $this->postJson("/api/v1/bookings/{$booking->uuid}/confirm");
});
