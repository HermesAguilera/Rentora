<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Rentora API Backend is running',
        'laravel_version' => app()->version()
    ]);
});