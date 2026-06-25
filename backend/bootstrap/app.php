<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);
        $middleware->append(\App\Http\Middleware\SanitizeInput::class);
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->renderable(function (Throwable $e, Request $request) {
            \Illuminate\Support\Facades\Log::error('Exception caught', ['class' => get_class($e), 'code' => $e->getCode(), 'message' => $e->getMessage()]);

            if ($request->is('api/*') || $request->wantsJson()) {
                $status = 500;
                $message = 'Server Error';
                $errors = null;

                if ($e instanceof AuthenticationException) {
                    $status = 401;
                    $message = 'Unauthenticated';
                } elseif ($e instanceof AuthorizationException) {
                    $status = 403;
                    $message = 'Forbidden action';
                } elseif ($e instanceof ModelNotFoundException) {
                    $status = 404;
                    $message = 'Resource not found';
                } elseif ($e instanceof ValidationException) {
                    $status = 422;
                    $message = 'Validation failed';
                    $errors = $e->errors();
                } elseif ($e instanceof ThrottleRequestsException) {
                    $status = 429;
                    $message = 'Too many requests';
                } else {
                    $message = config('app.debug') ? $e->getMessage() : 'An unexpected error occurred.';
                }

                // Ensure status is a valid HTTP status code
                $status = ($status >= 100 && $status <= 599) ? $status : 500;

                return response()->json([
                    'success' => false,
                    'message' => $message,
                    'data'    => (object)[],
                    'meta'    => (object)[],
                    'errors'  => $errors,
                ], $status);
            }
        });
    })->create();
