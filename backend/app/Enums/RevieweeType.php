<?php

namespace App\Enums;

enum RevieweeType: string
{
    case HOST = 'host';
    case RENTER = 'renter';

    public function label(): string
    {
        return match($this) {
            self::HOST => 'Anfitrión',
            self::RENTER => 'Inquilino',
        };
    }
}
