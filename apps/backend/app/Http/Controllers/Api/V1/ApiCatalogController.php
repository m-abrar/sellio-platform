<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Aggregates all vertical catalog data in a single request.
 *
 * The Next.js storefront previously fired 7 parallel HTTP requests (one per
 * vertical) on every home page load. On php artisan serve (single-threaded)
 * those queue up sequentially. This endpoint runs all 7 queries server-side
 * inside one PHP process and caches the combined result for 5 minutes,
 * reducing browser → server round trips from 7 to 1.
 */
class ApiCatalogController extends Controller
{
    public function home(): JsonResponse
    {
        $data = Cache::remember('api_catalog_home_v1', 300, function () {
            $request = new Request(['per_page' => 4, 'page' => 1]);

            return [
                'products'    => $this->fetch(ApiProductController::class,    $request),
                'properties'  => $this->fetch(ApiPropertyController::class,   $request),
                'autos'       => $this->fetch(ApiAutoController::class,       $request),
                'events'      => $this->fetch(ApiEventController::class,      $request),
                'jobs'        => $this->fetch(ApiJobController::class,        $request),
                'services'    => $this->fetch(ApiServiceController::class,    $request),
                'classifieds' => $this->fetch(ApiClassifiedController::class, $request),
            ];
        });

        return response()->json($data);
    }

    /**
     * Call an existing vertical API controller's index() and decode its JSON.
     * Failures return a safe empty envelope so one broken vertical never
     * blocks the whole home page.
     */
    private function fetch(string $controllerClass, Request $request): array
    {
        try {
            $collection = app($controllerClass)->index($request);
            $json       = $collection->toResponse($request)->content();

            return json_decode($json, true)
                ?? ['data' => [], 'meta' => ['total' => 0, 'last_page' => 1], 'sidebar' => ['categories' => []]];
        } catch (\Throwable $e) {
            return ['data' => [], 'meta' => ['total' => 0, 'last_page' => 1], 'sidebar' => ['categories' => []]];
        }
    }
}
