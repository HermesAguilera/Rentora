<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Routing\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->query('role'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        return response()->json($query->paginate());
    }

    public function suspend(Request $request, User $user)
    {
        $request->validate(['reason' => 'required|string']);

        $user->status = 'suspended';
        $user->save();

        // Revoke all tokens
        $user->tokens()->delete();

        return response()->json(['message' => 'User suspended']);
    }

    public function reactivate(User $user)
    {
        $user->status = 'active';
        $user->save();

        return response()->json(['message' => 'User reactivated']);
    }

    public function ban(Request $request, User $user)
    {
        $request->validate(['reason' => 'required|string']);

        $user->status = 'banned';
        $user->save();

        // Revoke all tokens
        $user->tokens()->delete();

        return response()->json(['message' => 'User banned permanently']);
    }

    public function verifyIdentity(User $user)
    {
        $user->identity_verified_at = now();
        $user->save();

        return response()->json(['message' => 'User identity verified']);
    }
}
