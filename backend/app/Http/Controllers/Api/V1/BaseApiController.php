<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\JsonResponse;
use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 * version="1.0.0",
 * title="Rentora API",
 * description="Peer-to-peer storage rental marketplace API.",
 * @OA\Contact(email="dev@rentora.hn"),
 * @OA\License(name="Proprietary")
 * )
 *
 * @OA\Server(
 * url=L5_SWAGGER_CONST_HOST,
 * description="Current environment"
 * )
 *
 * @OA\SecurityScheme(
 * securityScheme="bearerAuth",
 * type="http",
 * scheme="bearer",
 * bearerFormat="JWT",
 * name="Authorization",
 * in="header",
 * description="Introduce tu token JWT en el formato: Bearer {token}"
 * )
 *
 * @OA\Schema(
 * schema="StandardSuccessResponse",
 * type="object",
 * @OA\Property(property="success", type="boolean", example=true),
 * @OA\Property(property="message", type="string", example="Success"),
 * @OA\Property(property="data", type="object"),
 * @OA\Property(property="meta", type="object"),
 * @OA\Property(property="errors", type="null", example=null)
 * )
 *
 * @OA\Schema(
 * schema="StandardErrorResponse",
 * type="object",
 * @OA\Property(property="success", type="boolean", example=false),
 * @OA\Property(property="message", type="string", example="Error"),
 * @OA\Property(property="data", type="object"),
 * @OA\Property(property="meta", type="object"),
 * @OA\Property(property="errors", type="object", nullable=true)
 * )
 */
abstract class BaseApiController extends BaseController
{
    /**
     * Return a standardized success response.
     */
    protected function successResponse(mixed $data = [], string $message = 'Success', array $meta = [], int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
            'meta'    => empty($meta) ? (object)[] : $meta,
            'errors'  => null,
        ], $status);
    }

    /**
     * Return a standardized error response.
     */
    protected function errorResponse(string $message = 'Error', mixed $errors = null, int $status = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data'    => (object)[],
            'meta'    => (object)[],
            'errors'  => $errors,
        ], $status);
    }

    /**
     * Return a paginated success response.
     */
    protected function paginatedResponse(mixed $paginator, string $message = 'Success'): JsonResponse
    {
        $data = $paginator->items();
        $meta = [
            'total'        => $paginator->total(),
            'per_page'     => $paginator->perPage(),
            'current_page' => $paginator->currentPage(),
            'last_page'    => $paginator->lastPage(),
        ];

        return $this->successResponse($data, $message, $meta);
    }

    /**
     * Return a not found error response.
     */
    protected function notFoundResponse(string $message = 'Resource not found'): JsonResponse
    {
        return $this->errorResponse($message, null, 404);
    }

    /**
     * Return a forbidden error response.
     */
    protected function forbiddenResponse(string $message = 'Forbidden action'): JsonResponse
    {
        return $this->errorResponse($message, null, 403);
    }
}