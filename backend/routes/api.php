<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\User\UserController;
use App\Http\Controllers\Api\V1\Space\SpaceController;
use App\Http\Controllers\Api\V1\Space\SpacePhotoController;
use App\Http\Middleware\EnsureUserIsActive;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        
        Route::middleware(['throttle:3,15'])->group(function () {
            Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        });
        Route::post('reset-password', [AuthController::class, 'resetPassword']);

        // Protected Auth Routes
        Route::middleware(['auth:sanctum', EnsureUserIsActive::class])->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::post('logout-all', [AuthController::class, 'logoutAll']);
            Route::post('refresh-token', [AuthController::class, 'refreshToken']);
            
            Route::get('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');
            Route::post('email/resend', [AuthController::class, 'resendEmailVerification'])->middleware('throttle:6,1');
        });
    });

    // User Routes
    Route::prefix('users')->group(function () {
        Route::get('{user:uuid}', [UserController::class, 'show']);

        Route::middleware(['auth:sanctum', EnsureUserIsActive::class])->group(function () {
            Route::get('me', [UserController::class, 'me']);
            Route::patch('me', [UserController::class, 'updateProfile']);
            Route::post('me/avatar', [UserController::class, 'uploadAvatar']);
            Route::get('me/stats', [UserController::class, 'stats']);
        });
    });

    // Space Routes
    Route::prefix('spaces')->group(function () {
        // Public Space Routes
        Route::get('/', [SpaceController::class, 'index']);
        Route::get('{space:uuid}', [SpaceController::class, 'show']);

        // Protected Space Routes
        Route::middleware(['auth:sanctum', EnsureUserIsActive::class])->group(function () {
            Route::post('/', [SpaceController::class, 'store']);
            Route::patch('{space:uuid}', [SpaceController::class, 'update']);
            Route::delete('{space:uuid}', [SpaceController::class, 'destroy']);
            
            Route::post('{space:uuid}/publish', [SpaceController::class, 'publish']);
            Route::post('{space:uuid}/pause', [SpaceController::class, 'pause']);
            Route::post('{space:uuid}/reactivate', [SpaceController::class, 'reactivate']);
            
            Route::get('{space:uuid}/bookings', [SpaceController::class, 'bookings']);

            // Photo Management
            Route::post('{space:uuid}/photos', [SpacePhotoController::class, 'store']);
            Route::delete('{space:uuid}/photos/{photo:uuid}', [SpacePhotoController::class, 'destroy']);
            Route::patch('{space:uuid}/photos/reorder', [SpacePhotoController::class, 'reorder']);
            Route::patch('{space:uuid}/photos/{photo:uuid}/set-primary', [SpacePhotoController::class, 'setPrimary']);
        });
    });

    // Authenticated Host routes
    Route::middleware(['auth:sanctum', EnsureUserIsActive::class])->group(function () {
        Route::get('me/spaces', [SpaceController::class, 'mySpaces']);

        // Notifications
        Route::get('me/notifications', [\App\Http\Controllers\Api\V1\NotificationController::class, 'index']);
        Route::patch('me/notifications/{id}/read', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markAsRead']);
        Route::patch('me/notifications/read-all', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markAllAsRead']);
        Route::get('me/notifications/unread-count', [\App\Http\Controllers\Api\V1\NotificationController::class, 'unreadCount']);

        // Bookings
        Route::prefix('bookings')->group(function () {
            Route::post('/', [\App\Http\Controllers\Api\V1\BookingController::class, 'store']);
            Route::get('/', [\App\Http\Controllers\Api\V1\BookingController::class, 'index']);
            Route::get('{booking:uuid}', [\App\Http\Controllers\Api\V1\BookingController::class, 'show']);
            Route::post('{booking:uuid}/confirm', [\App\Http\Controllers\Api\V1\BookingController::class, 'confirm']);
            Route::post('{booking:uuid}/cancel', [\App\Http\Controllers\Api\V1\BookingController::class, 'cancel']);
            Route::post('{booking:uuid}/complete', [\App\Http\Controllers\Api\V1\BookingController::class, 'complete']);
            Route::post('{booking:uuid}/dispute', [\App\Http\Controllers\Api\V1\BookingController::class, 'dispute']);
        });

        // Reviews
        Route::prefix('reviews')->group(function () {
            Route::post('/', [\App\Http\Controllers\Api\V1\ReviewController::class, 'store']);
            Route::post('{review:uuid}/flag', [\App\Http\Controllers\Api\V1\ReviewController::class, 'flag']);
        });
    });

    // Public Reviews Routes
    Route::get('spaces/{space:uuid}/reviews', [\App\Http\Controllers\Api\V1\ReviewController::class, 'spaceReviews']);
    Route::get('users/{user:uuid}/reviews', [\App\Http\Controllers\Api\V1\ReviewController::class, 'userReviews']);

    // Admin Routes
    Route::middleware(['auth:sanctum', EnsureUserIsActive::class, 'admin'])->prefix('admin')->group(function () {
        Route::get('stats', [\App\Http\Controllers\Api\V1\Admin\AdminStatsController::class, 'index']);

        Route::prefix('spaces')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\AdminSpaceController::class, 'index']);
            Route::get('{space:uuid}', [\App\Http\Controllers\Api\V1\Admin\AdminSpaceController::class, 'show']);
            Route::post('{space:uuid}/approve', [\App\Http\Controllers\Api\V1\Admin\AdminSpaceController::class, 'approve']);
            Route::post('{space:uuid}/reject', [\App\Http\Controllers\Api\V1\Admin\AdminSpaceController::class, 'reject']);
        });

        Route::prefix('users')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\AdminUserController::class, 'index']);
            Route::post('{user:uuid}/suspend', [\App\Http\Controllers\Api\V1\Admin\AdminUserController::class, 'suspend']);
            Route::post('{user:uuid}/reactivate', [\App\Http\Controllers\Api\V1\Admin\AdminUserController::class, 'reactivate']);
            Route::post('{user:uuid}/ban', [\App\Http\Controllers\Api\V1\Admin\AdminUserController::class, 'ban']);
            Route::post('{user:uuid}/verify-identity', [\App\Http\Controllers\Api\V1\Admin\AdminUserController::class, 'verifyIdentity']);
        });

        Route::prefix('bookings')->group(function () {
            Route::get('disputed', [\App\Http\Controllers\Api\V1\Admin\AdminDisputeController::class, 'index']);
            Route::post('{booking:uuid}/resolve-dispute', [\App\Http\Controllers\Api\V1\Admin\AdminDisputeController::class, 'resolve']);
        });

        Route::prefix('reviews')->group(function () {
            Route::get('flagged', [\App\Http\Controllers\Api\V1\Admin\AdminReviewController::class, 'flagged']);
            Route::post('{review:uuid}/hide', [\App\Http\Controllers\Api\V1\Admin\AdminReviewController::class, 'hide']);
            Route::post('{review:uuid}/restore', [\App\Http\Controllers\Api\V1\Admin\AdminReviewController::class, 'restore']);
        });
    });
});
