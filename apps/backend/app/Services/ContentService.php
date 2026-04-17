<?php

namespace App\Services;

use App\Models\PageContent;
use App\DTOs\ContentResult;
use Illuminate\Support\Facades\{Cache, Auth, Config, Storage};
use Illuminate\Http\Request;

class ContentService
{
    protected const FILE_COLLECTION = 'page_content';
    protected ?string $activeTheme;

    public function __construct(Request $request)
    {
        $this->activeTheme = $request->get('themeKey') ?? Config::get('app.default_theme', 'default');
    }

    public function get(string $keyString, $default = null): mixed
    {
        $parts = explode('.', $keyString);
        if (count($parts) < 3) return $default;
        [$page, $section, $key] = $parts; 

        $isAdmin = Auth::check() && Auth::user()->hasRole(['admin', 'super-admin']);
        $frontendEditEnabled = (bool) setting('frontend_edit', false);

        // 1. Visitor/Guest Path
        if (!$isAdmin || !$frontendEditEnabled) {
            $cacheKey = $this->generateCacheKey($page, $section, $key);
            return Cache::rememberForever($cacheKey, fn() => $this->fetchFromDb($page, $section, $key, $default));
        }

        // 2. Admin Path
        $setting = PageContent::firstOrCreate([
            'theme_key'     => $this->activeTheme,
            'page'        => $page,
            'section'     => $section,
            'content_key' => $key,
        ], [
            'value'      => $default,
            'input_type' => 'text',
        ]);

        return new ContentResult(
            id: $setting->id, 
            value: $this->formatValue($setting, $default)
        );
    }

    protected function formatValue(PageContent $setting, $default): mixed
    {
        if (in_array($setting->input_type, ['logo', 'file', 'image'])) {
            // Logic to handle media library or raw paths
            $value = $setting->value ?? $default;
            return $value ? Storage::url($value) : $default;
        }
        return $setting->value ?? $default;
    }

    protected function fetchFromDb($page, $section, $key, $default)
    {
        $setting = PageContent::where([
            'theme_key'     => $this->activeTheme,
            'page'        => $page,
            'section'     => $section,
            'content_key' => $key,
        ])->first();

        return $setting ? $this->formatValue($setting, $default) : $default;
    }

    protected function generateCacheKey($page, $section, $key): string
    {
        return "page_content.{$this->activeTheme}.{$page}.{$section}.{$key}";
    }
}
