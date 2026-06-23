<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use OpenApi\Annotations as OA; // 👈 Importamos el alias clásico de anotaciones

class HealthCheckController extends BaseApiController
{
    /**
     * @OA\Get(
     * path="/api/v1/health",
     * summary="Verificar el estado de la API",
     * description="Retorna el estado de salud actual del backend de Rentora.",
     * tags={"Soporte"},
     * @OA\Response(
     * response=200,
     * description="API operativa y corriendo correctamente.",
     * @OA\JsonContent(ref="#/components/schemas/StandardSuccessResponse")
     * )
     * )
     */
    public function health(): JsonResponse
    {
        return $this->successResponse(null, 'API operativa y corriendo correctamente.');
    }
}