<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Theme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ApiThemeController extends Controller
{
    /**
     * Get the currently active theme based on x-theme-key header,
     * or fallback to the globally active theme in the database.
     */
    public function active(Request $request): JsonResponse
    {
        $themeKey = $request->header('X-Theme-Key');

        $theme = null;

        if ($themeKey) {
            $theme = Theme::where('theme_key', $themeKey)->first();
        }

        if (!$theme) {
            $theme = Theme::active()->first();
        }

        if (!$theme) {
            return response()->json([
                'success' => false,
                'message' => 'No active theme found',
                'data'    => null,
            ], 404);
        }

        $settings = Setting::whereIn('key', [
            'site_name', 'site_logo', 'hide_site_name',
            'site_favicon', 'meta_title', 'meta_description',
        ])->pluck('value', 'key');

        $logoPath = $settings->get('site_logo');
        if ($logoPath) {
            $settings['site_logo'] = url(Storage::url($logoPath));
        }

        $faviconPath = $settings->get('site_favicon');
        if ($faviconPath) {
            $settings['site_favicon'] = url(Storage::url($faviconPath));
        }

        return response()->json([
            'success' => true,
            'message' => 'Active theme retrieved',
            'data'    => array_merge($theme->toArray(), [
                'app_settings' => $settings
            ]),
        ]);
    }

    /**
     * List all themes, with optional vertical and active_only filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Theme::orderBy('order');

        if ($request->has('vertical')) {
            $query->where('vertical', $request->query('vertical'));
        }

        if ($request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        return response()->json([
            'success' => true,
            'message' => 'Themes retrieved',
            'data'    => $query->get(),
        ]);
    }
}
