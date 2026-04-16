<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

trait ApiResponseTrait
{
    /**
     * Return a success JSON response.
     *
     * @param  mixed  $data
     * @param  string|null  $message
     * @param  int  $code
     * @param  array  $meta
     * @return \Illuminate\Http\JsonResponse
     */
    protected function successResponse(mixed $data = null, ?string $message = null, int $code = 200, array $meta = []): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message ?? 'Success',
            'errors' => null, // Strict requirement from spec
        ];

        if ($data !== null) {
            if ($data instanceof AnonymousResourceCollection) {
                // For Pagination/Collections
                $responseData = $data->response()->getData(true);
                $response['data'] = $responseData['data'] ?? [];
                
                // Merge passed meta with Laravel's pagination meta
                $response['meta'] = array_merge(
                    $meta, 
                    $responseData['meta'] ?? [],
                    ['links' => $responseData['links'] ?? []]
                );
            } elseif ($data instanceof JsonResource) {
                // Single Resource
                $responseData = $data->response()->getData(true);
                $response['data'] = $responseData['data'] ?? $responseData;
                
                if (!empty($meta)) {
                    $response['meta'] = $meta;
                }
            } else {
                // Regular array or object
                $response['data'] = $data;
                
                if (!empty($meta)) {
                    $response['meta'] = $meta;
                }
            }
        } else {
            $response['data'] = null;
        }

        return response()->json($response, $code);
    }

    /**
     * Return an error JSON response.
     *
     * @param  string  $message
     * @param  int  $code
     * @param  mixed  $errors
     * @return \Illuminate\Http\JsonResponse
     */
    protected function errorResponse(string $message, int $code = 400, mixed $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }
}
