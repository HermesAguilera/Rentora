<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;

class HealthCheckController extends BaseApiController
{
    public function health(): JsonResponse
    {
        return $this->successResponse(null, 'API operativa y corriendo correctamente.');
    }
}
