<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Log;

class LogAuthEvents
{
    public function handleLogin(Login $event)
    {
        Log::info('User Logged In', [
            'user_uuid' => $event->user->uuid ?? null,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function handleFailed(Failed $event)
    {
        Log::warning('Failed Login Attempt', [
            'email' => $event->credentials['email'] ?? null,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function handleLogout(Logout $event)
    {
        Log::info('User Logged Out', [
            'user_uuid' => $event->user->uuid ?? null,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function subscribe($events)
    {
        return [
            Login::class => 'handleLogin',
            Failed::class => 'handleFailed',
            Logout::class => 'handleLogout',
        ];
    }
}
