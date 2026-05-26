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

        if (! $user || ! $user->hasAnyRole(['super-admin', 'admin'])) {
            return response()->json([
                'pages' => [],
                'menus' => [],
            ]);
        }

        $themeKey = $request->query('theme_key');

        if (! is_string($themeKey) || $themeKey === '') {
            return response()->json([
                'pages' => [],
                'menus' => [],
            ]);
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

        return response()->json([
            'pages' => $pages,
            'menus' => $menus,
        ]);
    }
}
