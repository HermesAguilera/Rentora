<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\UserStatus;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || $request->user()->status !== UserStatus::ACTIVE) {
            return response()->json([
                'message' => 'Tu cuenta ha sido suspendida o bloqueada. Contacta soporte.',
                'status' => $request->user()?->status?->value ?? 'unknown'
            ], 403);
        }

        return $next($request);
    }
}
