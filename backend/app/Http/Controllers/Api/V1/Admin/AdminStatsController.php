<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use App\Models\User;
use App\Models\Space;
use App\Models\Booking;
use Illuminate\Support\Facades\Cache;

class AdminStatsController extends Controller
{
    public function index()
    {
        return response()->json(Cache::remember('admin.stats', 300, function () {
            return [
                'users' => [
                    'total' => User::count(),
                    'active' => User::where('status', 'active')->count(),
                    'new_this_month' => User::whereMonth('created_at', now()->month)->count(),
                ],
                'spaces' => [
                    'total' => Space::count(),
                    'active' => Space::where('status', \App\Enums\SpaceStatus::ACTIVE)->count(),
                    'pending_review' => Space::where('status', \App\Enums\SpaceStatus::PENDING_REVIEW)->count(),
                ],
                'bookings' => [
                    'total' => Booking::count(),
                    'active' => Booking::where('status', \App\Enums\BookingStatus::ACTIVE)->count(),
                    'completed_this_month' => Booking::where('status', \App\Enums\BookingStatus::COMPLETED)
                        ->whereMonth('end_date', now()->month)
                        ->count(),
                ],
                'revenue' => [
                    'total_platform_fees' => Booking::where('status', \App\Enums\BookingStatus::COMPLETED)->sum('platform_fee_amount'),
                    'this_month' => Booking::where('status', \App\Enums\BookingStatus::COMPLETED)
                        ->whereMonth('end_date', now()->month)
                        ->sum('platform_fee_amount'),
                ]
            ];
        }));
    }
}
