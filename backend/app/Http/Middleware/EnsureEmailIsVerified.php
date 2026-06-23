<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->email_verified_at) {
            return response()->json([
                'message' => 'Tu dirección de correo electrónico no está verificada.'
            ], 403);
        }

        return $next($request);
    }
}
