<?php

namespace App\Enums;

enum SpaceType: string
{
    case GARAGE = 'garage';
    case ROOM = 'room';
    case WAREHOUSE = 'warehouse';
    case CLOSET = 'closet';
    case OTHER = 'other';

    public function label(): string
    {
        return match($this) {
            self::GARAGE => 'Garaje',
            self::ROOM => 'Habitación',
            self::WAREHOUSE => 'Bodega',
            self::CLOSET => 'Closet',
            self::OTHER => 'Otro',
        };
    }
}
