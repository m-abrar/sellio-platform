<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuResource;
use App\Models\Theme;
use App\Services\MenuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiMenuController extends Controller
{
    public function show(Request $request, string $locationKey, MenuService $menuService): JsonResponse
    {
        if (! in_array($locationKey, MenuService::MENU_LOCATIONS, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Unknown menu location',
                'data'    => null,
            ], 404);
        }

        $themeKey = $this->resolveThemeKey($request);
        $menu = $menuService->getForApi($locationKey, $themeKey);

        return response()->json([
            'success' => true,
            'message' => 'Menu retrieved',
            'data'    => new MenuResource($menu),
        ]);
    }

    public function index(Request $request, MenuService $menuService): JsonResponse
    {
        $requestedLocations = $request->query('locations', '');
        $locationValues = is_array($requestedLocations)
            ? $requestedLocations
            : explode(',', (string) $requestedLocations);

        $locations = collect($locationValues)
            ->map(fn ($location) => trim($location))
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($locations === []) {
            $locations = [MenuService::MENU_LOCATIONS[0]];
        }

        $invalid = array_diff($locations, MenuService::MENU_LOCATIONS);
        if ($invalid !== []) {
            return response()->json([
                'success' => false,
                'message' => 'Unknown menu location(s): ' . implode(', ', $invalid),
                'data'    => null,
            ], 422);
        }

        $themeKey = $this->resolveThemeKey($request);
        $menus = $menuService->getForApiBatch($locations, $themeKey);

        $payload = collect($menus)
            ->mapWithKeys(fn (array $menu, string $locationKey) => [
                $locationKey => (new MenuResource($menu))->resolve(),
            ])
            ->all();

        return response()->json([
            'success' => true,
            'message' => 'Menus retrieved',
            'data'    => $payload,
        ]);
    }

    protected function resolveThemeKey(Request $request): ?string
    {
        $themeKey = $request->header('X-Theme-Key') ?? $request->query('theme_key');

        if (! $themeKey) {
            return null;
        }

        return Theme::where('theme_key', $themeKey)->exists() ? $themeKey : null;
    }
}
