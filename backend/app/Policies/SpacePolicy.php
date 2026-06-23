<?php

namespace App\Policies;

use App\Models\Space;
use App\Models\User;
use App\Enums\UserRole;

class SpacePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Space $space): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [UserRole::HOST, UserRole::BOTH]);
    }

    public function update(User $user, Space $space): bool
    {
        return $user->id === $space->host_id || $user->role === UserRole::ADMIN;
    }

    public function delete(User $user, Space $space): bool
    {
        return $user->id === $space->host_id || $user->role === UserRole::ADMIN;
    }

    public function publish(User $user, Space $space): bool
    {
        return $user->id === $space->host_id;
    }

    public function pause(User $user, Space $space): bool
    {
        return $user->id === $space->host_id;
    }

    public function reactivate(User $user, Space $space): bool
    {
        return $user->id === $space->host_id;
    }

    public function viewBookings(User $user, Space $space): bool
    {
        return $user->id === $space->host_id || $user->role === UserRole::ADMIN;
    }
}
