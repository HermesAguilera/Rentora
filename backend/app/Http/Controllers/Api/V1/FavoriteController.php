<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\SpacePublicResource;
use App\Models\Space;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class FavoriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $spaces = $request->user()
            ->favoriteSpaces()
            ->with(['host', 'photos'])
            ->withAvg('reviews as average_rating', 'rating')
            ->withCount('reviews as review_count')
            ->get();

        return response()->json(['data' => SpacePublicResource::collection($spaces)]);
    }

    public function store(Request $request, Space $space): JsonResponse
    {
        $request->user()->favoriteSpaces()->syncWithoutDetaching([$space->id]);

        return response()->json(['message' => 'Espacio guardado en favoritos.'], 201);
    }

    public function destroy(Request $request, Space $space): JsonResponse
    {
        $request->user()->favoriteSpaces()->detach($space->id);

        return response()->json(['message' => 'Espacio quitado de favoritos.']);
    }
}
