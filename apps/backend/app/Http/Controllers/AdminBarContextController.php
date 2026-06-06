<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\PageContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminBarContextController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = Auth::user();

        $emptyContext = [
            'pages' => [],
            'menus' => [],
            'enabled_modules' => [],
        ];

        if (! $user || ! $user->hasAnyRole(['super-admin', 'admin'])) {
            return response()->json($emptyContext);
        }

        $themeKey = $request->query('theme_key');

        if (! is_string($themeKey) || $themeKey === '') {
            return response()->json($emptyContext);
        }

        $pages = PageContent::query()
            ->where('theme_key', $themeKey)
            ->select('page')
            ->distinct()
            ->orderBy('page')
            ->pluck('page')
            ->values();

        $menus = Menu::query()
            ->where('theme_key', $themeKey)
            ->where('status', 'active')
            ->orderBy('title')
            ->get(['id', 'title', 'location_key'])
            ->map(fn (Menu $menu) => [
                'id' => $menu->id,
                'title' => $menu->title,
                'location_key' => $menu->location_key,
            ])
            ->values();

        $listingModules = [
            'properties',
            'autos',
            'events',
            'jobs',
            'services',
            'classifieds',
            'products',
        ];

        $enabledModules = array_values(array_filter(
            $listingModules,
            fn (string $module): bool => module_enabled($module),
        ));

        return response()->json([
            'pages' => $pages,
            'menus' => $menus,
            'enabled_modules' => $enabledModules,
        ]);
    }
}
