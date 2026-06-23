<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use App\Models\Space;
use Illuminate\Http\Request;

class AdminSpaceController extends Controller
{
    public function index(Request $request)
    {
        $query = Space::query()->with('host');

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('host_id')) {
            $query->where('user_id', $request->query('host_id'));
        }

        if ($request->has('city')) {
            $query->where('city', $request->query('city'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->query('type'));
        }

        return response()->json($query->paginate());
    }

    public function show(Space $space)
    {
        $space->load('host', 'photos');
        return response()->json($space);
    }

    public function approve(Space $space)
    {
        $space->status = \App\Enums\SpaceStatus::ACTIVE;
        $space->save();

        // Notify host
        $space->host->notify(new \App\Notifications\SpaceApprovedNotification($space));

        return response()->json(['message' => 'Space approved', 'space' => $space]);
    }

    public function reject(Request $request, Space $space)
    {
        $request->validate(['rejection_reason' => 'required|string']);

        $space->status = \App\Enums\SpaceStatus::REJECTED;
        $space->save();

        // Notify host
        $space->host->notify(new \App\Notifications\SpaceRejectedNotification($space, $request->rejection_reason));

        return response()->json(['message' => 'Space rejected', 'space' => $space]);
    }
}
