<?php

namespace App\Enums;

class TokenAbility
{
    public const ACCESS_API = 'access-api';
    
    // User Abilities
    public const PROFILE_UPDATE = 'profile:update';
    
    // Renter Abilities
    public const BOOKING_CREATE = 'booking:create';
    public const REVIEW_CREATE = 'review:create';

    // Host Abilities
    public const SPACE_CREATE = 'space:create';
    public const SPACE_UPDATE = 'space:update';
    public const SPACE_DELETE = 'space:delete';
    public const BOOKING_MANAGE = 'booking:manage';

    // Admin Abilities
    public const ADMIN_ACCESS = 'admin:access';
    public const USER_MANAGE = 'user:manage';

    public static function forRole(UserRole $role): array
    {
        $abilities = [self::ACCESS_API, self::PROFILE_UPDATE];

        if ($role === UserRole::RENTER || $role === UserRole::BOTH) {
            $abilities = array_merge($abilities, [
                self::BOOKING_CREATE,
                self::REVIEW_CREATE,
            ]);
        }

        if ($role === UserRole::HOST || $role === UserRole::BOTH) {
            $abilities = array_merge($abilities, [
                self::SPACE_CREATE,
                self::SPACE_UPDATE,
                self::SPACE_DELETE,
                self::BOOKING_MANAGE,
            ]);
        }

        if ($role === UserRole::ADMIN) {
            $abilities = array_merge($abilities, [
                self::ADMIN_ACCESS,
                self::USER_MANAGE,
            ]);
        }

        return array_unique($abilities);
    }
}
