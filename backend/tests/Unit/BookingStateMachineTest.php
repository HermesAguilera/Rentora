<?php

use App\Services\BookingStateMachine;
use App\Enums\BookingStatus;

test('pending can transition to confirmed', function () {
    expect(BookingStateMachine::canTransition(BookingStatus::PENDING, BookingStatus::CONFIRMED))->toBeTrue();
});

test('pending can transition to cancelled by renter', function () {
    expect(BookingStateMachine::canTransition(BookingStatus::PENDING, BookingStatus::CANCELLED_BY_RENTER))->toBeTrue();
});

test('pending cannot transition to active', function () {
    expect(BookingStateMachine::canTransition(BookingStatus::PENDING, BookingStatus::ACTIVE))->toBeFalse();
});

test('confirmed can transition to active', function () {
    expect(BookingStateMachine::canTransition(BookingStatus::CONFIRMED, BookingStatus::ACTIVE))->toBeTrue();
});

test('active can transition to completed', function () {
    expect(BookingStateMachine::canTransition(BookingStatus::ACTIVE, BookingStatus::COMPLETED))->toBeTrue();
});

test('active can transition to disputed', function () {
    expect(BookingStateMachine::canTransition(BookingStatus::ACTIVE, BookingStatus::DISPUTED))->toBeTrue();
});

test('completed cannot transition anywhere', function () {
    expect(BookingStateMachine::canTransition(BookingStatus::COMPLETED, BookingStatus::ACTIVE))->toBeFalse();
    expect(BookingStateMachine::canTransition(BookingStatus::COMPLETED, BookingStatus::DISPUTED))->toBeFalse();
});
