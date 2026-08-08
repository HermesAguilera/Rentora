<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

/** Avisa al inquilino o al anfitrión de un cambio en una reserva. */
class BookingStatusNotification extends Notification
{
    use Queueable;

    /**
     * @param  string  $url  Pantalla del frontend a la que lleva la notificación
     *                       al hacer clic (depende de a quién se le notifica).
     */
    public function __construct(
        public Booking $booking,
        public string $title,
        public string $description,
        public string $url = '/app/reservas',
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'category' => 'booking',
            'title' => $this->title,
            'description' => $this->description,
            'booking_uuid' => $this->booking->uuid,
            'url' => $this->url,
        ];
    }
}
