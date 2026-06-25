<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\JsonResponse;

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
