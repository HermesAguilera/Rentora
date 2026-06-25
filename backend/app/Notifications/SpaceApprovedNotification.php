<?php

namespace App\Notifications;

use App\Models\Space;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SpaceApprovedNotification extends Notification
{
    use Queueable;

    public function __construct(public Space $space)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('¡Espacio Aprobado!')
                    ->line("Tu espacio '{$this->space->title}' ha sido aprobado y ya está público.")
                    ->action('Ver Espacio', url('/spaces/'.$this->space->uuid))
                    ->line('¡Gracias por usar Rentora!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
