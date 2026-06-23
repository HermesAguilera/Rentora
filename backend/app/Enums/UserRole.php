<?php

namespace App\Enums;

enum UserRole: string
{
    case RENTER = 'renter';
    case HOST = 'host';
    case BOTH = 'both';
    case ADMIN = 'admin';

    public function label(): string
    {
        return match($this) {
            self::RENTER => 'Inquilino',
            self::HOST => 'Anfitrión',
            self::BOTH => 'Ambos',
            self::ADMIN => 'Administrador',
        };
    }
}
