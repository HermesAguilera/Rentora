<?php

namespace App\Enums;

enum SpaceStatus: string
{
    case DRAFT = 'draft';
    case PENDING_REVIEW = 'pending_review';
    case ACTIVE = 'active';
    case REJECTED = 'rejected';
    case PAUSED = 'paused';

    public function label(): string
    {
        return match($this) {
            self::DRAFT => 'Borrador',
            self::PENDING_REVIEW => 'Pendiente de Revisión',
            self::ACTIVE => 'Activo',
            self::REJECTED => 'Rechazado',
            self::PAUSED => 'Pausado',
        };
    }
}
