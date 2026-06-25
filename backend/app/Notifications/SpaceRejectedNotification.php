<?php

namespace App\Notifications;

use App\Models\Space;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SpaceRejectedNotification extends Notification
{
    use Queueable;

    public function __construct(public Space $space, public string $reason)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Actualización sobre tu Espacio')
                    ->line("Tu espacio '{$this->space->title}' no ha podido ser aprobado.")
                    ->line("Motivo: {$this->reason}")
                    ->line('Por favor, realiza los cambios necesarios y vuelve a enviarlo.');
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
