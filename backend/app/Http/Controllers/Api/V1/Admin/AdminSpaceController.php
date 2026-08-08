<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use App\Models\Space;
use Illuminate\Http\Request;

class AdminSpaceController extends Controller
{
    public function index(Request $request)
    {
        // `photos` va precargado porque el accesor primary_photo_url lo consulta por fila.
        $query = Space::query()->with(['host', 'photos'])->latest();

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('host_id')) {
            $query->where('host_id', $request->query('host_id'));
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
        $space->published_at ??= now();
        $space->save();

        // Notify host
        $space->host->notify(new \App\Notifications\SpaceApprovedNotification($space));

        $this->forgetCachedStats();

        return response()->json(['message' => 'Space approved', 'space' => $space]);
    }

    /** El resumen de admin se cachea 5 minutos; tras moderar debe reflejarse ya. */
    private function forgetCachedStats(): void
    {
        \Illuminate\Support\Facades\Cache::forget('admin.stats');
        \Illuminate\Support\Facades\Cache::forget('public.stats');
    }

    public function reject(Request $request, Space $space)
    {
        $request->validate(['rejection_reason' => 'required|string']);

        $space->status = \App\Enums\SpaceStatus::REJECTED;
        $space->save();

        // Notify host
        $space->host->notify(new \App\Notifications\SpaceRejectedNotification($space, $request->rejection_reason));

        $this->forgetCachedStats();

        return response()->json(['message' => 'Space rejected', 'space' => $space]);
    }
}
