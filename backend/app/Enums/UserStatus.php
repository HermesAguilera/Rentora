<?php

namespace App\Enums;

enum UserStatus: string
{
    case PENDING_VERIFICATION = 'pending_verification';
    case ACTIVE = 'active';
    case SUSPENDED = 'suspended';
    case BANNED = 'banned';

    public function label(): string
    {
        return match($this) {
            self::PENDING_VERIFICATION => 'Pendiente de Verificación',
            self::ACTIVE => 'Activo',
            self::SUSPENDED => 'Suspendido',
            self::BANNED => 'Baneado',
        };
    }
}
