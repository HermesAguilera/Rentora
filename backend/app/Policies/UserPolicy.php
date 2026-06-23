<?php

namespace App\Policies;

use App\Models\User;
use App\Enums\UserRole;

class UserPolicy
{
    public function view(User $user, User $model): bool
    {
        return $user->id === $model->id || $user->role === UserRole::ADMIN;
    }

    public function update(User $user, User $model): bool
    {
        return $user->id === $model->id || $user->role === UserRole::ADMIN;
    }

    public function delete(User $user, User $model): bool
    {
        return $user->id === $model->id || $user->role === UserRole::ADMIN;
    }
}
