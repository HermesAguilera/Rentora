<?php

namespace App\Listeners;

use App\Enums\BookingStatus;
use App\Events\BookingStatusChanged;
use App\Notifications\BookingStatusNotification;

/** Manda a la campana de notificaciones cada cambio de estado de una reserva. */
class NotifyBookingParticipants
{
    /** Pantallas del frontend según a quién se le notifica. */
    private const RENTER_URL = '/app/reservas';
    private const HOST_URL = '/dashboard/reservas';

    public function handle(BookingStatusChanged $event): void
    {
        $booking = $event->booking->loadMissing('space');
        $spaceTitle = $booking->space?->title ?? 'tu espacio';

        [$notifiable, $title, $description, $url] = match ($event->newStatus) {
            BookingStatus::CONFIRMED => [
                $booking->renter,
                'Reserva confirmada',
                "El anfitrión confirmó tu reserva de {$spaceTitle}.",
                self::RENTER_URL,
            ],
            BookingStatus::ACTIVE => [
                $booking->renter,
                'Tu alquiler está activo',
                "Ya puedes usar {$spaceTitle}.",
                self::RENTER_URL,
            ],
            BookingStatus::COMPLETED => [
                $booking->renter,
                'Alquiler finalizado',
                "Terminó tu alquiler de {$spaceTitle}. Deja una reseña al anfitrión.",
                self::RENTER_URL,
            ],
            BookingStatus::CANCELLED_BY_HOST => [
                $booking->renter,
                'Reserva cancelada',
                "El anfitrión canceló tu reserva de {$spaceTitle}.",
                self::RENTER_URL,
            ],
            BookingStatus::CANCELLED_BY_RENTER => [
                $booking->host,
                'Reserva cancelada',
                "El inquilino canceló la reserva de {$spaceTitle}.",
                self::HOST_URL,
            ],
            default => [null, '', '', self::RENTER_URL],
        };

        $notifiable?->notify(new BookingStatusNotification($booking, $title, $description, $url));
    }
}
